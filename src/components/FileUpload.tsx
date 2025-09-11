import React, { useCallback, useState } from 'react';
import { Upload, FileText, Shield } from 'lucide-react';

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
    <div className="w-full max-w-sm mx-auto mb-6">
      <div
        className={`vault-upload-area relative p-4 transition-colors ${
          dragActive
            ? 'border-black dark:border-white'
            : ''
        } ${uploading ? 'opacity-70' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-6 h-6 text-black dark:text-white" />
            )}
          </div>
          <h3 className="text-sm font-medium text-black dark:text-white mb-1">
            {uploading ? 'Uploading...' : 'Drop files here'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            or <span className="text-black dark:text-white font-medium">click to browse</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Max 10MB
          </p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileSelect}
            disabled={uploading}
            accept=".pdf,.txt,.md,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.xml,.csv,.png,.jpg,.jpeg,.gif,.mp4,.mov,.mp3,.wav"
          />
        </div>
      </div>
    </div>
  );
};