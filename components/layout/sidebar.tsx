"use client";
import { useState, useEffect } from "react";
import { APP_CONFIG } from "@/constants/app-config";
import { motion, AnimatePresence } from "framer-motion";
import { SIDEBAR_MENU } from "@/constants/menu-data";
import { SidebarItem } from "./sidebar-item";
import { ChevronLeft, ChevronRight, Settings, X } from "lucide-react";
import { formatFileUrl } from "@/lib/storage";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: any) {
  // 1. Inisialisasi state langsung dari localStorage jika memungkinkan (Client Side)
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [openMenuTitle, setOpenMenuTitle] = useState<string | null>(null);

  useEffect(() => {
    // Ambil status tersimpan segera setelah komponen mounted
    const savedState = localStorage.getItem("sidebar-minimized");
    if (window.innerWidth >= 1024 && savedState === "true") {
      setIsMinimized(true);
    }
    setIsHydrated(true);
  }, []);

  const handleToggleClick = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem("sidebar-minimized", newState.toString());
    if (newState) setOpenMenuTitle(null); 
  };

  const handleToggleMenu = (title: string) => {
    setOpenMenuTitle(openMenuTitle === title ? null : title);
  };

  return (
    <>
      {/* 2. Placeholder DIV: Kunci stabilitas layout ada di sini */}
      <div 
        className={`hidden lg:block shrink-0 transition-[width] duration-500 ease-in-out ${
          // Sebelum hydrated, gunakan lebar default agar SSR cocok
          // Setelah hydrated, ikuti state isMinimized
          !isHydrated ? "w-[280px]" : (isMinimized ? "w-20" : "w-[280px]")
        }`} 
      />

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        // Menggunakan CSS class untuk lebar (lebih stabil untuk CLP dibanding animate width framer-motion)
        className={`
          fixed top-0 left-0 h-screen flex flex-col z-[100] lg:z-40 shadow-sm
          bg-[var(--background)] border-r border-zinc-500/10 dark:border-white/5 
          transition-[width,transform] duration-500 ease-in-out
          ${isMinimized ? "w-20" : "w-[280px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          lg:translate-x-0
        `}
      >
        {/* HEADER SIDEBAR */}
        <div className="h-20 flex items-center px-6 shrink-0 border-b border-zinc-500/5 dark:border-white/5 relative overflow-hidden">
          <div 
            className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white font-bold shadow-sm shadow-primary/20 overflow-hidden ${
              APP_CONFIG.logoUrl ? 'bg-transparent' : 'bg-primary' 
            }`}
          >
            {APP_CONFIG.logoUrl ? (
              <img 
                src={formatFileUrl(APP_CONFIG.logoUrl, { isPrivate: false, subFolder: "settings" })} 
                alt={APP_CONFIG.appName} 
                className="w-full h-full object-contain"
                loading="eager"
                priority="true" // Beritahu browser ini prioritas tinggi
              />
            ) : (
              <span className="text-sm">
                {APP_CONFIG.appName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="ml-3 font-bold text-lg truncate whitespace-nowrap text-primary tracking-tight"
              >
                {APP_CONFIG.appName}
              </motion.span>
            )}
          </AnimatePresence>

          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden absolute right-4 p-2 text-zinc-400">
            <X size={20} />
          </button>
        </div>

        {/* TOMBOL TOGGLE */}
        <button 
          onClick={handleToggleClick}
          className="cursor-pointer hidden lg:flex absolute top-16 -right-3 bg-primary text-white rounded-full p-1 shadow-xl z-[150] border-2 border-[var(--background)] hover:scale-110 transition-transform"
        >
          {isMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* AREA MENU */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
          {SIDEBAR_MENU.map((menu, idx) => (
            <SidebarItem 
              key={menu.title + idx} 
              item={menu} 
              isMinimized={isMinimized} 
              setIsMobileOpen={setIsMobileOpen}
              isOpen={openMenuTitle === menu.title}
              onToggle={() => handleToggleMenu(menu.title)}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-zinc-500/5 dark:border-white/5 shrink-0">
          <SidebarItem 
            item={{ title: "Settings", icon: Settings, href: "/settings" }} 
            isMinimized={isMinimized} 
            setIsMobileOpen={setIsMobileOpen}
            isOpen={openMenuTitle === "Settings"}
            onToggle={() => handleToggleMenu("Settings")}
          />
        </div>
      </motion.aside>
    </>
  );
}