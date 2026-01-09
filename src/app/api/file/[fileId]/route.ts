import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

export const dynamic = "force-dynamic";

// Pobiera szczegóły pojedynczego pliku (do edycji)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    const file = await serverTranscriptionManager.getFileRecord(fileId);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    try {
      const blob = await serverTranscriptionManager.downloadSrt(fileId);
      const content = await blob.text();

      return NextResponse.json({
        file,
        content,
      });
    } catch (err) {
      console.error("Error downloading SRT:", err);
      return NextResponse.json({
        file,
        content: "",
        error: "SRT file could not be downloaded",
      });
    }
  } catch (error) {
    console.error("Error fetching file details:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
