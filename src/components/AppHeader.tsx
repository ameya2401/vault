import { Sun, Moon, AlertTriangle } from 'lucide-react';

interface AppHeaderProps {
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function AppHeader({ onLogout, isDarkMode, onToggleTheme }: AppHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-semibold text-black dark:text-white">
          Vault
        </h1>
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Exam Mode</span>
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
        {/* <button
          onClick={onLogout}
          className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}