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
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getFileIcon = (file: UploadedFile) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return <Image className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />;
  } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
    return <Video className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />;
  } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
    return <Music className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />;
  } else if (['txt', 'md', 'pdf', 'doc', 'docx'].includes(extension || '')) {
    return <FileText className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />;
  } else {
    return <File className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />;
  }
};

const getFileTypeLabel = (file: UploadedFile): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension?.toUpperCase() || 'FILE';
};

export const FileList: React.FC<FileListProps> = ({ files, onPreview, onDownload, onDelete }) => {
  if (files.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 flex flex-col items-center justify-center text-center opacity-60">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-3">
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          Folder is empty
        </h3>
        <p className="text-xs text-gray-500">
          Drop files above to begin
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Name
        </h3>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 pr-14">
          Details
        </h3>
      </div>
      
      <div className="space-y-1">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
          >
            {/* Left side: Icon + Name */}
            <div className="flex items-center space-x-4 min-w-0 flex-1 cursor-pointer" onClick={() => onPreview(file)}>
              <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                {getFileIcon(file)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white truncate transition-colors">
                  {file.name}
                </p>
              </div>
            </div>
            
            {/* Right side: Metadata -> Actions (Swap on hover) */}
            <div className="flex items-center relative pl-4">
              
              {/* Metadata (Visible by default, fades out on hover) */}
              <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-gray-500 transition-opacity duration-200 group-hover:opacity-0 group-hover:pointer-events-none absolute right-0 pr-2 whitespace-nowrap">
                <span>{getFileTypeLabel(file)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span>{formatFileSize(file.size)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 hidden sm:inline-block"></span>
                <span className="hidden sm:inline-block">{formatDate(file.uploaded_at)}</span>
              </div>
              
              {/* Actions (Hidden by default, fades in on hover) */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0 relative z-10 bg-gray-50 dark:bg-[#1a1a1a] shadow-[-12px_0_10px_rgba(249,250,251,1)] dark:shadow-[-12px_0_10px_rgba(26,26,26,1)] pl-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(file); }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};