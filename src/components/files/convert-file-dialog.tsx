"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { VaultFile } from "@/types";
import { useConvertFile } from "@/lib/hooks/use-conversions";
import { getConversionTargets } from "@/lib/utils/conversion-rules";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConvertFileDialog({
  file,
  onClose,
}: {
  file: VaultFile;
  onClose: () => void;
}) {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const convertMutation = useConvertFile();
  const targets = getConversionTargets(file.file_type);

  const handleConvert = async () => {
    if (!selectedFormat) return;
    try {
      await convertMutation.mutateAsync({
        fileId: file.id,
        targetFormat: selectedFormat,
      });
      toast.success(
        `"${file.file_name}" converted to ${selectedFormat.toUpperCase()}.`
      );
      onClose();
      router.push("/conversions");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Conversion failed.";
      toast.error(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-sm rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
            <RefreshCw className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Convert file</h3>
            <p className="text-xs text-brand-textSecondary/70">
              {file.file_name}
            </p>
          </div>
        </div>

        {targets.length === 0 ? (
          <p className="text-sm text-brand-textSecondary">
            No conversions are currently supported for{" "}
            {file.file_type.toUpperCase()} files.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-brand-textSecondary">
              Convert to:
            </p>
            <div className="flex flex-wrap gap-2">
              {targets.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    selectedFormat === format
                      ? "border-brand-primary bg-brand-primary/10 text-white"
                      : "border-white/10 text-brand-textSecondary hover:border-white/20 hover:text-white"
                  )}
                >
                  {file.file_type.toUpperCase()}
                  <ArrowRight className="h-3 w-3" />
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!selectedFormat || targets.length === 0}
            isLoading={convertMutation.isPending}
            onClick={handleConvert}
          >
            Convert
          </Button>
        </div>
      </div>
    </div>
  );
}
