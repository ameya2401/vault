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
      
      const maxSize = 10 * 1024 * 1024; // 10MB
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
      
      e.target.value = ''; // clear input
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB. Please choose a smaller file.');
        return;
      }
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div
        className={`relative overflow-hidden transition-all duration-300 rounded-2xl border ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
            : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#1a1a1a] hover:bg-gray-100/50 dark:hover:bg-[#252525]'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="py-10 px-6 text-center flex flex-col items-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${dragActive ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-[#2d2d2d] text-gray-400 dark:text-gray-500 shadow-sm border border-gray-100 dark:border-white/5'}`}>
            {uploading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {uploading ? 'Uploading securely...' : 'Click or drag file to this area to upload'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
            Support for single file upload. Maximum file size is strictly limited to 10MB.
          </p>
          
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-white/5 shadow-sm rounded-md text-[10px] uppercase font-bold tracking-wider text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Secure Transfer</span>
          </div>

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