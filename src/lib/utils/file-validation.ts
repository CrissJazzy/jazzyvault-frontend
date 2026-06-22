export const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

// Keep in sync with backend MAX_UPLOAD_SIZE_MB (app/core/config.py)
export const MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
export const MAX_UPLOAD_SIZE_LABEL = "25MB";

export function isAcceptedFileType(file: File): boolean {
  const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat();
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return acceptedExtensions.includes(ext);
}
