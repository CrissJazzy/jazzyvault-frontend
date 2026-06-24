"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadCloud, FileText, X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn, formatBytes, truncateFilename } from "@/lib/utils";
import {
  ACCEPTED_FILE_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_LABEL,
} from "@/lib/utils/file-validation";
import { useUploadFiles } from "@/lib/hooks/use-files";
import { Button } from "@/components/ui/button";

interface QueuedFile {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export function FileUploader({ onUploaded }: { onUploaded?: () => void }) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const uploadMutation = useUploadFiles();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      rejections.forEach((rejection) => {
        const reason = rejection.errors[0]?.code === "file-too-large"
          ? `exceeds ${MAX_UPLOAD_SIZE_LABEL}`
          : "unsupported file type";
        toast.error(`"${rejection.file.name}" was rejected — ${reason}.`);
      });

      if (acceptedFiles.length > 0) {
        setQueue((prev) => [
          ...prev,
          ...acceptedFiles.map((file) => ({ file, status: "pending" as const })),
        ]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_UPLOAD_SIZE_BYTES,
    multiple: true,
  });

  const handleUpload = async () => {
    const pending = queue.filter((q) => q.status === "pending");
    if (pending.length === 0) return;

    setQueue((prev) =>
      prev.map((q) => (q.status === "pending" ? { ...q, status: "uploading" } : q))
    );

    try {
      const response = await uploadMutation.mutateAsync(
        pending.map((q) => q.file)
      );

      setQueue((prev) =>
        prev.map((q) => {
          if (q.status !== "uploading") return q;
          const result = response.results.find(
            (r) => r.file_name === q.file.name
          );
          if (result?.success) {
            return { ...q, status: "success" as const };
          }
          return {
            ...q,
            status: "error" as const,
            error: result?.error || "Upload failed",
          };
        })
      );

      if (response.uploaded_count > 0) {
        toast.success(
          `${response.uploaded_count} file${response.uploaded_count > 1 ? "s" : ""} uploaded successfully.`
        );
        onUploaded?.();
      }
      if (response.failed_count > 0) {
        toast.error(
          `${response.failed_count} file${response.failed_count > 1 ? "s" : ""} failed to upload.`
        );
      }
   } catch (error) {
  console.error("UPLOAD ERROR:", error);

  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Upload failed");
  }

  setQueue((prev) =>
    prev.map((q) =>
      q.status === "uploading"
        ? {
            ...q,
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Upload failed",
          }
        : q
    )
  );
}
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((q) => q.status !== "success"));
  };

  const hasPending = queue.some((q) => q.status === "pending");
  const isUploading = queue.some((q) => q.status === "uploading");

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition-colors hover:border-brand-primary/50 hover:bg-white/[0.04]",
          isDragActive && "border-brand-primary bg-brand-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-3 h-9 w-9 text-brand-textSecondary/60" />
        <p className="text-sm font-medium text-white">
          {isDragActive
            ? "Drop files here…"
            : "Drag & drop files, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-brand-textSecondary/60">
          DOCX, PDF, TXT, JPG, PNG, PPTX, XLSX — up to {MAX_UPLOAD_SIZE_LABEL} each
        </p>
      </div>

      {queue.length > 0 && (
        <div className="space-y-2">
          {queue.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5"
            >
              <FileText className="h-4 w-4 shrink-0 text-brand-textSecondary/60" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">
                  {truncateFilename(item.file.name, 36)}
                </p>
                <p className="text-xs text-brand-textSecondary/60">
                  {formatBytes(item.file.size)}
                  {item.status === "error" && item.error && (
                    <span className="text-red-400"> — {item.error}</span>
                  )}
                </p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-shimmer shimmer rounded-full" />
                  </div>
                )}
              </div>

              {item.status === "success" && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
              {item.status === "error" && (
                <XCircle className="h-4 w-4 shrink-0 text-red-400" />
              )}
              {(item.status === "pending" || item.status === "error") && (
                <button
                  onClick={() => removeFromQueue(index)}
                  className="shrink-0 text-brand-textSecondary/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-1">
            {queue.some((q) => q.status === "success") && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
            {hasPending && (
              <Button
                size="sm"
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={isUploading}
              >
                Upload {queue.filter((q) => q.status === "pending").length} file
                {queue.filter((q) => q.status === "pending").length !== 1 && "s"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
