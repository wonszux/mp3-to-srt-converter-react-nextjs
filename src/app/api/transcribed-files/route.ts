import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// Pobiera pliki użytkownika
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

    const filesWithPreviews =
      await serverTranscriptionManager.getUserFilesWithPreviews(userId);

    console.log(
      `Successfully processed ${filesWithPreviews.length} files with previews`
    );

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
