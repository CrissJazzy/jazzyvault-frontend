"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ActivityFeedResponse } from "@/types";

export function useRecentActivity(limit: number = 20) {
  return useQuery({
    queryKey: ["activity", limit],
    queryFn: () => api.get<ActivityFeedResponse>(`/activity/recent?limit=${limit}`),
  });
}
