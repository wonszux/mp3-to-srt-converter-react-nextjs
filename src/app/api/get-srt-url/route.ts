import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// Pobiera status i URL pliku SRT
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "No fileId provided" },
        { status: 400 }
      );
    }

    const file = await serverTranscriptionManager.getFileRecord(fileId);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: file.status,
      srtUrl: file.srtUrl,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
