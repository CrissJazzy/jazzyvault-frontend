"use client";

import { Inbox } from "lucide-react";
import { useRecentActivity } from "@/lib/hooks/use-recent-activity";
import { getActivityIcon } from "@/components/dashboard/activity-icon";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function timeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

export function ActivityTimeline({ limit = 10 }: { limit?: number }) {
  const { data, isLoading, isError } = useRecentActivity(limit);

  return (
    <Card>
      <h2 className="mb-4 text-sm font-medium text-white">Recent Activity</h2>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="py-8 text-center text-sm text-brand-textSecondary">
          Couldn&apos;t load recent activity.
        </p>
      )}

      {!isLoading && !isError && data?.activities.length === 0 && (
        <div className="py-12 text-center">
          <Inbox className="mx-auto mb-2 h-7 w-7 text-brand-textSecondary/40" />
          <p className="text-sm text-brand-textSecondary">
            No activity yet. Upload a file to get started.
          </p>
        </div>
      )}

      {data && data.activities.length > 0 && (
        <ol className="relative space-y-0">
          {data.activities.map((activity, index) => {
            const { icon: Icon, color, bg } = getActivityIcon(activity.activity_type);
            const isLast = index === data.activities.length - 1;
            return (
              <li key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-white/10" />
                )}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-sm text-white">{activity.description}</p>
                  <p className="text-xs text-brand-textSecondary/60">
                    {timeAgo(activity.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
