import { LayoutDashboard, Settings, User, Box, ChevronRight, Circle } from "lucide-react";

export interface MenuItem {
  title: string;
  icon?: any;
  href?: string;
  children?: MenuItem[];
}

export const SIDEBAR_MENU: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    title: "Produk",
    icon: Box,
    children: [
      { title: "List Produk", href: "/products" },
      { 
        title: "Kategori", 
        children: [
          { title: "Elektronik", href: "/products/elektronik" },
          { title: "Fashion", href: "/products/fashion" },
        ] 
      },
    ],
  },
  {
    title: "Transaksi Penjualan",
    icon: Settings,
    children: [
      { title: "List Penjualan", href: "/sellings" },
      { title: "Input Penjualan", href: "/input-selling" },
    ],
  },
  { title: "Users", icon: User, href: "/users" },

];