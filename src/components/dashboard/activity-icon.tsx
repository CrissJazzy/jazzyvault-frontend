import {
  Upload,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ActivityType } from "@/types";

export function getActivityIcon(type: ActivityType): {
  icon: LucideIcon;
  color: string;
  bg: string;
} {
  switch (type) {
    case "file_upload":
      return { icon: Upload, color: "text-brand-primary", bg: "bg-brand-primary/10" };
    case "file_delete":
      return { icon: Trash2, color: "text-red-400", bg: "bg-red-500/10" };
    case "file_download":
      return { icon: Download, color: "text-brand-accent", bg: "bg-brand-accent/10" };
    case "conversion_started":
      return { icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-500/10" };
    case "conversion_completed":
      return { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" };
    case "conversion_failed":
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" };
    case "ai_request":
      return { icon: Sparkles, color: "text-brand-secondary", bg: "bg-brand-secondary/10" };
    default:
      return { icon: Upload, color: "text-brand-textSecondary", bg: "bg-white/5" };
  }
}
