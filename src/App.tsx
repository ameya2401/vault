import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { FilePreview } from './components/FilePreview';
import { UploadedFile } from './types/file';
import { storageService } from './lib/storage';
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

  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Ab@supabase';

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
      // Upload to Supabase
      const uploadedFile = await storageService.uploadFile(file);
      
      // Add to files list
      setFiles(prev => [uploadedFile, ...prev]);
      
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
        // Load content from Supabase
        const content = await storageService.getFileContent(file);
        setFileContent(content);
      } catch (error) {
        console.error('Error loading file content:', error);
      }
    }
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      // Download from Supabase
      const blob = await storageService.downloadFile(file);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${file.name}"?`);
    
    if (!isConfirmed) {
      return;
    }

    try {
      // Delete from Supabase
      await storageService.deleteFile(file);
      
      // Remove from files array
      const updatedFiles = files.filter(f => f.id !== file.id);
      setFiles(updatedFiles);
      
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

  // Load files from Supabase on authentication
  useEffect(() => {
    if (isAuthenticated) {
      const loadFiles = async () => {
        try {
          setLoading(true);
          
          // Test connection first
          console.log('Testing Supabase connection...');
          const connectionOk = await storageService.testConnection();
          if (!connectionOk) {
            console.error('Supabase connection failed!');
            alert('Connection to database failed. Please check your Supabase configuration.');
            return;
          }
          
          const files = await storageService.getFiles();
          setFiles(files);
        } catch (error) {
          console.error('Error loading files:', error);
          alert('Failed to load files. Please check your Supabase setup.');
        } finally {
          setLoading(false);
        }
      };
      loadFiles();
    }
  }, [isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="absolute top-4 right-4">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
        
        <div className="vault-card w-full max-w-sm mx-4 p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-black dark:text-white" />
            </div>
            <h1 className="text-xl font-bold text-black dark:text-white mb-2">
              Vault
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enter password to access
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="vault-input text-sm"
              required
            />
            
            {passwordError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                <p className="text-red-600 dark:text-red-400 text-xs text-center">{passwordError}</p>
              </div>
            )}
            
            <button type="submit" className="vault-button w-full text-sm">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-black dark:text-white" />
          <h1 className="text-base font-bold text-black dark:text-white">
            Vault
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <button
            onClick={handleLogout}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="container mx-auto px-3 py-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white mb-1">
            File Storage
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Upload and manage your files
          </p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploading={uploading} />

        {loading ? (
          <div className="text-center py-6">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">Loading...</p>
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

      {/* Footer */}
      <footer className="mt-auto py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Vault File Storage
          </p>
        </div>
      </footer>

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