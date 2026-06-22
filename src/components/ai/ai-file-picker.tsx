"use client";

import { useState } from "react";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import { useFiles } from "@/lib/hooks/use-files";
import { getFileIcon } from "@/components/files/file-icon";
import { truncateFilename, cn } from "@/lib/utils";
import type { VaultFile } from "@/types";

// AI document intelligence currently supports text-extractable formats
// only. Keep in sync with backend SUPPORTED_AI_FILE_TYPES
// (app/services/ai_service.py).
const AI_SUPPORTED_TYPES = new Set(["docx", "pdf", "txt"]);

export function AiFilePicker({
  selectedFile,
  onSelect,
}: {
  selectedFile: VaultFile | null;
  onSelect: (file: VaultFile) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useFiles({ sortBy: "created_at", sortOrder: "desc" });

  const eligibleFiles = (data?.files ?? []).filter((f) =>
    AI_SUPPORTED_TYPES.has(f.file_type)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-white/5 px-3.5 text-sm text-white hover:border-white/20"
      >
        {selectedFile ? (
          <span className="flex items-center gap-2 truncate">
            <FileText className="h-4 w-4 shrink-0 text-brand-textSecondary/60" />
            {truncateFilename(selectedFile.file_name, 36)}
          </span>
        ) : (
          <span className="text-brand-textSecondary/50">
            Select a DOCX, PDF, or TXT file…
          </span>
        )}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-brand-textSecondary/60 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-lg border border-white/10 bg-card shadow-xl">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-brand-textSecondary" />
            </div>
          )}

          {!isLoading && eligibleFiles.length === 0 && (
            <p className="px-3.5 py-4 text-center text-xs text-brand-textSecondary">
              No DOCX, PDF, or TXT files in your vault yet. Upload one in{" "}
              <span className="text-brand-accent">My Files</span> first.
            </p>
          )}

          {eligibleFiles.map((file) => {
            const { icon: Icon, color } = getFileIcon(file.file_type);
            return (
              <button
                key={file.id}
                onClick={() => {
                  onSelect(file);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-white hover:bg-white/5"
              >
                <Icon className={cn("h-4 w-4 shrink-0", color)} />
                <span className="truncate">{truncateFilename(file.file_name, 40)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
