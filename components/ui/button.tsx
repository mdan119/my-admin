"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // Import spinner
import { useLang } from "@/context/LangContext";

export const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary", 
  disabled = false, 
  type = "button",
  isLoading = false // Tambahkan prop isLoading
}: any) => {
  const { __lang } = useLang();

  const variants: any = {
    primary: "cursor-pointer bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110",
    outline: "border border-[var(--border-soft)] text-[var(--foreground)] hover:bg-zinc-100 dark:hover:bg-white/5",
    ghost: "text-[var(--muted)] hover:text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-[var(--radius)] font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {__lang('settings.btn_saving')}
        </>
      ) : children}
    </motion.button>
  );
};