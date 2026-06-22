"use client";

import { useState } from "react";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import {
  Search,
  ArrowUpDown,
  Download,
  Eye,
  Trash2,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { useFiles, useDeleteFile, type FileListParams } from "@/lib/hooks/use-files";
import { formatBytes, truncateFilename, cn } from "@/lib/utils";
import { getFileIcon } from "@/components/files/file-icon";
import { FilePreviewModal } from "@/components/files/file-preview-modal";
import { DeleteConfirmDialog } from "@/components/files/delete-confirm-dialog";
import { ConvertFileDialog } from "@/components/files/convert-file-dialog";
import { getConversionTargets } from "@/lib/utils/conversion-rules";
import { Skeleton } from "@/components/ui/skeleton";
import type { VaultFile } from "@/types";

// Fire-and-forget: records a file_download activity log entry. Never
// awaited or blocks the actual <a download> action — a tracking
// failure should never stop the user from getting their file.
function trackDownload(fileId: string) {
  api.post(`/files/${fileId}/track-download`).catch(() => {});
}

const FILE_TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "txt", label: "TXT" },
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "pptx", label: "PPTX" },
  { value: "xlsx", label: "XLSX" },
];

export function FileVaultTable() {
  const [searchInput, setSearchInput] = useState("");
  const [params, setParams] = useState<FileListParams>({
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VaultFile | null>(null);
  const [convertTarget, setConvertTarget] = useState<VaultFile | null>(null);

  const { data, isLoading, isError } = useFiles(params);
  const deleteMutation = useDeleteFile();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setParams((prev) => ({ ...prev, search: value || undefined }));
  }, 350);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const toggleSort = (column: FileListParams["sortBy"]) => {
    setParams((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.file_name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete file. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textSecondary/60" />
          <input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search files…"
            className="h-10 w-full rounded-lg border border-input bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-brand-textSecondary/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <select
          value={params.fileType || ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              fileType: e.target.value || undefined,
            }))
          }
          className="h-10 rounded-lg border border-input bg-white/5 px-3 text-sm text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          {FILE_TYPE_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-brand-bg">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs text-brand-textSecondary">
              <th className="px-4 py-3 font-medium">
                <button
                  onClick={() => toggleSort("file_name")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Name <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                <button
                  onClick={() => toggleSort("created_at")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Uploaded <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                <button
                  onClick={() => toggleSort("file_size")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Size <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-4 w-4 shrink-0 rounded" />
                      <Skeleton className="h-3.5 w-36" />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Skeleton className="h-3.5 w-20" />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Skeleton className="h-3.5 w-14" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}

            {isError && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-brand-textSecondary">
                  Couldn&apos;t load your files. Is the backend running?
                </td>
              </tr>
            )}

            {!isLoading && !isError && data?.files.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center">
                  <Inbox className="mx-auto mb-2 h-8 w-8 text-brand-textSecondary/40" />
                  <p className="text-sm text-brand-textSecondary">
                    No files yet. Upload something to get started.
                  </p>
                </td>
              </tr>
            )}

            {data?.files.map((file) => {
              const { icon: Icon, color } = getFileIcon(file.file_type);
              return (
                <tr
                  key={file.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("h-4 w-4 shrink-0", color)} />
                      <span className="text-white">
                        {truncateFilename(file.file_name, 32)}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-brand-textSecondary md:table-cell">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="hidden px-4 py-3 text-brand-textSecondary sm:table-cell">
                    {formatBytes(file.file_size)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="rounded-md p-1.5 text-brand-textSecondary hover:bg-white/5 hover:text-white"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {getConversionTargets(file.file_type).length > 0 && (
                        <button
                          onClick={() => setConvertTarget(file)}
                          className="rounded-md p-1.5 text-brand-textSecondary hover:bg-white/5 hover:text-white"
                          title="Convert"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                      <a
                        href={file.file_url}
                        download={file.file_name}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackDownload(file.id)}
                        className="rounded-md p-1.5 text-brand-textSecondary hover:bg-white/5 hover:text-white"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => setDeleteTarget(file)}
                        className="rounded-md p-1.5 text-brand-textSecondary hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && data.total > 0 && (
        <p className="text-xs text-brand-textSecondary/60">
          {data.total} file{data.total !== 1 && "s"}
        </p>
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {convertTarget && (
        <ConvertFileDialog
          file={convertTarget}
          onClose={() => setConvertTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          fileName={deleteTarget.file_name}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
