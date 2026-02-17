"use client";

import { useState, useEffect } from "react";
import { uploadTempAction } from "@/lib/upload-action";
import { encryptPath } from "@/lib/crypto";

export function useImageUpload(
  onChange: (path: string) => void,
  maxSizeMB: number,
  isPrivate: boolean
) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // MANTUL: Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limitInBytes = maxSizeMB * 1024 * 1024;
    
    // Validasi Client
    if (file.size > limitInBytes) {
      e.target.value = "";
      return { error: "file_too_large" };
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ms", encryptPath(limitInBytes.toString()));

      const res = await uploadTempAction(formData, isPrivate);

      if (res?.url) {
        onChange(res.url);
        return { success: true };
      } 
      return { error: res?.error || "upload_failed" };
    } catch (error) {
      return { error: "system_error" };
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => onChange("");

  return { loading, mounted, handleUpload, handleRemove };
}