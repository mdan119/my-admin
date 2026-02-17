"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";

interface Option {
  label: string;
  value: any;
}

interface SuperSelectProps {
  label?: string;
  value: any;
  onChange: (value: any) => void;
  options?: Option[];
  loadOptions?: (query: string) => Promise<Option[]>;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  minChars?: number;
  // Prop Validasi Baru
  required?: boolean;
  error?: string; // Jika string ini ada isinya, maka statusnya error
}

export const Select = React.memo(({
  label,
  value,
  onChange,
  options: staticOptions = [],
  loadOptions,
  multiple = false,
  placeholder = "Pilih...",
  className = "",
  minChars = 2,
  required = false,
  error = ""
}: SuperSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, dropUp: false });
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300; 
      const shouldDropUp = spaceBelow < dropdownHeight;

      setCoords({
        top: shouldDropUp ? rect.top + window.scrollY : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        dropUp: shouldDropUp
      });
    }
  }, []);

  const handleOpen = () => {
    if (!isOpen) {
      updateCoords();
      setSearch("");
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('.select-portal-container')
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!loadOptions || !isOpen) return;
    if (search.length > 0 && search.length < minChars) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await loadOptions(search);
        setDynamicOptions(res || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, loadOptions, isOpen, minChars]);

  const allOptions = useMemo(() => (loadOptions ? dynamicOptions : staticOptions), [loadOptions, dynamicOptions, staticOptions]);
  
  const filteredOptions = useMemo(() => {
    if (loadOptions) return allOptions;
    return allOptions.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [allOptions, search, loadOptions]);

  const displayLabel = useMemo(() => {
    if (multiple) {
      const selected = allOptions.filter(opt => (value as any[])?.includes(opt.value));
      return selected.length > 0 ? `${selected.length} dipilih` : placeholder;
    }
    const found = allOptions.find(opt => opt.value === value);
    return found ? found.label : placeholder;
  }, [value, allOptions, multiple, placeholder]);

  if (!mounted) return null;

  return (
    <div className="space-y-1.5 w-full" ref={containerRef}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          onClick={handleOpen}
          className={`
            w-full px-4 py-3 flex items-center justify-between cursor-pointer transition-all
            bg-[var(--background)] text-foreground border rounded-[var(--radius)]
            ${error 
              ? 'border-red-500 ring-2 ring-red-500/10' 
              : isOpen 
                ? 'border-primary/40 ring-2 ring-primary/20' 
                : 'border-border-soft'} 
            ${className}
          `}
        >
          <span className={`truncate ${!value && 'text-muted'}`}>{displayLabel}</span>
          <ChevronDown size={16} className={`${error ? 'text-red-500' : 'text-muted'} transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </div>

        {/* Pesan Error di bawah box */}
        {error && (
          <p className="text-[11px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        {isOpen && createPortal(
          <div className="select-portal-container fixed inset-0 z-[9999] pointer-events-none">
            <div 
              className="absolute pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
              style={{
                width: coords.width,
                left: coords.left,
                top: coords.dropUp ? 'auto' : coords.top + 8,
                bottom: coords.dropUp ? (window.innerHeight - coords.top + window.scrollY) + 8 : 'auto'
              }}
            >
              <div className="w-full bg-[var(--background)] border border-border-soft rounded-[var(--radius)] shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                <div className="p-3 border-b border-border-soft bg-zinc-50/50 dark:bg-white/[0.02] flex items-center gap-2">
                  <Search size={14} className="text-muted shrink-0" />
                  <input
                    autoFocus
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="Cari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {isLoading && <Loader2 size={14} className="animate-spin text-primary" />}
                </div>

                <div className="max-h-60 overflow-y-auto custom-scrollbar bg-[var(--background)]">
                  {filteredOptions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted italic">Data tidak ditemukan</div>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = multiple ? (value as any[])?.includes(opt.value) : value === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            if (multiple) {
                              const current = Array.isArray(value) ? value : [];
                              onChange(current.includes(opt.value) ? current.filter(v => v !== opt.value) : [...current, opt.value]);
                            } else {
                              onChange(opt.value);
                              setIsOpen(false);
                            }
                          }}
                          className={`px-4 py-3 flex items-center justify-between text-sm cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
});

Select.displayName = "Select";