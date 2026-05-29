import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex items-center gap-2">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`w-13 h-7.5 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${
          darkMode ? 'bg-[var(--accent)]' : 'bg-[#E9E9EB]'
        }`}
        aria-label="Toggle Theme"
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5.5 h-5.5 rounded-full bg-white shadow flex items-center justify-center"
        >
          {darkMode ? (
            <Moon className="w-3 h-3 text-[var(--accent)]" />
          ) : (
            <Sun className="w-3 h-3 text-[#8E8E93]" />
          )}
        </motion.div>
      </button>
    </div>
  );
}
