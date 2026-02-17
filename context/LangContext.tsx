"use client";

import { createContext, useContext, useState, useTransition, useCallback } from "react";
import { getDictionary } from "@/lib/lang";

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children, initialDict, initialLang }: any) {
  const [lang, setLang] = useState(initialLang);
  const [dict, setDict] = useState(initialDict);
  const [isPending, startTransition] = useTransition();
  
  // Menggunakan State agar reaktif saat pendaftaran/penghapusan modul
  const [activeModules, setActiveModules] = useState<Set<string>>(new Set(["main"]));

  /**
   * TRANSLATE HELPER (__lang)
   * Mengambil teks berdasarkan dot notation (e.g., 'settings.title')
   */
  const __lang = useCallback((path: string) => {
    const keys = path.split(".");
    let result = dict;

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        const lastKey = keys[keys.length - 1] || path;
        return lastKey
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }
    }
    return result;
  }, [dict]);

  /**
   * REGISTER & LOAD MODULES
   * Digunakan di level Page untuk mendaftarkan modul fitur yang dibutuhkan.
   */
  const loadModules = useCallback(async (modules: string[]) => {
    // 1. Tambahkan ke daftar modul aktif (UI sedang melihat ini)
    setActiveModules((prev) => {
      const next = new Set(prev);
      modules.forEach((m) => next.add(m));
      return next;
    });

    // 2. Hanya fetch jika data belum ada di state dict
    const missing = modules.filter((m) => !dict[m]);
    if (missing.length === 0) return;

    const extraDict = await getDictionary(lang, missing);
    if (extraDict) {
      setDict((prev: any) => ({ ...prev, ...extraDict }));
    }
  }, [dict, lang]);

  /**
   * UNREGISTER MODULES
   * Menghapus modul dari daftar aktif saat user meninggalkan halaman (cleanup).
   */
  const unloadModules = useCallback((modules: string[]) => {
    setActiveModules((prev) => {
      const next = new Set(prev);
      modules.forEach((m) => {
        if (m !== "main") next.delete(m); // 'main' jangan pernah dihapus
      });
      return next;
    });
  }, []);

  /**
   * TOGGLE LANGUAGE
   * Hanya mengambil data bahasa baru untuk modul yang SEDANG AKTIF di layar.
   */
  const toggleLang = (newLang: string) => {
    startTransition(async () => {
      // Mengambil modul yang saat ini ada di state activeModules
      const modulesToFetch = Array.from(activeModules);
      const newDict = await getDictionary(newLang, modulesToFetch); 
      
      if (newDict) {
        setDict(newDict);
        setLang(newLang);
        localStorage.setItem("app-lang", newLang);
        document.cookie = `app-lang=${newLang}; path=/; max-age=31536000`;
      }
    });
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        lang, 
        dict, 
        toggleLang, 
        isPending, 
        __lang, 
        loadModules, 
        unloadModules 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);