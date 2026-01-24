// Storage abstraction layer using Supabase
import { supabaseStorageService } from './supabaseStorage';
import { UploadedFile } from '../types/file';

class StorageService {
  async uploadFile(file: File, folder: string = 'uploads'): Promise<UploadedFile> {
    return await supabaseStorageService.uploadFile(file, folder);
  }

  async getFiles(folderFilter: string = 'uploads'): Promise<UploadedFile[]> {
    return await supabaseStorageService.getFiles(folderFilter);
  }

  async downloadFile(file: UploadedFile): Promise<Blob> {
    return await supabaseStorageService.downloadFile(file);
  }

  async getFileContent(file: UploadedFile): Promise<string | null> {
    return await supabaseStorageService.getFileContent(file);
  }

  async deleteFile(file: UploadedFile): Promise<void> {
    return await supabaseStorageService.deleteFile(file);
  }

  async testConnection(): Promise<boolean> {
    return await supabaseStorageService.testConnection();
  }
}

export const storageService = new StorageService();