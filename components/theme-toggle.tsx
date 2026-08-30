'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    const shouldUseDark = savedTheme === 'dark';
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark-theme', shouldUseDark);
  }, []);
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark-theme', nextMode);
    window.localStorage.setItem('portfolio-theme', nextMode ? 'dark' : 'light');
  };
  return <button className="theme-toggle" onClick={toggleTheme} aria-label={darkMode ? '切换为浅色背景' : '切换为黑色背景'} aria-pressed={darkMode}><span>{darkMode ? 'Light' : 'Dark'}</span>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
