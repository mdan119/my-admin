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
    title: "product",
    icon: Box,
    children: [
      { title: "product_list", href: "/products" },
      { 
        title: "categories", 
        children: [
          { title: "electronic", href: "/products/elektronik" },
          { title: "fashion", href: "/products/fashion" },
        ] 
      },
    ],
  },
  {
    title: "sales_transactions",
    icon: Settings,
    children: [
      { title: "sales_list", href: "/sellings" },
      { title: "new_sale", href: "/input-selling" },
    ],
  },
  { title: "users", icon: User, href: "/users" },

];