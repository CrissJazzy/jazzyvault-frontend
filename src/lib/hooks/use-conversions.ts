"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Conversion, ConversionHistoryResponse } from "@/types";

export interface ConversionHistoryParams {
  status?: string;
  search?: string;
  type?: string; // "input_format-output_format", e.g. "docx-pdf"
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
}

function buildHistoryQueryString(params: ConversionHistoryParams): string {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.search) search.set("search", params.search);
  if (params.type) search.set("type", params.type);
  if (params.dateFrom) search.set("date_from", params.dateFrom);
  if (params.dateTo) search.set("date_to", params.dateTo);
  if (params.sortOrder) search.set("sort_order", params.sortOrder);
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useConversionHistory(params: ConversionHistoryParams = {}) {
  return useQuery({
    queryKey: ["conversions", params],
    queryFn: () =>
      api.get<ConversionHistoryResponse>(
        `/convert/history${buildHistoryQueryString(params)}`
      ),
  });
}

export function useConvertFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileId,
      targetFormat,
    }: {
      fileId: string;
      targetFormat: string;
    }) => api.post<Conversion>("/convert", { file_id: fileId, target_format: targetFormat }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversions"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}
