import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isDark 
          ? 'bg-primary-600' 
          : 'bg-gray-200 dark:bg-gray-700'
      } ${className}`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <MoonIcon className="h-4 w-4 text-primary-600" />
          ) : (
            <SunIcon className="h-4 w-4 text-yellow-500" />
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
