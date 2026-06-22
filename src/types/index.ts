export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  storage_used_bytes: number;
  storage_limit_bytes: number;
  created_at: string;
  updated_at: string;
}

export type FileType = "docx" | "pdf" | "txt" | "jpg" | "jpeg" | "png" | "pptx" | "xlsx";

export interface VaultFile {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: FileType;
  storage_path: string;
  created_at: string;
}

export interface FileUploadResult {
  file: VaultFile | null;
  file_name: string;
  success: boolean;
  error: string | null;
}

export interface MultiFileUploadResponse {
  results: FileUploadResult[];
  uploaded_count: number;
  failed_count: number;
}

export interface FileListResponse {
  files: VaultFile[];
  total: number;
}

export type ConversionStatus = "pending" | "processing" | "completed" | "failed";

export interface Conversion {
  id: string;
  user_id: string;
  input_file_id: string;
  output_file_id: string | null;
  input_format: string;
  output_format: string;
  status: ConversionStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ConversionListResponse {
  conversions: Conversion[];
  total: number;
}

export interface ConversionHistoryEntry {
  id: string;
  user_id: string;
  input_file_id: string;
  output_file_id: string | null;
  file_name: string;
  file_size: number;
  input_format: string;
  output_format: string;
  status: ConversionStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ConversionHistoryResponse {
  conversions: ConversionHistoryEntry[];
  total: number;
}

export interface DashboardStats {
  total_files: number;
  total_conversions: number;
  successful_conversions: number;
  failed_conversions: number;
  storage_used_bytes: number;
  storage_limit_bytes: number;
}

export type ActivityType =
  | "file_upload"
  | "file_delete"
  | "file_download"
  | "conversion_started"
  | "conversion_completed"
  | "conversion_failed"
  | "ai_request";

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ActivityFeedResponse {
  activities: ActivityLogEntry[];
  total: number;
}

export type AiRequestType =
  | "summarize"
  | "insights"
  | "simplify"
  | "translate"
  | "analyze";

export type AiRequestStatus = "pending" | "processing" | "completed" | "failed";

export interface AiRequest {
  id: string;
  user_id: string;
  file_id: string;
  request_type: AiRequestType;
  input_params: Record<string, unknown>;
  response: string | null;
  status: AiRequestStatus;
  error_message: string | null;
  ai_provider: string;
  created_at: string;
  completed_at: string | null;
}

export interface AiRequestListResponse {
  requests: AiRequest[];
  total: number;
}

export interface SearchResult {
  type: "file" | "conversion" | "ai_request";
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
  link: string;
}

export interface GlobalSearchResponse {
  results: SearchResult[];
  total: number;
}
