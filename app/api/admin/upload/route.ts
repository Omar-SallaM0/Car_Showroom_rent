import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { hasAdminSession } from "@/utils/admin-auth";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden: Admin session required" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files: File[] = [];

    // Collect all files from known keys or any File entry
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "cars");
    await mkdir(uploadDir, { recursive: true });

    const savedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10MB size limit.` },
          { status: 400 }
        );
      }

      const originalExt = path.extname(file.name).toLowerCase();
      const ext = ALLOWED_EXTENSIONS.has(originalExt)
        ? originalExt
        : file.type.startsWith("image/")
        ? `.${file.type.replace("image/", "").replace("jpeg", "jpg")}`
        : ".jpg";

      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `File "${file.name}" has an unsupported image format. Allowed: JPG, PNG, WEBP, GIF, AVIF, SVG.` },
          { status: 400 }
        );
      }

      const fileName = `${Date.now()}-${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(filePath, buffer);
      savedUrls.push(`/uploads/cars/${fileName}`);
    }

    return NextResponse.json({ urls: savedUrls }, { status: 201 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Failed to upload image files" }, { status: 500 });
  }
}
