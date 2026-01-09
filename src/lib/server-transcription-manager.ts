import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { storageClient } from "@/lib/storage-client";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const TRANSCRIPTION_SERVICE_URL =
  process.env.TRANSCRIPTION_SERVICE_URL || "http://localhost:5000";

export class ServerTranscriptionManager {
  /**
   * Pobiera rekord pliku z bazy danych.
   */
  async getFileRecord(fileId: string) {
    const fileRecord = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.id, fileId))
      .limit(1);

    return fileRecord[0] || null;
  }

  /**
   * Sprawdza czy plik jest gotowy do transkrypcji.
   */
  async validateForTranscription(fileId: string) {
    const file = await this.getFileRecord(fileId);

    if (!file) {
      throw new Error("File not found");
    }

    if (file.status === "processing") {
      throw new Error("File is already being processed");
    }

    if (file.status === "completed") {
      return { completed: true, srtUrl: file.srtUrl };
    }

    return { completed: false, file };
  }

  /**
   * Rozpoczyna proces transkrypcji w dokerze.
   */
  async startTranscription(fileId: string, language?: string) {
    const validation = await this.validateForTranscription(fileId);

    if (validation.completed) {
      return {
        success: true,
        alreadyCompleted: true,
        srtUrl: validation.srtUrl,
      };
    }

    const file = validation.file!;

    const response = await fetch(`${TRANSCRIPTION_SERVICE_URL}/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: file.id,
        audioUrl: file.url,
        language: language || "auto",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Transcription service error");
    }

    const result = await response.json();
    return { success: true, ...result };
  }

  /**
   * Obsługuje przesyłanie pliku i tworzenie rekordu w db.
   */
  async uploadFile(file: File, userId: string) {
    const fileId = randomUUID();
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, "");
    const filePath = `${userId}/${fileId}-${sanitizedFileName}`;

    const { error: uploadErr } = await storageClient.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      throw new Error("Upload failed");
    }

    const { data: urlData } = storageClient.storage
      .from("uploads")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Create DB Record
    await db.insert(fileTable).values({
      id: fileId,
      userId: userId || null,
      type: file.type,
      size: file.size.toString(),
      duration: "1",
      url: publicUrl,
      status: "pending",
    });

    return {
      id: fileId,
      url: publicUrl,
      status: "pending",
    };
  }

  /**
   * Pobiera plik SRT ze storage.
   */
  async downloadSrt(fileId: string) {
    const file = await this.getFileRecord(fileId);

    if (!file) {
      throw new Error("File not found");
    }

    if (file.status !== "completed" || !file.srtUrl) {
      throw new Error("Transcription not completed yet");
    }

    const srtPath = `transcriptions/${fileId}.srt`;
    const { data, error } = await storageClient.storage
      .from("subtitles")
      .download(srtPath);

    if (error || !data) {
      throw new Error("Failed to download SRT file");
    }

    return data; // Blob
  }

  /**
   * Pobiera przetworzone pliki użytkownika wraz z podglądem.
   */
  async getUserFilesWithPreviews(userId: string) {
    const { and, desc } = await import("drizzle-orm");

    const files = await db
      .select()
      .from(fileTable)
      .where(
        and(eq(fileTable.userId, userId), eq(fileTable.status, "completed"))
      )
      .orderBy(desc(fileTable.createdAt));

    const filesWithPreviews = await Promise.all(
      files.map(async (file) => {
        let preview = "Ładowanie...";
        let fullContent = "";

        if (file.srtUrl) {
          const transcription = await this.getTranscriptionPreview(file.srtUrl);
          preview = transcription.preview;
          fullContent = transcription.fullContent;
        }

        const urlParts = file.url.split("/");
        const fileNamePart = urlParts[urlParts.length - 1];
        let originalName = fileNamePart;

        if (/^[0-9a-fA-F-]{36}-/.test(fileNamePart)) {
          originalName = fileNamePart.slice(37);
        }

        originalName = decodeURIComponent(originalName);
        originalName = originalName.replace(
          /\.(mp3|wav|m4a|ogg|flac|aac|wma)$/i,
          ".srt"
        );

        return {
          id: file.id,
          originalName: decodeURIComponent(originalName),
          srtUrl: file.srtUrl || "",
          transcriptionPreview: preview,
          fullContent: fullContent,
          createdAt: file.createdAt || new Date().toISOString(),
          type: file.type,
          size: file.size,
        };
      })
    );

    return filesWithPreviews;
  }

  /**
   * Pobiera podgląd tekstu z pliku SRT.
   */
  async getTranscriptionPreview(srtUrl: string) {
    try {
      const urlParts = srtUrl.split("/subtitles/");
      if (urlParts.length < 2) {
        return { preview: "Brak podglądu", fullContent: "" };
      }

      const srtPath = urlParts[1];
      const { data, error } = await storageClient.storage
        .from("subtitles")
        .download(srtPath);

      if (error || !data) {
        console.error("Error downloading SRT for preview:", error);
        return { preview: "Nie udało się pobrać podglądu", fullContent: "" };
      }

      const srtContent = await data.text();
      const textLines = this.parseSrtToText(srtContent);
      const fullContent = textLines.join(" ");

      const words = fullContent.split(/\s+/);
      const previewWords = words.slice(0, 10);
      const preview = previewWords.join(" ") + (words.length > 10 ? "..." : "");

      return {
        preview: preview || "Pusty plik transkrypcji",
        fullContent: fullContent,
      };
    } catch (error) {
      console.error("Error getting transcription preview:", error);
      return { preview: "Błąd podczas pobierania podglądu", fullContent: "" };
    }
  }

  /**
   * edytuje zawartość pliku SRT.
   */
  async updateSrt(fileId: string, srtContent: string) {
    const file = await this.getFileRecord(fileId);

    if (!file) {
      throw new Error("File not found");
    }

    if (!file.srtUrl) {
      throw new Error("No existing SRT file to update");
    }

    const srtPath = `transcriptions/${fileId}.srt`;

    const { error: uploadErr } = await storageClient.storage
      .from("subtitles")
      .upload(srtPath, srtContent, {
        upsert: true,
        contentType: "text/plain;charset=UTF-8",
      });

    if (uploadErr) {
      console.error("Update SRT error:", uploadErr);
      throw new Error("Failed to update SRT file");
    }

    await db
      .update(fileTable)
      .set({ updatedAt: new Date() })
      .where(eq(fileTable.id, fileId));

    return { success: true };
  }

  /**
   * Konwertuje zawartość SRT na linie tekstu.
   */
  private parseSrtToText(srtContent: string): string[] {
    const lines = srtContent.split("\n");
    const textLines: string[] = [];
    let isTextLine = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "") {
        isTextLine = false;
        continue;
      }

      if (/^\d+$/.test(line)) continue;

      if (line.includes("-->")) {
        isTextLine = true;
        continue;
      }

      if (isTextLine) {
        textLines.push(line);
      }
    }

    return textLines;
  }
}

export const serverTranscriptionManager = new ServerTranscriptionManager();
