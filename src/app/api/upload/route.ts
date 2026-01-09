import { NextResponse } from "next/server";
import { serverTranscriptionManager } from "@/lib/server-transcription-manager";

// Obsługuje przesyłanie plików audio
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const uploadFile = form.get("file") as File;
    const userId = form.get("userId") as string;

    console.log("Upload request:", {
      fileName: uploadFile?.name,
      fileSize: uploadFile?.size,
      userId,
    });

    if (!uploadFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await serverTranscriptionManager.uploadFile(
      uploadFile,
      userId
    );

    console.log("Database record created:", result.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
