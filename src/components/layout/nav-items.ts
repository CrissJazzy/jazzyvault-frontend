import {
  LayoutDashboard,
  FolderOpen,
  RefreshCw,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/files", label: "My Files", icon: FolderOpen },
  { href: "/conversions", label: "Conversions", icon: RefreshCw },
  { href: "/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];
