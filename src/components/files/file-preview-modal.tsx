"use client";

import { useEffect } from "react";
import { X, Download } from "lucide-react";
import type { VaultFile } from "@/types";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";

const PREVIEWABLE_TYPES = new Set(["jpg", "jpeg", "png", "pdf"]);

function trackDownload(fileId: string) {
  api.post(`/files/${fileId}/track-download`).catch(() => {});
}

export function FilePreviewModal({
  file,
  onClose,
}: {
  file: VaultFile;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const isImage = ["jpg", "jpeg", "png"].includes(file.file_type);
  const isPdf = file.file_type === "pdf";
  const canPreview = PREVIEWABLE_TYPES.has(file.file_type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <p className="truncate text-sm font-medium text-white">
            {file.file_name}
          </p>
          <div className="flex items-center gap-2">
            <a href={file.file_url} download={file.file_name} target="_blank" rel="noreferrer" onClick={() => trackDownload(file.id)}>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-brand-textSecondary hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.file_url}
              alt={file.file_name}
              className="mx-auto max-h-[65vh] rounded-lg object-contain"
            />
          )}
          {isPdf && (
            <iframe
              src={file.file_url}
              title={file.file_name}
              className="h-[65vh] w-full rounded-lg bg-white"
            />
          )}
          {!canPreview && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-sm text-brand-textSecondary">
                Preview isn&apos;t available for this file type.
              </p>
              <a href={file.file_url} download={file.file_name} target="_blank" rel="noreferrer" onClick={() => trackDownload(file.id)}>
                <Button size="sm">
                  <Download className="h-4 w-4" />
                  Download instead
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
