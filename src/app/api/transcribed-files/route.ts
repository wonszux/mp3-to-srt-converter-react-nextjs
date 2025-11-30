// src/app/api/transcribed-files/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { storageClient } from "@/lib/storage-client";

// Funkcja pomocnicza do pobierania pierwszych słów z pliku SRT
async function getTranscriptionPreview(srtUrl: string): Promise<{
  preview: string;
  fullContent: string;
}> {
  try {
    // Wyciągnij ścieżkę z URL
    const urlParts = srtUrl.split("/subtitles/");
    if (urlParts.length < 2) {
      return { preview: "Brak podglądu", fullContent: "" };
    }

    const srtPath = urlParts[1];
    const supabase = storageClient;

    // Pobierz plik SRT z Supabase
    const { data, error } = await supabase.storage
      .from("subtitles")
      .download(srtPath);

    if (error || !data) {
      console.error("Error downloading SRT for preview:", error);
      return { preview: "Nie udało się pobrać podglądu", fullContent: "" };
    }

    // Konwertuj blob na tekst
    const srtContent = await data.text();

    // Parsuj SRT i wyciągnij tekst
    const textLines = parseSrtToText(srtContent);
    const fullContent = textLines.join(" ");

    // Weź pierwsze 8-10 słów jako podgląd
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

// Funkcja parsująca SRT do czystego tekstu
function parseSrtToText(srtContent: string): string[] {
  const lines = srtContent.split("\n");
  const textLines: string[] = [];
  let isTextLine = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Pomiń puste linie
    if (line === "") {
      isTextLine = false;
      continue;
    }

    // Pomiń numery sekwencji (same cyfry)
    if (/^\d+$/.test(line)) {
      continue;
    }

    // Pomiń timecody (format: 00:00:00,000 --> 00:00:00,000)
    if (line.includes("-->")) {
      isTextLine = true;
      continue;
    }

    // Jeśli jesteśmy po timecodzie, to jest to linia tekstu
    if (isTextLine) {
      textLines.push(line);
    }
  }

  return textLines;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    console.log("Fetching transcribed files for user:", userId);

    // Pobierz wszystkie ukończone pliki dla użytkownika
    const files = await db
      .select()
      .from(fileTable)
      .where(
        and(eq(fileTable.userId, userId), eq(fileTable.status, "completed"))
      )
      .orderBy(desc(fileTable.createdAt));

    console.log(`Found ${files.length} completed files`);

    // Dla każdego pliku pobierz podgląd i pełną treść transkrypcji
    const filesWithPreviews = await Promise.all(
      files.map(async (file) => {
        let preview = "Ładowanie...";
        let fullContent = "";

        if (file.srtUrl) {
          const transcription = await getTranscriptionPreview(file.srtUrl);
          preview = transcription.preview;
          fullContent = transcription.fullContent;
        }

        // Wyciągnij oryginalną nazwę pliku z URL
        // Format: userId/fileId-originalName.ext
        const urlParts = file.url.split("/");
        const fileNamePart = urlParts[urlParts.length - 1];

        // Usuń UUID z początku nazwy (format: uuid-originalName.ext)
        let originalName = fileNamePart;
        // jeśli nazwa zaczyna się od UUID (36 znaków + myślnik)
        if (/^[0-9a-fA-F-]{36}-/.test(fileNamePart)) {
          originalName = fileNamePart.slice(37); // 36 znaków UUID + 1 myślnik
        }

        // Zdekoduj nazwę i usuń rozszerzenie audio, zostaw samo .srt
        originalName = decodeURIComponent(originalName);
        // Zamień rozszerzenie audio na .srt (np. .mp3 -> .srt, .wav -> .srt)
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

    console.log("Successfully processed all files with previews");

    return NextResponse.json({
      success: true,
      files: filesWithPreviews,
    });
  } catch (error) {
    console.error("Error fetching transcribed files:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
