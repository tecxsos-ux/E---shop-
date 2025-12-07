'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'classic' | 'auto';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark' | 'classic';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
    theme: 'auto', 
    effectiveTheme: 'light',
    setTheme: () => {} 
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with 'auto' to ensure server and client match initially (hydration)
  const [theme, setThemeState] = useState<Theme>('auto');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark' | 'classic'>('light');
  const [mounted, setMounted] = useState(false);

  // Once mounted on client, check local storage
  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : null;
    if (saved && ['light', 'dark', 'classic', 'auto'].includes(saved)) {
        setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const getVisualTheme = () => {
        if (theme === 'auto') {
            return mediaQuery.matches ? 'dark' : 'light';
        }
        return theme;
    };

    const applyTheme = () => {
        const visualTheme = getVisualTheme();
        setEffectiveTheme(visualTheme);

        // Clean up classes
        root.classList.remove('dark', 'classic');
        
        // Apply new theme class
        if (visualTheme === 'dark') {
            root.classList.add('dark');
        } else if (visualTheme === 'classic') {
            root.classList.add('classic');
        }
    };

    applyTheme();

    // Listener for system theme changes when in Auto mode
    const handleChange = () => {
        if (theme === 'auto') applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Prevent hydration mismatch by rendering nothing until mounted, 
  // or render children with default theme. Rendering children is better for SEO.
  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);