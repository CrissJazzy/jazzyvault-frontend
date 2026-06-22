"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Welcome back{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="text-sm text-brand-textSecondary">
          Here&apos;s what&apos;s happening in your vault
        </p>
      </div>

      <AnalyticsCards />

      <ActivityTimeline limit={10} />
    </div>
  );
}
