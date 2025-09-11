import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { FilePreview } from './components/FilePreview';
import { UploadedFile } from './types/file';
import { Lock, HardDrive } from 'lucide-react';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Ab@24401';

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('fileupload_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('fileupload_auth', 'authenticated');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fileupload_auth');
    setPassword('');
    setFiles([]);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      // Simulate upload - create file object
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString(),
        file_path: URL.createObjectURL(file), // Store as blob URL for demo
      };
      
      // Add to files list
      setFiles(prev => [newFile, ...prev]);
      
      // Store in localStorage for persistence
      const allFiles = [newFile, ...files];
      localStorage.setItem('uploaded_files', JSON.stringify(allFiles));
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (file: UploadedFile) => {
    setPreviewFile(file);
    setFileContent(null);

    // Check if it's a text file or code file
    const isTextFile = file.type.startsWith('text/') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.js') || 
        file.name.endsWith('.ts') || 
        file.name.endsWith('.jsx') || 
        file.name.endsWith('.tsx') || 
        file.name.endsWith('.py') || 
        file.name.endsWith('.java') || 
        file.name.endsWith('.cpp') || 
        file.name.endsWith('.c') || 
        file.name.endsWith('.h') || 
        file.name.endsWith('.html') || 
        file.name.endsWith('.css') || 
        file.name.endsWith('.json') || 
        file.name.endsWith('.xml') || 
        file.name.endsWith('.csv') || 
        file.name.endsWith('.yaml') || 
        file.name.endsWith('.yml') || 
        file.name.endsWith('.sql') || 
        file.name.endsWith('.php') || 
        file.name.endsWith('.rb') || 
        file.name.endsWith('.go') || 
        file.name.endsWith('.rs') || 
        file.name.endsWith('.swift') || 
        file.name.endsWith('.kt');
    
    if (isTextFile) {
      try {
        // For demo, try to fetch content from blob URL
        if (file.file_path?.startsWith('blob:')) {
          const response = await fetch(file.file_path);
          const content = await response.text();
          setFileContent(content);
        }
      } catch (error) {
        console.error('Error loading file content:', error);
      }
    }
  };

  const handleDownload = (file: UploadedFile) => {
    try {
      if (file.file_path?.startsWith('blob:')) {
        // For demo files stored as blob URLs
        const a = document.createElement('a');
        a.href = file.file_path;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Download functionality will be available when deployed with GitHub LFS');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDelete = (file: UploadedFile) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${file.name}"?`);
    
    if (!isConfirmed) {
      return;
    }

    try {
      // Remove from files array
      const updatedFiles = files.filter(f => f.id !== file.id);
      setFiles(updatedFiles);
      
      // Update localStorage
      localStorage.setItem('uploaded_files', JSON.stringify(updatedFiles));
      
      // Revoke blob URL to free memory
      if (file.file_path?.startsWith('blob:')) {
        URL.revokeObjectURL(file.file_path);
      }
      
      // Close preview if the deleted file is currently being previewed
      if (previewFile && previewFile.id === file.id) {
        setPreviewFile(null);
        setFileContent(null);
      }
      
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  // Load files from localStorage on authentication
  useEffect(() => {
    if (isAuthenticated) {
      const savedFiles = localStorage.getItem('uploaded_files');
      if (savedFiles) {
        try {
          setFiles(JSON.parse(savedFiles));
        } catch (error) {
          console.error('Error loading saved files:', error);
        }
      }
    }
  }, [isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors flex items-center justify-center">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-black dark:text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Access Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter password to access your file storage
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              required
            />
            
            {passwordError && (
              <p className="text-red-500 text-sm text-center">{passwordError}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Access Files
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="flex justify-between items-center p-4">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white transition-colors text-black dark:text-white"
        >
          Logout
        </button>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HardDrive className="w-8 h-8 text-black dark:text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            File Storage
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload, store, and access your files across devices
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Demo mode - Files stored locally (GitHub LFS integration ready for deployment)
          </p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploading={uploading} />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading files...</p>
          </div>
        ) : (
          <FileList 
            files={files} 
            onPreview={handlePreview} 
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        )}
      </div>

      <FilePreview 
        file={previewFile} 
        onClose={() => setPreviewFile(null)} 
        fileContent={fileContent}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;