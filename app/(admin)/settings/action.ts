"use server";

import fs from "fs";
import path from "path";
import { AppConfig, APP_CONFIG } from "@/constants/app-config";
import { revalidatePath } from "next/cache";
import { commitFile } from "@/lib/upload-action";
import { extractFilename } from "@/lib/storage";

export async function saveGlobalConfig(config: AppConfig) {
  try {
    // 1. Validasi Input Dasar
    if (!config.appName || !config.primaryColor.startsWith("#")) {
      throw new Error("Data tidak valid");
    }

    // Ambil nama file lama sebelum diupdate untuk keperluan penghapusan
    const oldLogo     = APP_CONFIG.logoUrl;
    const oldFavicon  = APP_CONFIG.faviconUrl;

    // 2. Commit file baru (Pindahkan dari temp ke settings)
    const logoRes     = await commitFile(config.logoUrl, "settings");
    const faviconRes  = await commitFile(config.faviconUrl, "settings");

    // 3. Ekstrak hanya nama filenya untuk disimpan ke config
    const newLogoName     = extractFilename(logoRes.filename);
    const newFaviconName  = extractFilename(faviconRes.filename);

    // --- LOGIK PENGHAPUSAN FILE LAMA ---
    // Hapus logo lama jika user ganti logo baru
    if (oldLogo && oldLogo !== newLogoName) {
      deletePhysicalFile(oldLogo, "public/uploads/settings");
    }
    // Hapus favicon lama jika user ganti favicon baru
    if (oldFavicon && oldFavicon !== newFaviconName) {
      deletePhysicalFile(oldFavicon, "public/uploads/settings");
    }
    // ----------------------------------------------------

    config.logoUrl    = newLogoName;
    config.faviconUrl = newFaviconName;

    // 4. Tulis ke file sistem
    const filePath = path.join(process.cwd(), "constants", "app-config.ts");
    const fileContent = `export type MenuType = "sidebar" | "navbar";
    export type FontFamily = "geist" | "poppins" | "roboto";

    export interface AppConfig {
      appName: string;
      logoUrl: string;
      faviconUrl: string;
      primaryColor: string;
      fontFamily: FontFamily;
      fontSize: number;
      menuType: MenuType;
      borderRadius: string;
    }

    export const APP_CONFIG: AppConfig = ${JSON.stringify(config, null, 2)};
    `;

    fs.writeFileSync(filePath, fileContent, "utf8");
    revalidatePath("/");

    return { success: true, message: "Konfigurasi dan file berhasil diperbarui!" };
  } catch (error: any) {
    console.error("FS Error:", error);
    return { success: false, message: error.message || "Gagal menulis file." };
  }
}

/**
 * Helper Fungsi untuk menghapus file fisik
 */
function deletePhysicalFile(filename: string, subPath: string) {
  try {
    const filePath = path.join(process.cwd(), subPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File lama dihapus: ${filename}`);
    }
  } catch (err) {
    console.error(`Gagal menghapus file ${filename}:`, err);
  }
}