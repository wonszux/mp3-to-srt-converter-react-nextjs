import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// URL do twojego serwisu Docker (localhost jeśli lokalnie)
const TRANSCRIPTION_SERVICE_URL =
  process.env.TRANSCRIPTION_SERVICE_URL || "http://localhost:5000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileId, language } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "No fileId provided" },
        { status: 400 }
      );
    }

    // Pobierz informacje o pliku z bazy danych
    const fileRecord = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.id, fileId))
      .limit(1);

    if (!fileRecord || fileRecord.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = fileRecord[0];

    // Sprawdź czy plik już nie jest przetwarzany
    if (file.status === "processing") {
      return NextResponse.json(
        { error: "File is already being processed" },
        { status: 409 }
      );
    }

    if (file.status === "completed") {
      return NextResponse.json(
        {
          message: "File already transcribed",
          srtUrl: file.srtUrl,
        },
        { status: 200 }
      );
    }

    // Wyślij żądanie do serwisu transkrypcji
    const transcriptionResponse = await fetch(
      `${TRANSCRIPTION_SERVICE_URL}/transcribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: file.id,
          audioUrl: file.url,
          language: language || "auto",
        }),
      }
    );

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.json();
      throw new Error(errorData.error || "Transcription service error");
    }

    const result = await transcriptionResponse.json();

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      srtUrl: result.srtUrl,
      language: result.language,
      message: "Transcription started successfully",
    });
  } catch (err) {
    console.error("Transcription API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
