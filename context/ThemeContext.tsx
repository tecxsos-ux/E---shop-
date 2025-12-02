
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
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check local storage or default to auto
    const saved = localStorage.getItem('theme') as Theme;
    if (['light', 'dark', 'classic', 'auto'].includes(saved)) return saved;
    return 'auto';
  });

  // Track the actual visual theme being applied (resolves 'auto' to 'light' or 'dark')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark' | 'classic'>('light');

  useEffect(() => {
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
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
