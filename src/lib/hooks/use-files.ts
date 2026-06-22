"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  FileListResponse,
  MultiFileUploadResponse,
  VaultFile,
} from "@/types";

export interface FileListParams {
  search?: string;
  fileType?: string;
  sortBy?: "created_at" | "file_name" | "file_size";
  sortOrder?: "asc" | "desc";
}

function buildQueryString(params: FileListParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.fileType) search.set("file_type", params.fileType);
  if (params.sortBy) search.set("sort_by", params.sortBy);
  if (params.sortOrder) search.set("sort_order", params.sortOrder);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useFiles(params: FileListParams = {}) {
  return useQuery({
    queryKey: ["files", params],
    queryFn: () =>
      api.get<FileListResponse>(`/files${buildQueryString(params)}`),
  });
}

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      return api.upload<MultiFileUploadResponse>("/files/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => api.delete(`/files/${fileId}`),
    onMutate: async (fileId: string) => {
      await queryClient.cancelQueries({ queryKey: ["files"] });
      const previous = queryClient.getQueriesData<FileListResponse>({
        queryKey: ["files"],
      });

      // Optimistically remove the file so the UI feels instant.
      queryClient.setQueriesData<FileListResponse>(
        { queryKey: ["files"] },
        (old) =>
          old
            ? {
                files: old.files.filter((f: VaultFile) => f.id !== fileId),
                total: old.total - 1,
              }
            : old
      );

      return { previous };
    },
    onError: (_err, _fileId, context) => {
      // Roll back on failure.
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
