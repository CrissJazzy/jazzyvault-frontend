"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { GlobalSearchResponse } from "@/types";

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ["global-search", query],
    queryFn: () =>
      api.get<GlobalSearchResponse>(`/dashboard/search?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length > 0,
  });
}
