import { supabase } from './supabase';
import { UploadedFile } from '../types/file';

class SupabaseStorageService {
  private bucketName = 'files';
  private tableName = 'files';

  async uploadFile(file: File): Promise<UploadedFile> {
    try {
      console.log('Uploading file to Supabase:', file.name);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Bucket name:', this.bucketName);
      
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `uploads/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}. Details: ${JSON.stringify(uploadError)}`);
      }

      console.log('File uploaded successfully to storage');

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      // Create file metadata for database
      const fileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        file_path: filePath,
        uploaded_at: new Date().toISOString()
      };

      // Save metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from(this.tableName)
        .insert(fileMetadata)
        .select()
        .single();

      if (dbError) {
        console.error('Database error details:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from(this.bucketName).remove([filePath]);
        throw new Error(`Database error: ${dbError.message}. Details: ${JSON.stringify(dbError)}`);
      }

      const uploadedFile: UploadedFile = {
        id: dbData.id.toString(),
        name: dbData.name,
        size: dbData.size,
        type: dbData.type,
        uploaded_at: dbData.uploaded_at,
        file_path: dbData.file_path,
        download_url: urlData.publicUrl
      };

      console.log('File metadata saved to database:', uploadedFile);
      return uploadedFile;

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFiles(): Promise<UploadedFile[]> {
    try {
      console.log('Loading files from Supabase...');
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load files: ${error.message}`);
      }

      const files: UploadedFile[] = data.map(file => {
        // Get public URL for each file
        const { data: urlData } = supabase.storage
          .from(this.bucketName)
          .getPublicUrl(file.file_path);

        return {
          id: file.id.toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded_at: file.uploaded_at,
          file_path: file.file_path,
          download_url: urlData.publicUrl
        };
      });

      console.log(`Loaded ${files.length} files from Supabase`);
      return files;

    } catch (error) {
      console.error('Error loading files:', error);
      throw error;
    }
  }

  async downloadFile(file: UploadedFile): Promise<Blob> {
    try {
      console.log('Downloading file from Supabase:', file.name);
      
      if (!file.file_path) {
        throw new Error('File path not found');
      }

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .download(file.file_path);

      if (error) {
        throw new Error(`Download failed: ${error.message}`);
      }

      console.log('File downloaded successfully');
      return data;

    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getFileContent(file: UploadedFile): Promise<string | null> {
    try {
      console.log('Getting file content from Supabase:', file.name);
      
      // Check if file is a text file
      const isTextFile = file.type.startsWith('text/') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.json') || 
        file.name.endsWith('.js') || 
        file.name.endsWith('.ts') || 
        file.name.endsWith('.tsx') || 
        file.name.endsWith('.jsx') || 
        file.name.endsWith('.css') || 
        file.name.endsWith('.html') || 
        file.name.endsWith('.xml') || 
        file.name.endsWith('.py') || 
        file.name.endsWith('.java') || 
        file.name.endsWith('.cpp') || 
        file.name.endsWith('.c') || 
        file.name.endsWith('.h') || 
        file.name.endsWith('.cs') || 
        file.name.endsWith('.php') || 
        file.name.endsWith('.rb') || 
        file.name.endsWith('.go') || 
        file.name.endsWith('.rs') || 
        file.name.endsWith('.swift') || 
        file.name.endsWith('.kt');

      if (!isTextFile) {
        return null;
      }

      const blob = await this.downloadFile(file);
      const text = await blob.text();
      return text;

    } catch (error) {
      console.error('Error getting file content:', error);
      return null;
    }
  }

  async deleteFile(file: UploadedFile): Promise<void> {
    try {
      console.log('Deleting file from Supabase:', file.name);
      
      if (!file.file_path) {
        throw new Error('File path not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.bucketName)
        .remove([file.file_path]);

      if (storageError) {
        console.warn('Storage deletion warning:', storageError.message);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', parseInt(file.id));

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

      console.log('File deleted successfully');

    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Test the storage connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Supabase storage connection...');
      
      // Test database connection
      const { error } = await supabase.from(this.tableName).select('count').limit(1);
      
      if (error) {
        console.error('Database connection failed:', error);
        return false;
      }

      // Test storage bucket access
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('Storage bucket access failed:', bucketError);
        return false;
      }

      console.log('Supabase storage connection successful');
      return true;

    } catch (error) {
      console.error('Supabase storage connection test failed:', error);
      return false;
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();