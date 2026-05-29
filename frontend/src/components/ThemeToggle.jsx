import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#212121] border border-[#303030] text-[#AAAAAA] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 btn-premium"
      aria-label="Toggle Theme"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-[#FF0000] animate-pulse-slow" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
}
