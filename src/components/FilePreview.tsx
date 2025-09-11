import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, FileText, Image, Video, Music, File, Trash2 } from 'lucide-react';
import { UploadedFile } from '../types/file';

interface FilePreviewProps {
  file: UploadedFile | null;
  onClose: () => void;
  fileContent: string | null;
  onDownload?: (file: UploadedFile) => void;
  onDelete?: (file: UploadedFile) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose, fileContent, onDownload, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    setImageError(false);
    setPdfError(false);
  }, [file]);

  const handleCopy = async () => {
    if (fileContent) {
      try {
        await navigator.clipboard.writeText(fileContent);
        setCopied(true);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleDownload = () => {
    if (file && onDownload) {
      onDownload(file);
    }
  };

  const handleDelete = () => {
    if (file && onDelete) {
      onDelete(file);
    }
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (file.type.startsWith('text/') || isCodeFile(file.name)) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const isCodeFile = (filename: string) => {
    const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.css', '.html', '.xml', '.json', '.yaml', '.yml', '.md', '.sql', '.php', '.rb', '.go', '.rs', '.swift', '.kt'];
    return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.toLowerCase();
    if (ext.endsWith('.js') || ext.endsWith('.jsx')) return 'javascript';
    if (ext.endsWith('.ts') || ext.endsWith('.tsx')) return 'typescript';
    if (ext.endsWith('.py')) return 'python';
    if (ext.endsWith('.java')) return 'java';
    if (ext.endsWith('.cpp') || ext.endsWith('.c')) return 'cpp';
    if (ext.endsWith('.css')) return 'css';
    if (ext.endsWith('.html')) return 'html';
    if (ext.endsWith('.json')) return 'json';
    if (ext.endsWith('.xml')) return 'xml';
    if (ext.endsWith('.md')) return 'markdown';
    if (ext.endsWith('.sql')) return 'sql';
    if (ext.endsWith('.php')) return 'php';
    if (ext.endsWith('.rb')) return 'ruby';
    if (ext.endsWith('.go')) return 'go';
    if (ext.endsWith('.rs')) return 'rust';
    if (ext.endsWith('.swift')) return 'swift';
    if (ext.endsWith('.kt')) return 'kotlin';
    return 'text';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreviewContent = () => {
    if (!file) return null;

    // Image preview
    if (file.type.startsWith('image/') && file.file_path && !imageError) {
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={file.file_path}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain rounded border border-gray-200 dark:border-gray-700"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    // Video preview
    if (file.type.startsWith('video/') && file.file_path) {
      return (
        <div className="flex items-center justify-center p-4">
          <video
            controls
            className="max-w-full max-h-[60vh] rounded border border-gray-200 dark:border-gray-700"
            preload="metadata"
          >
            <source src={file.file_path} type={file.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio preview
    if (file.type.startsWith('audio/') && file.file_path) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              <Music className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={file.file_path} type={file.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    }

    // Text/Code preview
    if (fileContent) {
      const language = getLanguageFromExtension(file.name);
      return (
        <div className="relative">
          <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-black px-2 py-1 rounded border">
            {language}
          </div>
          <pre className="whitespace-pre-wrap text-sm text-black dark:text-white font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded border overflow-x-auto">
            {fileContent}
          </pre>
        </div>
      );
    }

    // PDF preview
    if (file.type === 'application/pdf' && file.file_path) {
      if (pdfError) {
        return (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
              PDF Preview Error
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Unable to load PDF preview. Your browser may not support embedded PDFs.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setPdfError(false)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-black dark:hover:border-white transition-colors mr-3"
              >
                <span>Try Again</span>
              </button>
              {onDownload && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="relative h-full">
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-black px-2 py-1 rounded border shadow-sm">
                PDF Document
              </span>
              <button
                onClick={() => window.open(file.file_path, '_blank')}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Open in new tab"
              >
                Open in New Tab
              </button>
            </div>
          </div>
          <iframe
            src={file.file_path}
            className="w-full h-[calc(95vh-120px)] min-h-[600px] border border-gray-200 dark:border-gray-700 rounded"
            title={`PDF Preview: ${file.name}`}
            onError={() => setPdfError(true)}
            onLoad={() => setPdfError(false)}
          >
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              Your browser does not support PDFs. 
              <button
                onClick={handleDownload}
                className="text-blue-500 hover:text-blue-600 underline ml-1"
              >
                Download the PDF
              </button>
              to view it.
            </p>
          </iframe>
        </div>
      );
    }

    // PDF fallback when no file path
    if (file.type === 'application/pdf') {
      return (
        <div className="text-center py-12">
          <File className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
            PDF Document
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            PDF file detected but preview unavailable.
          </p>
          {onDownload && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="text-center py-12">
        <File className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg">
          {file.type || 'Unknown file type'}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Preview not available for this file type
        </p>
        {onDownload && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        )}
      </div>
    );
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg max-w-5xl max-h-[95vh] w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="text-gray-500 dark:text-gray-400">
              {getFileIcon(file)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-black dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {fileContent && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-sm text-black dark:text-white">Copy</span>
                  </>
                )}
              </button>
            )}
            {onDownload && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white transition-colors"
              >
                <Download className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm text-black dark:text-white">Download</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-1 border border-red-300 dark:border-red-600 rounded hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
            >
              <X className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>
        
        <div className="overflow-auto max-h-[calc(95vh-80px)]">
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
};