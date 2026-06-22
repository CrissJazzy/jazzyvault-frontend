import type { FileType } from "@/types";

// Keep in sync with backend SUPPORTED_CONVERSIONS (app/schemas/conversion.py)
export const SUPPORTED_CONVERSIONS: Partial<Record<FileType, string[]>> = {
  docx: ["pdf"],
  pdf: ["docx", "jpg", "png"],
  jpg: ["pdf"],
  jpeg: ["pdf"],
  png: ["pdf"],
};

export function getConversionTargets(fileType: FileType): string[] {
  return SUPPORTED_CONVERSIONS[fileType] ?? [];
}
