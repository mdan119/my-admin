"use server";

import fs from "fs";
import path from "path";

/**
 * Mengambil kamus bahasa berdasarkan bahasa dan modul tertentu.
 * @param lang - Kode bahasa (id/en)
 * @param modules - Array nama modul/file (misal: ["settings"])
 */
export async function getDictionary(lang: string, modules: string[] = ["main"]) {
  const dictionary: Record<string, any> = {};
  
  // 1. Tentukan direktori dasar kamus
  // Menggunakan path.resolve untuk kepastian path di berbagai environment server
  const dictDir = path.resolve(process.cwd(), "constants/dictionaries", lang);

  try {
    // 2. Iterasi modul yang diminta
    for (const mod of modules) {
      const filePath = path.join(dictDir, `${mod}.json`);

      // Cek apakah file ada sebelum dibaca
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          // Gunakan JSON.parse langsung (lebih cepat daripada import dynamic di server)
          dictionary[mod] = JSON.parse(fileContent);
        } catch (parseError) {
          console.error(`[getDictionary] Error parsing ${mod}.json:`, parseError);
          dictionary[mod] = {}; // Fallback objek kosong agar tidak break
        }
      } else {
        // Log jika ada modul yang diminta tapi filenya tidak ditemukan
        console.warn(`[getDictionary] Module not found: ${filePath}`);
        dictionary[mod] = {}; 
      }
    }

    return dictionary;
  } catch (error) {
    console.error("Critical error in getDictionary:", error);
    return {};
  }
}