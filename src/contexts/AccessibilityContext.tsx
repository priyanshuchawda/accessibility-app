import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AccessibilityContextType {
  isDarkMode: boolean;
  fontSize: number;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  toggleDarkMode: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const handleColorSchemeChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setIsDarkMode(e.matches);
  }, []);

  useEffect(() => {
    try {
      const darkModeMediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
      
      // Set initial value
      if (darkModeMediaQuery) {
        setIsDarkMode(darkModeMediaQuery.matches);
      }

      // Add event listener if supported
      if (darkModeMediaQuery?.addEventListener) {
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
        return () => darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange);
      } else if (darkModeMediaQuery?.addListener) {
        // Fallback for older browsers
        darkModeMediaQuery.addListener(handleColorSchemeChange);
        return () => darkModeMediaQuery.removeListener(handleColorSchemeChange);
      }
    } catch (error) {
      console.warn('Error setting up dark mode detection:', error);
    }
  }, [handleColorSchemeChange]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const toggleReducedMotion = () => setIsReducedMotion(prev => !prev);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    document.documentElement.classList.toggle('reduced-motion', isReducedMotion);

    return () => {
      document.documentElement.style.fontSize = '';
      document.documentElement.classList.remove('dark-mode', 'high-contrast', 'reduced-motion');
    };
  }, [fontSize, isDarkMode, isHighContrast, isReducedMotion]);

  const value = {
    isDarkMode,
    fontSize,
    isHighContrast,
    isReducedMotion,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleReducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
