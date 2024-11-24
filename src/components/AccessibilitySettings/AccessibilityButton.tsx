import React from 'react';

const AccessibilityButton: React.FC = () => {
  return (
    <button
      data-testid="accessibility-button"
      className="accessibility-button"
      aria-label="Accessibility Settings"
    >
      <span className="material-icons">settings_accessibility</span>
    </button>
  );
};

export default AccessibilityButton;
