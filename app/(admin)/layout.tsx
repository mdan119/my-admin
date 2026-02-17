"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Breadcrumb from "@/components/ui/breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MoreVertical, X } from "lucide-react";
import { useLang } from "@/context/LangContext";

import { UserProfileDropdown } from "@/components/layout/user-profile-dropdown";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRightAsideOpen, setIsRightAsideOpen] = useState(false);
  
  
  // State untuk Theme & Language
  const [theme, setTheme] = useState("light");
  const { __lang, lang, toggleLang, isPending } = useLang();

  // Load Caching saat mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    setTheme(savedTheme);

    
    // Terapkan class .dark ke root sesuai cache
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fungsi Toggle Theme dengan Caching
  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex min-h-screen font-main">
      {/* Sidebar - Caching & Accordion sudah ok di file sidebar.tsx */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Dashboard - Warna Primary Sesuai Request */}
        <header className="h-20 bg-primary shadow-lg shadow-primary/20 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors duration-500">
          <div className="flex items-center gap-4">
            {/* Tombol Menu Mobile */}
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="cursor-pointer lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Breadcrumb */}
            <Breadcrumb/>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Profile AD dengan Border Glassmorphism */}
             <UserProfileDropdown/>
             
             {/* Tombol Konfigurasi (Titik Tiga) */}
             <button 
                onClick={() => setIsRightAsideOpen(true)}
                className="cursor-pointer p-2 text-white hover:bg-white/10 rounded-full transition-colors"
             >
                <MoreVertical size={20} />
             </button>
          </div>
        </header>

        <motion.main 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 pt-8 md:p-8 flex-1"
        >
          {children}
        </motion.main>
      </div>

      {/* RIGHT ASIDE */}
      <AnimatePresence>
        {isRightAsideOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsRightAsideOpen(false)}
              className="fixed inset-0 backdrop-blur-sm z-[100]"
            />
            
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-80 bg-[var(--background)] shadow-2xl z-[110] p-6 border-l border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold"></h2>
                <button 
                  onClick={() => setIsRightAsideOpen(false)} 
                  className="cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Mode Tema */}
                <div className="space-y-4">
                  <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{__lang('main.theme_mode')}</span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--primary)] rounded-xl">
                    <button 
                      onClick={() => toggleTheme("light")}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-primary font-bold' : 'text-white'}`}
                    >
                      {__lang('main.light')}
                    </button>
                    <button 
                      onClick={() => toggleTheme("dark")}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-primary font-bold' : 'text-white'}`}
                    >
                      {__lang('main.dark')}
                    </button>
                  </div>
                </div>

                {/* Bahasa */}
                <div className="space-y-4">
                  <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{__lang('main.language')}</span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--primary)] rounded-xl">
                    <button 
                      onClick={() => toggleLang("id")}
                      disabled={isPending}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${lang === 'id' ? 'bg-white shadow-sm text-primary font-bold' : 'text-white'}`}
                    >
                      ID
                    </button>
                    <button 
                      onClick={() => toggleLang("en")}
                      disabled={isPending}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-sm text-primary font-bold' : 'text-white'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}