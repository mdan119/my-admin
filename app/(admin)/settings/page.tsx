"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { APP_CONFIG as INITIAL_CONFIG, AppConfig } from "@/constants/app-config";
import { Save, Palette, Type, Layout, CheckCircle2, Image as ImageIcon, MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { formatFileUrl } from "@/lib/storage";

// Import Server Action
import { saveGlobalConfig } from "./action";
import { useLang } from "@/context/LangContext";

// Memoized Section untuk mencegah re-render yang tidak perlu saat mengetik
const MemoizedCard = React.memo(Card);

export default function SettingsPage() {
  const router = useRouter();
  const { loadModules, unloadModules, __lang } = useLang();

  useEffect(() => {
    loadModules(["settings"]);
    return () => {
      unloadModules(["settings"]);
    };
  }, [loadModules, unloadModules]);
  
  // 1. Initial State dengan Lazy Initializer
  const [formConfig, setFormConfig] = useState<AppConfig>(() => ({
    ...INITIAL_CONFIG,
    logoUrl: formatFileUrl(INITIAL_CONFIG.logoUrl, { isPrivate: false, subFolder: "settings" }),
    faviconUrl: formatFileUrl(INITIAL_CONFIG.faviconUrl, { isPrivate: false, subFolder: "settings" }),
  }));

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // 2. Optimized Handler menggunakan useCallback
  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setFormConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await saveGlobalConfig(formConfig);

      if (result.success) {
        // 3. Sinkronisasi UI Global hanya setelah berhasil
        const root = document.documentElement;
        root.style.setProperty("--primary", formConfig.primaryColor);
        root.style.setProperty("--radius", formConfig.borderRadius);
        
        // Memaksa Next.js mengambil data terbaru untuk komponen server (Logo, App Name, dll)
        router.refresh(); 
        
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-10">
      {/* Header - Statis tidak akan re-render karena state formConfig */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-soft)] pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            {__lang('settings.settings_title')}
          </h1>
          <p className="text-[var(--muted)] mt-1">{__lang('settings.settings_desc')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: IDENTITY */}
        <MemoizedCard title={__lang('settings.section_identity')} description={__lang('settings.section_identity_desc')} icon={ImageIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <ImageUpload 
              label={__lang('settings.label_logo')}
              value={formConfig.logoUrl}
              onChange={(val) => updateConfig({ logoUrl: val })}
              maxSizeMB={2}
            />
            <ImageUpload 
              label={__lang('settings.label_favicon')}
              value={formConfig.faviconUrl}
              onChange={(val) => updateConfig({ faviconUrl: val })}
              maxSizeMB={2}
            />
          </div>
          <Input 
            label={__lang('settings.app_name')}
            value={formConfig.appName} 
            required={true}
            error={errors.appName?.[0]}
            onChange={(val) => updateConfig({ appName: val })}
            placeholder={__lang('settings.app_name_placeholder')}
          />
        </MemoizedCard>

        {/* SECTION 2: VISUAL STYLE */}
        <MemoizedCard title={__lang('settings.section_visual')} description={__lang('settings.section_visual_desc')} icon={Palette}>
          <div className="space-y-6">
            <Input 
              label={__lang('settings.primary_color')}
              value={formConfig.primaryColor} 
              onChange={(val) => updateConfig({ primaryColor: val })}
              className="font-mono uppercase"
              placeholder="#000000"
              required={true}
              prefix={
                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border-soft">
                  <input 
                    type="color" 
                    value={formConfig.primaryColor || "#000000"}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                  />
                </div>
              }
            />

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] ml-1">{__lang('settings.border_radius')}</label>
              <div className="flex flex-wrap gap-2">
                {["0px", "4px", "8px", "12px", "16px", "24px"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateConfig({ borderRadius: r })}
                    className={`px-5 py-2 rounded-[var(--radius)] border text-xs font-bold transition-all ${
                      formConfig.borderRadius === r 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'border-[var(--border-soft)] text-[var(--muted)] hover:bg-zinc-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </MemoizedCard>

        {/* SECTION 3: TYPOGRAPHY */}
        <MemoizedCard title={__lang('settings.section_typography')} description={__lang('settings.section_typography_desc')} icon={Type}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="Font Family"
              required={true}
              value={formConfig.fontFamily}
              error={errors.fontFamily}
              onChange={(val: string) => {
                updateConfig({ fontFamily: val });
                if(errors.fontFamily) setErrors({...errors, fontFamily: ""});
              }}
              options={[
                { label: __lang('settings.font_family_geist'), value: "geist" },
                { label: __lang('settings.font_family_poppins'), value: "poppins" },
                { label: __lang('settings.font_family_roboto'), value: "roboto" }
              ]}
            />
            <Input 
              label={__lang('settings.font_size')} 
              type="number"
              value={formConfig.fontSize}
              required={true}
              suffix="PX"
              error={errors.fontSize?.[0]}
              onChange={(val) => updateConfig({ fontSize: val })}
              placeholder="14"
            />
          </div>
        </MemoizedCard>

        {/* Floating Success Notification */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-6 py-3 bg-green-500 text-white rounded-full flex items-center gap-3 text-sm font-bold shadow-2xl"
              >
                <CheckCircle2 size={18} />
                {__lang('settings.msg_success')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            isLoading={isLoading} 
            className="px-10 h-14 shadow-2xl shadow-primary/30 min-w-[240px]"
          >
            <Save size={18} />
            {__lang('settings.btn_save')}
          </Button>
        </div>
      </div>
    </div>
  );
}