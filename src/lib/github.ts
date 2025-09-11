// GitHub API client for file operations
const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded_at: string;
  download_url: string;
  sha: string;
}

class GitHubStorage {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;

  constructor() {
    this.owner = import.meta.env.VITE_GITHUB_OWNER || '';
    this.repo = import.meta.env.VITE_GITHUB_REPO || '';
    this.token = import.meta.env.VITE_GITHUB_TOKEN || '';
    this.branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  // Convert file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:type/subtype;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Upload file to GitHub repository
  async uploadFile(file: File): Promise<GitHubFile> {
    try {
      const fileName = `uploads/${Date.now()}-${file.name}`;
      const content = await this.fileToBase64(file);

      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${fileName}`,
        {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({
            message: `Upload ${file.name}`,
            content: content,
            branch: this.branch,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Upload failed: ${error.message}`);
      }

      const result = await response.json();
      
      return {
        id: result.content.sha,
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        download_url: result.content.download_url,
        sha: result.content.sha,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Get list of uploaded files
  async getFiles(): Promise<GitHubFile[]> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/uploads?ref=${this.branch}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // uploads folder doesn't exist yet
          return [];
        }
        throw new Error(`Failed to fetch files: ${response.status}`);
      }

      const files = await response.json();
      
      if (!Array.isArray(files)) {
        return [];
      }

      return files.map((file: any) => ({
        id: file.sha,
        name: file.name.replace(/^\d+-/, ''), // Remove timestamp prefix
        size: file.size,
        type: this.getFileType(file.name),
        uploaded_at: new Date().toISOString(), // GitHub doesn't provide upload time easily
        download_url: file.download_url,
        sha: file.sha,
      }));
    } catch (error) {
      console.error('Fetch files error:', error);
      throw error;
    }
  }

  // Download file content
  async downloadFile(file: GitHubFile): Promise<Blob> {
    try {
      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // Get file content as text (for preview)
  async getFileContent(file: GitHubFile): Promise<string | null> {
    try {
      if (!this.isTextFile(file.name)) {
        return null;
      }

      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Get content error:', error);
      return null;
    }
  }

  // Delete file
  async deleteFile(file: GitHubFile): Promise<void> {
    try {
      const fileName = `uploads/${file.id}-${file.name}`;
      
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${fileName}`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
          body: JSON.stringify({
            message: `Delete ${file.name}`,
            sha: file.sha,
            branch: this.branch,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  private getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const typeMap: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'jsx': 'text/javascript',
      'tsx': 'text/typescript',
      'py': 'text/python',
      'java': 'text/java',
      'cpp': 'text/cpp',
      'c': 'text/c',
      'html': 'text/html',
      'css': 'text/css',
      'json': 'application/json',
      'xml': 'text/xml',
      'csv': 'text/csv',
    };
    return typeMap[ext] || 'application/octet-stream';
  }

  private isTextFile(fileName: string): boolean {
    const textExtensions = [
      'txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 
      'cpp', 'c', 'html', 'css', 'json', 'xml', 'csv'
    ];
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return textExtensions.includes(ext);
  }
}

export const githubStorage = new GitHubStorage();