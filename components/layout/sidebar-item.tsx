"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarItem = ({ 
  item, 
  isMinimized, 
  expandSidebar, 
  setIsMobileOpen, 
  level = 1,
  isOpen: accordionIsOpen, 
  onToggle 
}: any) => {
  // Level 2+ tetap pakai state sendiri agar bisa buka sub-menu secara bebas
  const [internalOpen, setInternalOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  // Gunakan state dari parent jika di level 1 (Accordion), pakai state internal jika level 2+
  const isOpen = level === 1 ? accordionIsOpen : internalOpen;

  const hasActiveChild = (menuItem: any): boolean => {
    if (!menuItem.children) return false;
    return menuItem.children.some((child: any) => 
      child.href === pathname || hasActiveChild(child)
    );
  };

  useEffect(() => {
    // Jika reload dan ada anak aktif, buka parentnya
    if (hasActiveChild(item) && !isMinimized && !isOpen) {
      if (level === 1) {
        onToggle(); 
      } else {
        setInternalOpen(true);
      }
    }
  }, [pathname, isMinimized]);

  const Icon = item.icon || Circle;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMinimized) {
      expandSidebar();
      if (level === 1) onToggle();
      else setInternalOpen(true);
    } else {
      if (level === 1) onToggle();
      else setInternalOpen(!internalOpen);
    }
  };

  const handleLinkClick = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const content = (
    <div 
      className={`
        flex items-center h-11 rounded-xl transition-all duration-200 group relative mb-1
        ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-primary/10 hover:text-primary text-zinc-600"}
        ${isMinimized ? "justify-center" : "px-3 gap-3"}
      `}
      onClick={hasChildren ? handleToggle : handleLinkClick}
    >
      <div className="flex items-center justify-center shrink-0">
        <Icon size={level > 1 ? 14 : 20} className={isActive ? "text-white" : ""} />
      </div>
      
      {!isMinimized && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-medium truncate">{item.title}</span>
          {hasChildren && (
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 ml-2">
              <ChevronDown size={14} />
            </motion.div>
          )}
        </motion.div>
      )}

      {isMinimized && (
        <div className="fixed left-20 bg-zinc-900 text-white px-3 py-1.5 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[999] whitespace-nowrap shadow-xl">
          {item.title}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full cursor-pointer">
      {hasChildren ? content : <Link href={item.href || "#"} className="block">{content}</Link>}

      <AnimatePresence>
        {hasChildren && isOpen && !isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden border-zinc-200 ml-5 pl-2 mt-1"
          >
            {item.children.map((child: any, idx: number) => (
              <SidebarItem 
                key={child.title + idx} 
                item={child} 
                isMinimized={isMinimized} 
                expandSidebar={expandSidebar}
                setIsMobileOpen={setIsMobileOpen}
                level={level + 1} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};