"use client";

import {
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HardDrive,
} from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats";
import { formatBytes } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARDS = [
  {
    key: "total_files" as const,
    label: "Files Uploaded",
    icon: FileText,
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
  },
  {
    key: "total_conversions" as const,
    label: "Total Conversions",
    icon: RefreshCw,
    color: "text-brand-accent",
    bg: "bg-brand-accent/10",
  },
  {
    key: "successful_conversions" as const,
    label: "Successful",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "failed_conversions" as const,
    label: "Failed",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

export function AnalyticsCards() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
            <Skeleton className="mb-1.5 h-7 w-12" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
        <Card className="col-span-2 p-4 sm:col-span-4">
          <Skeleton className="mb-3 h-9 w-full max-w-xs" />
          <Skeleton className="h-2 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-brand-textSecondary">
          Couldn&apos;t load your stats. Is the backend running?
        </p>
      </Card>
    );
  }

  const storagePercent = Math.min(
    100,
    Math.round((data.storage_used_bytes / data.storage_limit_bytes) * 100)
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key} className="p-4">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className="text-2xl font-semibold text-white">{data[key]}</p>
          <p className="text-xs text-brand-textSecondary">{label}</p>
        </Card>
      ))}

      <Card className="col-span-2 p-4 sm:col-span-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-secondary/10">
              <HardDrive className="h-4 w-4 text-brand-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Storage Usage</p>
              <p className="text-xs text-brand-textSecondary">
                {formatBytes(data.storage_used_bytes)} of{" "}
                {formatBytes(data.storage_limit_bytes)} used
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-white">{storagePercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
