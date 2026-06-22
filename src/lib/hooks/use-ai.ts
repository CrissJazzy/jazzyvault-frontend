"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { AiRequest, AiRequestListResponse, AiRequestType } from "@/types";

export function useAiHistory(limit: number = 50) {
  return useQuery({
    queryKey: ["ai-history", limit],
    queryFn: () => api.get<AiRequestListResponse>(`/ai/history?limit=${limit}`),
  });
}

export function useRunAiAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      action,
      fileId,
      targetLanguage,
    }: {
      action: AiRequestType;
      fileId: string;
      targetLanguage?: string;
    }) =>
      api.post<AiRequest>(`/ai/${action}`, {
        file_id: fileId,
        target_language: targetLanguage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
