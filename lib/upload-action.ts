"use server";

import fs from "fs";
import path from "path";
import { encryptPath, decryptPath } from "@/lib/crypto";

/**
 * Upload file ke folder TEMPS
 */
export async function uploadTempAction(formData: FormData, isPrivate: boolean = false) {
  try {
    const file = formData.get("file") as File;
    const encryptedLimit = formData.get("ms") as string;
    const maxSizeStr = encryptedLimit ? decryptPath(encryptedLimit) : null;
    
    if (!file || file.size === 0) return { error: "No file uploaded." };

    const SERVER_CONFIG_LIMIT = parseInt(process.env.SERVER_MAX_UPLOAD_SIZE || "2097152");
    let limit = maxSizeStr ? parseInt(maxSizeStr) : 2 * 1024 * 1024;
    
    if (limit > SERVER_CONFIG_LIMIT) limit = SERVER_CONFIG_LIMIT;
    if (file.size > limit) return { error: "File too large." };

    const today = new Date().toISOString().split("T")[0];
    const rootDir = isPrivate ? "storage/uploads/temps" : "public/uploads/temps";
    const tempDir = path.join(process.cwd(), rootDir, today);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    cleanupOldTempFiles(isPrivate);

    const fileName = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));

    const relativePath = `${today}/${fileName}`;
    if (isPrivate) {
      const token = encryptPath(`temps/${relativePath}`);
      return { url: `/api/file-preview/${encodeURIComponent(token)}`, success: true };
    }

    return { url: `/uploads/temps/${relativePath}`, success: true };
  } catch (error) {
    return { error: "Upload failed." };
  }
}

/**
 * Pindahkan file dari TEMPS ke folder PERMANEN
 * Return: { url: string (untuk UI), filename: string (untuk DB) }
 */
export async function commitFile(url: string, subFolder: string = "general") {
  if (!url) return { url: "", filename: "" };

  try {
    const isPublic = url.startsWith("/uploads/temps/");
    const isPrivateAPI = url.includes("/api/file-preview/");
    let relPath = ""; 
    let isNew = false;

    if (isPublic) {
      relPath = url.replace("/uploads/temps/", "");
      isNew = true;
    } else if (isPrivateAPI) {
      const encryptedPart = decodeURIComponent(url.split("/api/file-preview/")[1]);
      const decrypted = decryptPath(encryptedPart);
      if (decrypted && decrypted.startsWith("temps/")) {
        relPath = decrypted.replace(/^temps\//, "");
        isNew = true;
      }
    }

    // Jika bukan file baru (file lama yang sudah di folder permanen)
    if (!isNew) {
      let currentFilename = "";
      if (isPrivateAPI) {
        const encryptedPart = decodeURIComponent(url.split("/api/file-preview/")[1]);
        currentFilename = path.basename(decryptPath(encryptedPart) || "");
      } else {
        currentFilename = path.basename(url);
      }
      return { url, filename: currentFilename };
    }

    const fileName = path.basename(relPath);
    const sourceBase = isPublic ? "public/uploads/temps" : "storage/uploads/temps";
    const targetBase = isPublic ? `public/uploads/${subFolder}` : `storage/uploads/${subFolder}`;
    
    const sourcePath = path.join(process.cwd(), sourceBase, relPath);
    const targetPath = path.join(process.cwd(), targetBase, fileName);

    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(path.dirname(targetPath))) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      }
      fs.renameSync(sourcePath, targetPath);
      
      if (isPublic) {
        return { url: `/uploads/${subFolder}/${fileName}`, filename: fileName };
      } else {
        const newToken = encryptPath(`${subFolder}/${fileName}`);
        return { 
          url: `/api/file-preview/${encodeURIComponent(newToken)}`, 
          filename: fileName 
        };
      }
    }
  } catch (e) {
    console.error("Commit Error:", e);
  }
  return { url, filename: "" };
}

function cleanupOldTempFiles(isPrivate: boolean) {
  try {
    const rootDir = isPrivate ? "storage/uploads/temps" : "public/uploads/temps";
    const fullPath = path.join(process.cwd(), rootDir);
    if (!fs.existsSync(fullPath)) return;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    fs.readdirSync(fullPath).forEach(f => {
      const folderDate = new Date(f);
      if (!isNaN(folderDate.getTime()) && folderDate < twoDaysAgo) {
        fs.rmSync(path.join(fullPath, f), { recursive: true, force: true });
      }
    });
  } catch (err) {}
}