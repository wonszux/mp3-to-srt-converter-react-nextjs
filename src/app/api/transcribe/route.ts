import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// Inicjuje transkrypcję pliku
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

    const result = await serverTranscriptionManager.startTranscription(
      fileId,
      language
    );

    if (result.alreadyCompleted) {
      return NextResponse.json(
        {
          message: "File already transcribed",
          srtUrl: result.srtUrl,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      srtUrl: result.srtUrl,
      language: result.language,
      message: "Transcription started successfully",
    });
  } catch (err) {
    console.error("Transcription API error:", err);

    const errorMessage = err instanceof Error ? err.message : "Server error";
    const status =
      errorMessage === "File not found"
        ? 404
        : errorMessage === "File is already being processed"
        ? 409
        : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
