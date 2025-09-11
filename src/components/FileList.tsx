import React from 'react';
import { Eye, Download, Trash2, FileText, Image, File, Video, Music } from 'lucide-react';
import { UploadedFile } from '../types/file';

interface FileListProps {
  files: UploadedFile[];
  onPreview: (file: UploadedFile) => void;
  onDownload: (file: UploadedFile) => void;
  onDelete: (file: UploadedFile) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getFileIcon = (file: UploadedFile) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return <Image className="w-6 h-6 text-blue-500" />;
  } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
    return <Video className="w-6 h-6 text-purple-500" />;
  } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return <Music className="w-6 h-6 text-green-500" />;
  } else if (['txt', 'md', 'pdf', 'doc', 'docx'].includes(extension || '')) {
    return <FileText className="w-6 h-6 text-orange-500" />;
  } else {
    return <File className="w-6 h-6 text-gray-500" />;
  }
};

const getFileTypeLabel = (file: UploadedFile): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension?.toUpperCase() || 'FILE';
};

export const FileList: React.FC<FileListProps> = ({ files, onPreview, onDownload, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="vault-card max-w-sm mx-auto text-center py-8 px-6">
        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-1">
          No files yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Upload your first file
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-black dark:text-white mb-1">
          Files ({files.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="vault-file-item">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black dark:text-white truncate text-sm">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{getFileTypeLabel(file)}</span>
                    <span>•</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.uploaded_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-3">
                <button
                  onClick={() => onPreview(file)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-3 h-3 text-black dark:text-white" />
                </button>
                <button
                  onClick={() => onDownload(file)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Download"
                >
                  <Download className="w-3 h-3 text-black dark:text-white" />
                </button>
                <button
                  onClick={() => onDelete(file)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};