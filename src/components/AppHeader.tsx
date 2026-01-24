import { HardDrive, Code2, Sun, Moon, AlertTriangle } from 'lucide-react';

interface AppHeaderProps {
  activeSection: 'files' | 'code' | 'exam';
  onSectionChange: (section: 'files' | 'code' | 'exam') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function AppHeader({ activeSection, onSectionChange, onLogout, isDarkMode, onToggleTheme }: AppHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-black dark:text-white">
          Vault
        </h1>
        <div className="flex space-x-1">
          <button
            onClick={() => onSectionChange('files')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'files'
                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Files</span>
          </button>
          <button
            onClick={() => onSectionChange('code')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'code'
                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code Editor</span>
          </button>
          <button
            onClick={() => onSectionChange('exam')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'exam'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Exam Mode</span>
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={onLogout}
          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}