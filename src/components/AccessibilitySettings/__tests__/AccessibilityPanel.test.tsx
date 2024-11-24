import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityPanel } from '../AccessibilityPanel';
import { AccessibilityProvider } from '../../../contexts/AccessibilityContext';
import '@testing-library/jest-dom';

// Mock accessibility context with state
const mockToggleDarkMode = jest.fn();
const mockToggleHighContrast = jest.fn();
const mockToggleReducedMotion = jest.fn();
const mockIncreaseFontSize = jest.fn();
const mockDecreaseFontSize = jest.fn();

jest.mock('../../../contexts/AccessibilityContext', () => ({
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAccessibility: () => ({
    isDarkMode: false,
    fontSize: 16,
    isHighContrast: false,
    isReducedMotion: false,
    toggleDarkMode: mockToggleDarkMode,
    increaseFontSize: mockIncreaseFontSize,
    decreaseFontSize: mockDecreaseFontSize,
    toggleHighContrast: mockToggleHighContrast,
    toggleReducedMotion: mockToggleReducedMotion,
  }),
}));

describe('AccessibilityPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = () => { 
    return render(
      <AccessibilityProvider>
        <AccessibilityPanel />
      </AccessibilityProvider>
    );
  };

  test('renders accessibility settings', () => {
    renderWithContext();
    expect(screen.getByRole('dialog', { name: /accessibility settings/i })).toBeInTheDocument();
  });

  test('renders all accessibility controls', () => {
    renderWithContext();
    // Theme button
    const darkModeButton = screen.getByText('Dark Mode');
    expect(darkModeButton).toBeInTheDocument();
    expect(darkModeButton.getAttribute('aria-pressed')).toBe('false');

    // Font size buttons
    const decreaseButton = screen.getByText('A-');
    const increaseButton = screen.getByText('A+');
    expect(decreaseButton).toBeInTheDocument();
    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton.getAttribute('aria-label')).toBe('Decrease font size');
    expect(increaseButton.getAttribute('aria-label')).toBe('Increase font size');

    // High contrast button
    const highContrastButton = screen.getByText(/Enable High Contrast/);
    expect(highContrastButton).toBeInTheDocument();
    expect(highContrastButton.getAttribute('aria-pressed')).toBe('false');

    // Reduced motion button
    const reducedMotionButton = screen.getByText(/Enable Reduced Motion/);
    expect(reducedMotionButton).toBeInTheDocument();
    expect(reducedMotionButton.getAttribute('aria-pressed')).toBe('false');
  });

  test('handles font size changes', () => {
    renderWithContext();
    const increaseButton = screen.getByText('A+');
    const decreaseButton = screen.getByText('A-');

    fireEvent.click(increaseButton);
    expect(mockIncreaseFontSize).toHaveBeenCalled();

    fireEvent.click(decreaseButton);
    expect(mockDecreaseFontSize).toHaveBeenCalled();
  });

  test('handles toggle switches', () => {
    renderWithContext();
    const darkModeButton = screen.getByText('Dark Mode');
    const highContrastButton = screen.getByText(/Enable High Contrast/);
    const reducedMotionButton = screen.getByText(/Enable Reduced Motion/);

    fireEvent.click(darkModeButton);
    expect(mockToggleDarkMode).toHaveBeenCalled();

    fireEvent.click(highContrastButton);
    expect(mockToggleHighContrast).toHaveBeenCalled();

    fireEvent.click(reducedMotionButton);
    expect(mockToggleReducedMotion).toHaveBeenCalled();
  });
});
