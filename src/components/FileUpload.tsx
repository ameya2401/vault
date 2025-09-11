import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // File size limit: 10MB (adjust as needed)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      if (file.size > maxSize) {
        alert('File size must be less than 10MB. Please choose a smaller file.');
        return;
      }
      
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File size limit: 10MB (adjust as needed)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      if (file.size > maxSize) {
        alert('File size must be less than 10MB. Please choose a smaller file.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-900'
            : 'border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white'
        } ${uploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {uploading ? (
              <div className="animate-spin w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full"></div>
            ) : (
              <Upload className="w-8 h-8 text-black dark:text-white" />
            )}
          </div>
          <p className="text-black dark:text-white font-medium mb-2">
            {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Support for PDFs, text files, notes, and code (Max 10MB per file)
          </p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            disabled={uploading}
            accept=".pdf,.txt,.md,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.xml,.csv"
          />
        </div>
      </div>
    </div>
  );
};