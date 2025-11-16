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

    if (!uploadFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = storageClient;

    const fileId = randomUUID();
    const filePath = `${userId}/${fileId}-${uploadFile.name}`;

    const { error: uploadErr } = await supabase.storage
      .from("uploads")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      console.error(uploadErr);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    await db.insert(fileTable).values({
      id: fileId,
      userId: userId || null,
      type: uploadFile.type,
      size: uploadFile.size.toString(),
      duration: "1",
      url: publicUrl,
      status: "pending",
    });

    return NextResponse.json({
      id: fileId,
      url: publicUrl,
      status: "pending",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
