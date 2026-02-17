import { encryptPath } from "@/lib/crypto";

export function formatFileUrl(filename: string | null, config: { isPrivate: boolean; subFolder: string }) {
  if (!filename || filename === "") return "";
  if (filename.startsWith("http") || filename.startsWith("/uploads") || filename.startsWith("/api/")) return filename;

  if (!config.isPrivate) return `/uploads/${config.subFolder}/${filename}`;

  // Private: Token ini akan berbeda antara Server & Client karena IV Random
  const token = encryptPath(`${config.subFolder}/${filename}`);
  return `/api/file-preview/${encodeURIComponent(token)}`;
}

export function extractFilename(url: string) {
  if (!url) return "";
  const parts = url.split('/');
  return decodeURIComponent(parts[parts.length - 1]);
}