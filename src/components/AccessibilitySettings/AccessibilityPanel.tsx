import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export const AccessibilityPanel: React.FC = () => {
  const {
    isDarkMode,
    fontSize,
    isHighContrast,
    isReducedMotion,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleReducedMotion
  } = useAccessibility();

  return (
    <div className="accessibility-panel" role="dialog" aria-label="Accessibility Settings">
      <h2>Accessibility Settings</h2>
      
      <div className="setting-group">
        <h3>Theme</h3>
        <button 
          onClick={toggleDarkMode}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="setting-group">
        <h3>Font Size (Current: {fontSize}px)</h3>
        <div className="button-group">
          <button 
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <button 
            onClick={increaseFontSize}
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      <div className="setting-group">
        <h3>High Contrast</h3>
        <button 
          onClick={toggleHighContrast}
          aria-pressed={isHighContrast}
        >
          {isHighContrast ? 'Disable' : 'Enable'} High Contrast
        </button>
      </div>

      <div className="setting-group">
        <h3>Reduced Motion</h3>
        <button 
          onClick={toggleReducedMotion}
          aria-pressed={isReducedMotion}
        >
          {isReducedMotion ? 'Disable' : 'Enable'} Reduced Motion
        </button>
      </div>
    </div>
  );
};
