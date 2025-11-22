import { NextResponse } from "next/server";
import { storageClient } from "@/lib/storage-client";
import { db } from "@/db/drizzle";
import { file as fileTable } from "@/db/schema";
import { randomUUID } from "crypto";

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

    const supabase = storageClient;

    const fileId = randomUUID();
    const filePath = `${userId}/${fileId}-${uploadFile.name}`;

    console.log("⬆️ Uploading to Supabase:", {
      bucket: "uploads",
      path: filePath,
    });

    const { error: uploadErr } = await supabase.storage
      .from("uploads")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    console.log("File uploaded successfully:", {
      fileId,
      publicUrl,
      path: filePath,
    });

    await db.insert(fileTable).values({
      id: fileId,
      userId: userId || null,
      type: uploadFile.type,
      size: uploadFile.size.toString(),
      duration: "1",
      url: publicUrl,
      status: "pending",
    });

    console.log("Database record created:", fileId);

    return NextResponse.json({
      id: fileId,
      url: publicUrl,
      status: "pending",
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
