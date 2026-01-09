import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// edytuje zawartość pliku SRT
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileId, content } = body;

    if (!fileId || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing fileId or content" },
        { status: 400 }
      );
    }

    await serverTranscriptionManager.updateSrt(fileId, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating SRT:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
