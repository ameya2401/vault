import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { FilePreview } from './components/FilePreview';
import { UploadedFile } from './types/file';
import { storageService } from './lib/storage';
import { Lock } from 'lucide-react';
import AppHeader from './components/AppHeader';
import { ExamModeView } from './temporary-exam-feature/ExamModeView';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Password protection enabled
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Ab@supabase';

  // Add a simple override for testing
  const TEST_PASSWORD = 'test123'; // Temporary override for testing

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('fileupload_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }

    // Debug logging
    console.log('Environment password:', import.meta.env.VITE_APP_PASSWORD);
    console.log('Correct password:', CORRECT_PASSWORD);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Comparing passwords:');
    console.log('User entered:', password);
    console.log('Expected:', CORRECT_PASSWORD);
    console.log('Match:', password === CORRECT_PASSWORD);
    console.log('Test password match:', password === TEST_PASSWORD);

    // For testing, let's also accept the test password
    if (password === CORRECT_PASSWORD || password === TEST_PASSWORD) {
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
      <AppHeader
        onLogout={handleLogout}
        isDarkMode={isDark}
        onToggleTheme={toggleTheme}
      />

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <div className="w-full">
          <ExamModeView
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
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