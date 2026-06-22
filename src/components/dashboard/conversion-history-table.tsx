"use client";

import { useState } from "react";
import {
  Search,
  ArrowUpDown,
  Download,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useConversionHistory,
  type ConversionHistoryParams,
} from "@/lib/hooks/use-conversions";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { formatBytes, truncateFilename } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { ConversionStatusBadge } from "@/components/dashboard/conversion-status-badge";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CONVERSION_TYPE_FILTERS,
  CONVERSION_STATUS_FILTERS,
} from "@/lib/utils/conversion-history-filters";
import { getFileIcon } from "@/components/files/file-icon";
import type { FileType, VaultFile } from "@/types";

async function redownloadOutput(outputFileId: string) {
  try {
    const file = await api.get<VaultFile>(`/files/${outputFileId}`);
    api.post(`/files/${outputFileId}/track-download`).catch(() => {});
    const link = document.createElement("a");
    link.href = file.file_url;
    link.download = file.file_name;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    toast.error("Couldn't retrieve that file. It may have been deleted.");
  }
}

export function ConversionHistoryTable() {
  const [searchInput, setSearchInput] = useState("");
  const [params, setParams] = useState<ConversionHistoryParams>({
    sortOrder: "desc",
    limit: 100,
  });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, isError } = useConversionHistory(params);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setParams((prev) => ({ ...prev, search: value || undefined }));
  }, 350);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setParams((prev) => ({
      ...prev,
      dateFrom: from ? `${from}T00:00:00Z` : undefined,
      dateTo: to ? `${to}T23:59:59Z` : undefined,
    }));
  };

  const toggleSortOrder = () => {
    setParams((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textSecondary/60" />
          <input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by file name…"
            className="h-10 w-full rounded-lg border border-input bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-brand-textSecondary/40 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={params.type || ""}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, type: e.target.value || undefined }))
            }
            className="h-10 rounded-lg border border-input bg-white/5 px-3 text-sm text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            {CONVERSION_TYPE_FILTERS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-brand-bg">
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={params.status || ""}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, status: e.target.value || undefined }))
            }
            className="h-10 rounded-lg border border-input bg-white/5 px-3 text-sm text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            {CONVERSION_STATUS_FILTERS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-brand-bg">
                {opt.label}
              </option>
            ))}
          </select>

          <DateRangePicker
            dateFrom={dateFrom}
            dateTo={dateTo}
            onChange={handleDateChange}
          />

          <button
            onClick={toggleSortOrder}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-input bg-white/5 px-3 text-sm text-white hover:border-white/20"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {params.sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-left text-xs text-brand-textSecondary">
              <th className="px-4 py-3 font-medium">File</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Conversion</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Size</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-4 w-4 shrink-0 rounded" />
                      <Skeleton className="h-3.5 w-32" />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Skeleton className="h-3.5 w-20" />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Skeleton className="h-3.5 w-14" />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Skeleton className="h-3.5 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Skeleton className="ml-auto h-7 w-7 rounded-md" />
                  </td>
                </tr>
              ))}

            {isError && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-brand-textSecondary">
                  Couldn&apos;t load conversion history. Is the backend running?
                </td>
              </tr>
            )}

            {!isLoading && !isError && data?.conversions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <Inbox className="mx-auto mb-2 h-8 w-8 text-brand-textSecondary/40" />
                  <p className="text-sm text-brand-textSecondary">
                    No conversions match your filters yet.
                  </p>
                </td>
              </tr>
            )}

            {data?.conversions.map((conversion) => {
              const { icon: Icon, color } = getFileIcon(
                conversion.input_format as FileType
              );
              return (
                <tr
                  key={conversion.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                      <span className="text-white">
                        {truncateFilename(conversion.file_name, 28)}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-brand-textSecondary">
                      <span className="font-medium text-white">
                        {conversion.input_format.toUpperCase()}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium text-white">
                        {conversion.output_format.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-brand-textSecondary md:table-cell">
                    {formatBytes(conversion.file_size)}
                  </td>
                  <td className="hidden px-4 py-3 text-brand-textSecondary md:table-cell">
                    {new Date(conversion.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <ConversionStatusBadge status={conversion.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {conversion.status === "completed" && conversion.output_file_id ? (
                      <button
                        onClick={() => redownloadOutput(conversion.output_file_id!)}
                        className="rounded-md p-1.5 text-brand-textSecondary hover:bg-white/5 hover:text-white"
                        title="Download converted file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-brand-textSecondary/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && data.total > 0 && (
        <p className="text-xs text-brand-textSecondary/60">
          {data.total} conversion{data.total !== 1 && "s"}
        </p>
      )}
    </div>
  );
}
