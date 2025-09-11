import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-black border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-black dark:text-white" />
      ) : (
        <Moon className="w-5 h-5 text-black dark:text-white" />
      )}
    </button>
  );
};