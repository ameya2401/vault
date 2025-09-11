export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded_at: string;
  file_path?: string; // For Supabase compatibility
  download_url?: string; // For GitHub compatibility
  sha?: string; // For GitHub compatibility
}

// GitHub-specific file interface
export interface GitHubFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded_at: string;
  download_url: string;
  sha: string;
}