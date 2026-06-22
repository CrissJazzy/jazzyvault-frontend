export const CONVERSION_TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "docx-pdf", label: "DOCX → PDF" },
  { value: "pdf-docx", label: "PDF → DOCX" },
  { value: "pdf-jpg", label: "PDF → JPG" },
  { value: "pdf-png", label: "PDF → PNG" },
  { value: "jpg-pdf", label: "JPG → PDF" },
  { value: "jpeg-pdf", label: "JPEG → PDF" },
  { value: "png-pdf", label: "PNG → PDF" },
];

export const CONVERSION_STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];
