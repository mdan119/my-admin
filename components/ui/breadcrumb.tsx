"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment, useMemo } from "react";
import { SIDEBAR_MENU, MenuItem } from "@/constants/menu-data";
import { useLang } from "@/context/LangContext";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { __lang } = useLang();

  // Fungsi rekursif untuk mencari urutan menu (breadth-first search)
  const breadcrumbTrail = useMemo(() => {
    const findPath = (menu: MenuItem[], targetHref: string, parents: string[] = []): string[] | null => {
      for (const item of menu) {
        // Gabungkan title saat ini ke urutan parents
        const currentPath = [...parents, item.title];

        // Jika href cocok, kita temukan jalurnya!
        if (item.href === targetHref) return currentPath;

        // Jika punya anak, cari di dalamnya
        if (item.children) {
          const result = findPath(item.children, targetHref, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    return findPath(SIDEBAR_MENU, pathname) || [];
  }, [pathname]);

  // Jika jalur tidak ditemukan di config (misal halaman 404 atau detail id), 
  // kita fallback ke segmen URL seperti biasa.
  const displayItems = breadcrumbTrail.length > 0 
    ? breadcrumbTrail 
    : pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1));

  return (
    <div className="flex items-center gap-2 text-white">
      {displayItems.map((label, index) => {
        const isLast = index === displayItems.length - 1;

        return (
          <Fragment key={label}>
            {isLast ? (
              <span className="font-semibold tracking-wide">
                {__lang('menu.'+label)}
              </span>
            ) : (
              <>
                <span className="opacity-60 hidden sm:block">
                  {__lang('menu.'+label)}
                </span>
                <span className="opacity-40 hidden sm:block">/</span>
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}