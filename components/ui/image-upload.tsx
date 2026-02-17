"use client";

import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useImageUpload } from "@/hooks/use-image-upload";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (path: string) => void;
  isPrivate?: boolean;
  maxSizeMB?: number;
}

export function ImageUpload({ label, value, onChange, isPrivate = false, maxSizeMB = 2 }: ImageUploadProps) {
  const { __lang } = useLang();
  const { loading, mounted, handleUpload, handleRemove } = useImageUpload(onChange, maxSizeMB, isPrivate);

  // Helper untuk alert agar logic alert tetap di UI
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleUpload(e);
    if (result?.error === "file_too_large") {
      alert(`${__lang('common.file_too_large')} (Max ${maxSizeMB}MB)`);
    } else if (result?.error) {
      alert(result.error);
    }
  };

  if (!mounted) return <div className="flex flex-col gap-2 w-full"><div className="h-5 w-20 bg-transparent" /><div className="aspect-video w-full rounded-2xl bg-zinc-100/50 animate-pulse" /></div>;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider ml-1">
        {label}
      </label>

      <div className={`relative group border-2 border-dashed rounded-2xl p-4 transition-all duration-300 border-primary bg-emerald-50/30 dark:bg-emerald-500/5`}>
        {value ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700">
            <Image src={value} alt="Preview" fill className="object-contain p-2" unoptimized={isPrivate} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button type="button" onClick={handleRemove} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl transform hover:scale-110 transition-all duration-200">
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center py-1 cursor-pointer group ${loading ? 'pointer-events-none' : ''}`}>
            <div className={`p-4 rounded-2xl mb-3 transition-all duration-300 ${loading ? 'bg-zinc-100' : 'bg-primary/10 group-hover:bg-primary/20 group-hover:rotate-6'}`}>
              {loading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <Upload className="w-8 h-8 text-primary" />}
            </div>
            <div className="text-center">
              <span className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {loading ? __lang('common.uploading') : __lang('common.click_to_upload')}
              </span>
              <span className="text-xs text-zinc-400 mt-1">Max. {maxSizeMB}MB (JPG, PNG, WebP)</span>
            </div>
            <input type="file" className="hidden" onChange={onFileChange} accept="image/*,.ico" disabled={loading} />
          </label>
        )}
      </div>
    </div>
  );
}