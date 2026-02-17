"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Info } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  type?: "text" | "number" | "password" | "date" | "email" | "color" | "url" | "tel";
  value: any;
  onChange: (val: any) => void; 
  icon?: any;
  required?: boolean;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  className = "",
  required = false,
  error = "",
  prefix,
  suffix,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [paddingLeft, setPaddingLeft] = useState(Icon ? 48 : 16);
  const [paddingRight, setPaddingRight] = useState(16);
  
  const prefixRef = useRef<HTMLDivElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);
  const safeValue = value ?? "";

  // Ukur lebar prefix dan suffix secara dinamis
  useEffect(() => {
    let left = Icon ? 44 : 16;
    if (prefixRef.current) {
      left += prefixRef.current.offsetWidth + 8; // Lebar konten + gap
    }
    setPaddingLeft(left);

    let right = 16;
    if (suffixRef.current) {
      right += suffixRef.current.offsetWidth + 8;
    }
    if (type === "password") {
      right += 32; // Ruang untuk tombol mata
    }
    setPaddingRight(right);
  }, [prefix, suffix, type, Icon]);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === "number") {
      onChange(val === "" ? "" : Number(val));
    } else {
      onChange(val);
    }
  };

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1 flex items-center gap-1 font-semibold">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative group flex items-center">
        {Icon && (
          <Icon 
            size={18} 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-20 pointer-events-none
              ${error ? 'text-red-400' : 'text-muted group-focus-within:text-primary'}`} 
          />
        )}

        {/* Container Prefix */}
        {prefix && (
          <div 
            ref={prefixRef}
            className={`absolute ${Icon ? 'left-11' : 'left-4'} flex items-center z-20`}
          >
            <div className="text-sm font-bold text-muted/60 leading-none">
                {prefix}
            </div>
          </div>
        )}

        <input
          {...props}
          type={inputType}
          value={safeValue}
          onChange={handleChange}
          style={{ 
            paddingLeft: `${paddingLeft}px`, 
            paddingRight: `${paddingRight}px` 
          }}
          className={`
            w-full bg-white dark:bg-white/5 border rounded-[var(--radius)] py-3 outline-none transition-all
            ${error 
              ? 'border-red-500 ring-2 ring-red-500/10' 
              : 'border-border-soft focus:ring-2 focus:ring-primary/20 focus:border-primary/40'}
            ${type === "color" ? 'h-12 p-1 cursor-pointer' : ''}
            ${type === "number" ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}
            ${className}
          `}
        />

        {/* Container Suffix */}
        {suffix && (
          <div 
            ref={suffixRef}
            className={`absolute flex items-center z-20 ${isPassword ? 'right-12' : 'right-4'}`}
          >
             <div className="text-sm font-bold text-muted/60 leading-none">
                {suffix}
             </div>
          </div>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors z-30 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1 ml-1 animate-in fade-in slide-in-from-top-1 text-red-500">
          <Info size={12} />
          <p className="text-[11px] font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};