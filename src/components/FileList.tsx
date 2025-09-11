import React from 'react';
import { Download, FileText, Eye, Image, Video, Music, File, Trash2 } from 'lucide-react';
import { UploadedFile } from '../types/file';

interface FileListProps {
  files: UploadedFile[];
  onPreview: (file: UploadedFile) => void;
  onDownload: (file: UploadedFile) => void;
  onDelete: (file: UploadedFile) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onPreview, onDownload, onDelete }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (file: UploadedFile) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    if (file.type.startsWith('image/')) {
      return <Image className={`${iconClass} text-green-600 dark:text-green-400`} />;
    }
    if (file.type.startsWith('video/')) {
      return <Video className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
    }
    if (file.type.startsWith('audio/')) {
      return <Music className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
    }
    if (file.type.startsWith('text/') || isCodeFile(file.name)) {
      return <FileText className={`${iconClass} text-orange-600 dark:text-orange-400`} />;
    }
    if (file.type === 'application/pdf') {
      return <File className={`${iconClass} text-red-600 dark:text-red-400`} />;
    }
    return <File className={`${iconClass} text-gray-600 dark:text-gray-400`} />;
  };

  const isCodeFile = (filename: string) => {
    const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.css', '.html', '.xml', '.json', '.yaml', '.yml', '.md', '.sql', '.php', '.rb', '.go', '.rs', '.swift', '.kt'];
    return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const getFileTypeLabel = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type.startsWith('audio/')) return 'Audio';
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type.startsWith('text/') || isCodeFile(file.name)) return 'Text/Code';
    return file.type || 'Unknown';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-black dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getFileTypeLabel(file)} • {formatFileSize(file.size)} • {formatDate(file.uploaded_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onPreview(file)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white transition-colors"
                title="Preview file"
              >
                <Eye className="w-4 h-4 text-black dark:text-white" />
              </button>
              <button
                onClick={() => onDownload(file)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4 text-black dark:text-white" />
              </button>
              <button
                onClick={() => onDelete(file)}
                className="p-2 border border-red-300 dark:border-red-600 rounded hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};