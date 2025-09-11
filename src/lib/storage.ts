// Storage abstraction layer to support both Supabase and GitHub
import { supabase } from './supabase';
import { UploadedFile } from '../types/file';

class StorageService {
  async uploadFile(file: File): Promise<UploadedFile> {
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

  async getFiles(): Promise<UploadedFile[]> {
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

  async downloadFile(file: UploadedFile): Promise<Blob> {
    // Supabase implementation
    const { data, error } = await supabase.storage
      .from('user-files')
      .download(file.file_path!);

    if (error) {
      throw error;
    }

    return data;
  }

  async getFileContent(file: UploadedFile): Promise<string | null> {
    // Supabase implementation
    try {
      const blob = await this.downloadFile(file);
      return await blob.text();
    } catch (error) {
      console.error('Error loading file content:', error);
      return null;
    }
  }

  async deleteFile(file: UploadedFile): Promise<void> {
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

export const storageService = new StorageService();