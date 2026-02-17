"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  BookOpen, 
  LogOut, 
  ChevronDown, 
  Settings,
  ShieldCheck 
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import { motion, AnimatePresence } from "framer-motion";

export function UserProfileDropdown() {
  const { __lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger: Profile Avatar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 py-1 px-1 pr-2 rounded-full hover:bg-white/10 transition-all duration-300 outline-none cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold shadow-sm active:scale-95 transition-transform">
          AD
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-bold text-white leading-none">Admin Director</p>
          <p className="text-[10px] text-white/60 leading-tight">Super Admin</p>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu Content: Adaptive Glassmorphism */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-60 overflow-hidden bg-white dark:bg-[var(--card)] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-2 z-[999]"
          >
            {/* Header Info */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-[var(--primary)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                  {__lang('main.account_level')}
                </span>
              </div>
              <p className="text-sm font-black truncate text-[var(--foreground)]">Admin Director</p>
              <p className="text-xs text-[var(--muted)] truncate">admin@elite-system.com</p>
            </div>
            
            <div className="h-[1px] bg-[var(--border-soft)] mx-2 my-1 opacity-50" />

            {/* List Menu */}
            <div className="space-y-1">
              <MenuLink href="/profile" icon={<User size={16} />} label={__lang('main.profile')} onClick={() => setIsOpen(false)} />
              <MenuLink href="/manual-book" icon={<BookOpen size={16} />} label={__lang('main.manual_book')} onClick={() => setIsOpen(false)} />
            </div>

            <div className="h-[1px] bg-[var(--border-soft)] mx-2 my-1 opacity-50" />

            {/* Logout */}
            <button 
              onClick={() => { setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <LogOut size={16} />
              </div>
              <span className="font-bold text-sm">{__lang('main.logout')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-all group">
        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          {icon}
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
    </Link>
  );
}