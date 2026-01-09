import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// Pobiera plik SRT
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    console.log("Download SRT request:", { fileId });

    if (!fileId) {
      return NextResponse.json(
        { error: "No fileId provided" },
        { status: 400 }
      );
    }

    const fileBlob = await serverTranscriptionManager.downloadSrt(fileId);

    console.log("SRT file downloaded successfully");

    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileId}.srt"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Server error:", err);

    const errorMessage = err instanceof Error ? err.message : "Server error";
    const status =
      errorMessage === "File not found"
        ? 404
        : errorMessage === "Transcription not completed yet"
        ? 400
        : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
