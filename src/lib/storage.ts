// Storage abstraction layer to support both Supabase and GitHub
import { supabase } from './supabase';
import { UploadedFile } from '../types/file';

class StorageService {
  async uploadFile(file: File): Promise<UploadedFile> {
    try {
      // Supabase implementation
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `files/${fileName}`;

      console.log('Uploading file to Supabase:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const fileRecord = {
        name: file.name,
        size: file.size,
        type: file.type,
        file_path: filePath,
        uploaded_at: new Date().toISOString(),
      };

      const { data: dbData, error: dbError } = await supabase
        .from('files')
        .insert([fileRecord])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to clean up uploaded file
        await supabase.storage.from('user-files').remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('File uploaded successfully:', dbData);

      // Return uploaded file info
      return {
        id: dbData.id.toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        file_path: filePath,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
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