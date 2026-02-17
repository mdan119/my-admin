import type { Metadata } from "next";
import { Poppins, Geist, Roboto } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/constants/app-config";
import { LanguageProvider } from "@/context/LangContext";
import { getDictionary } from "@/lib/lang";
import { cookies } from "next/headers";
import { formatFileUrl } from "@/lib/storage";

// 1. Optimasi Font: Gunakan display: 'swap' untuk FCP yang lebih cepat
const fontPoppins = Poppins({ 
  weight: ["400", "500", "600", "700"], // Kurangi weight yang tidak dipakai untuk memangkas ukuran font
  subsets: ["latin"], 
  variable: "--font-poppins",
  display: 'swap',
});

const fontGeist = Geist({ 
  subsets: ["latin"], 
  variable: "--font-geist",
  display: 'swap',
});

const fontRoboto = Roboto({ 
  weight: ["400", "500", "700"], 
  subsets: ["latin"], 
  variable: "--font-roboto",
  display: 'swap',
});

const faviconUrl = formatFileUrl(APP_CONFIG.faviconUrl, { 
  isPrivate: false, 
  subFolder: "settings" 
});

export const metadata: Metadata = {
  title: APP_CONFIG.appName,
  description: "Elite Admin System",
  icons: {
    icon: faviconUrl || "/favicon.ico",
    apple: faviconUrl || "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Akses Cookie & Dictionary secara paralel (jika ada fetching lain nanti)
  const cookieStore = await cookies();
  const initialLang = cookieStore.get("app-lang")?.value || "id";
  
  // Hanya ambil modul 'main' untuk initial load agar payload HTML awal kecil
  const initialDict = await getDictionary(initialLang, ["main"]);

  const fontMap: Record<string, any> = {
    poppins: fontPoppins,
    geist: fontGeist,
    roboto: fontRoboto
  };
  
  const selectedFont = fontMap[APP_CONFIG.fontFamily] || fontGeist;

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <head>
        {/* 3. Injeksi CSS Variables secara dinamis tanpa layout shift */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${APP_CONFIG.primaryColor};
            --radius: ${APP_CONFIG.borderRadius};
            --font-size-base: ${APP_CONFIG.fontSize}px;
            --font-main: var(${selectedFont.variable});
          }
        `}} />
      </head>
      <body className={`
        ${fontPoppins.variable} 
        ${fontGeist.variable} 
        ${fontRoboto.variable} 
        ${selectedFont.className} 
        antialiased
      `}>
        <LanguageProvider 
          initialLang={initialLang} 
          initialDict={initialDict}
        >
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}