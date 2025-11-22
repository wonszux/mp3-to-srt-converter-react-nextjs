import { NextResponse } from "next/server";
import { storageClient } from "@/lib/storage-client";
import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    if (file.status !== "completed" || !file.srtUrl) {
      console.error("Transcription not completed:", {
        status: file.status,
        srtUrl: file.srtUrl,
      });
      return NextResponse.json(
        { error: "Transcription not completed yet" },
        { status: 400 }
      );
    }

    const supabase = storageClient;
    const srtPath = `transcriptions/${fileId}.srt`;

    console.log("Downloading from Supabase:", {
      bucket: "subtitles",
      path: srtPath,
    });

    const { data, error } = await supabase.storage
      .from("subtitles")
      .download(srtPath);

    if (error || !data) {
      console.error("Download error:", error);
      return NextResponse.json(
        { error: "Failed to download SRT file" },
        { status: 500 }
      );
    }

    console.log("SRT file downloaded successfully");

    const arrayBuffer = await data.arrayBuffer();
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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
