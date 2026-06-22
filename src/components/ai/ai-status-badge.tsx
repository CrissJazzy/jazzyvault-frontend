import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiRequestStatus } from "@/types";

const STATUS_CONFIG: Record<
  AiRequestStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-emerald-400 bg-emerald-500/10",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "text-brand-accent bg-brand-accent/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-400 bg-amber-500/10",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "text-red-400 bg-red-500/10",
  },
};

export function AiStatusBadge({ status }: { status: AiRequestStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className
      )}
    >
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {config.label}
    </span>
  );
}
