import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType as FileTypeIcon,
  File as FileIcon,
} from "lucide-react";
import type { FileType } from "@/types";

export function getFileIcon(fileType: FileType) {
  switch (fileType) {
    case "pdf":
      return { icon: FileText, color: "text-red-400" };
    case "docx":
      return { icon: FileTypeIcon, color: "text-blue-400" };
    case "txt":
      return { icon: FileText, color: "text-brand-textSecondary" };
    case "jpg":
    case "jpeg":
    case "png":
      return { icon: FileImage, color: "text-emerald-400" };
    case "pptx":
      return { icon: FileTypeIcon, color: "text-orange-400" };
    case "xlsx":
      return { icon: FileSpreadsheet, color: "text-green-400" };
    default:
      return { icon: FileIcon, color: "text-brand-textSecondary" };
  }
}
