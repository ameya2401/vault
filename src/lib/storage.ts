// Storage abstraction layer to support both Supabase and GitHub
import { supabase } from './supabase';
import { githubStorage, GitHubFile } from './github';
import { UploadedFile } from '../types/file';

type StorageProvider = 'supabase' | 'github';

class StorageService {
  private provider: StorageProvider;

  constructor() {
    this.provider = (import.meta.env.VITE_STORAGE_PROVIDER as StorageProvider) || 'github';
  }

  async uploadFile(file: File): Promise<UploadedFile> {
    if (this.provider === 'github') {
      const githubFile = await githubStorage.uploadFile(file);
      return this.convertGitHubFile(githubFile);
    } else {
      // Supabase implementation
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('files')
        .insert([{
          name: file.name,
          size: file.size,
          type: file.type,
          file_path: filePath,
        }]);

      if (dbError) {
        throw dbError;
      }

      // Return uploaded file info
      return {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        file_path: filePath,
      };
    }
  }

  async getFiles(): Promise<UploadedFile[]> {
    if (this.provider === 'github') {
      const githubFiles = await githubStorage.getFiles();
      return githubFiles.map(file => this.convertGitHubFile(file));
    } else {
      // Supabase implementation
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    }
  }

  async downloadFile(file: UploadedFile): Promise<Blob> {
    if (this.provider === 'github') {
      const githubFile = this.convertToGitHubFile(file);
      return await githubStorage.downloadFile(githubFile);
    } else {
      // Supabase implementation
      const { data, error } = await supabase.storage
        .from('user-files')
        .download(file.file_path!);

      if (error) {
        throw error;
      }

      return data;
    }
  }

  async getFileContent(file: UploadedFile): Promise<string | null> {
    if (this.provider === 'github') {
      const githubFile = this.convertToGitHubFile(file);
      return await githubStorage.getFileContent(githubFile);
    } else {
      // Supabase implementation
      try {
        const blob = await this.downloadFile(file);
        return await blob.text();
      } catch (error) {
        console.error('Error loading file content:', error);
        return null;
      }
    }
  }

  async deleteFile(file: UploadedFile): Promise<void> {
    if (this.provider === 'github') {
      const githubFile = this.convertToGitHubFile(file);
      await githubStorage.deleteFile(githubFile);
    } else {
      // Supabase implementation
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([file.file_path!]);

      if (storageError) {
        throw storageError;
      }

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        throw dbError;
      }
    }
  }

  getProvider(): StorageProvider {
    return this.provider;
  }

  private convertGitHubFile(githubFile: GitHubFile): UploadedFile {
    return {
      id: githubFile.id,
      name: githubFile.name,
      size: githubFile.size,
      type: githubFile.type,
      uploaded_at: githubFile.uploaded_at,
      download_url: githubFile.download_url,
      sha: githubFile.sha,
    };
  }

  private convertToGitHubFile(file: UploadedFile): GitHubFile {
    return {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded_at: file.uploaded_at,
      download_url: file.download_url!,
      sha: file.sha!,
    };
  }
}

export const storageService = new StorageService();