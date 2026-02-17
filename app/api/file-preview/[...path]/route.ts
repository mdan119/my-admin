import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { decryptPath } from "@/lib/crypto";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params;
    const encryptedToken = decodeURIComponent(pathArray.join("/"));
    const decryptedPath = decryptPath(encryptedToken);

    if (!decryptedPath) return new NextResponse("Forbidden", { status: 403 });

    const finalFilePath = path.join(process.cwd(), "storage/uploads", decryptedPath);

    if (!fs.existsSync(finalFilePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(finalFilePath);
    const ext = path.extname(finalFilePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon"
    };

    return new NextResponse(fileBuffer, {
      headers: { 
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}