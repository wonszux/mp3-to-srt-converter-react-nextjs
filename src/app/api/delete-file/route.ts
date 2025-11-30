import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { storageClient } from "@/lib/storage-client";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    console.log("Delete file request:", { fileId });

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
      console.error("File not found:", fileId);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = fileRecord[0];
    const supabase = storageClient;

    // Wyciągnij ścieżkę z URL
    const urlParts = file.url.split("/uploads/");
    if (urlParts.length >= 2) {
      const filePath = urlParts[1];

      console.log("Deleting audio file from Supabase:", {
        bucket: "uploads",
        path: filePath,
      });

      // Usuń plik audio z Supabase
      const { error: deleteAudioError } = await supabase.storage
        .from("uploads")
        .remove([filePath]);

      if (deleteAudioError) {
        console.error("Error deleting audio file:", deleteAudioError);
        // Kontynuuj mimo błędu - plik może już nie istnieć
      }
    }

    // Usuń plik SRT jeśli istnieje
    if (file.srtUrl) {
      const srtPath = `transcriptions/${fileId}.srt`;

      console.log("Deleting SRT file from Supabase:", {
        bucket: "subtitles",
        path: srtPath,
      });

      const { error: deleteSrtError } = await supabase.storage
        .from("subtitles")
        .remove([srtPath]);

      if (deleteSrtError) {
        console.error("Error deleting SRT file:", deleteSrtError);
        // Kontynuuj mimo błędu - plik może już nie istnieć
      }
    }

    // Usuń wpis z bazy danych
    await db.delete(fileTable).where(eq(fileTable.id, fileId));

    console.log("File deleted successfully:", fileId);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      fileId: fileId,
    });
  } catch (err) {
    console.error("Server error during file deletion:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
