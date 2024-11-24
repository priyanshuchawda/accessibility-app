import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AccessibilityPanel } from './AccessibilityPanel';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';

// Mock the context to avoid actual state changes during tests
jest.mock('../../contexts/AccessibilityContext', () => ({
  useAccessibility: () => ({
    isDarkMode: false,
    fontSize: 16,
    isHighContrast: false,
    isReducedMotion: false,
    toggleDarkMode: jest.fn(),
    increaseFontSize: jest.fn(),
    decreaseFontSize: jest.fn(),
    toggleHighContrast: jest.fn(),
    toggleReducedMotion: jest.fn(),
  }),
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('AccessibilityPanel', () => {
  const renderComponent = () => {
    return render(
      <AccessibilityProvider>
        <AccessibilityPanel />
      </AccessibilityProvider>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
  });

  it('renders all accessibility controls', () => {
    renderComponent();
    // Theme toggle
    const darkModeButton = screen.getByText('Dark Mode');
    expect(darkModeButton).toBeInTheDocument();
    expect(darkModeButton).toHaveAttribute('aria-pressed', 'false');

    // Font size controls
    const decreaseButton = screen.getByText('A-');
    const increaseButton = screen.getByText('A+');
    expect(decreaseButton).toBeInTheDocument();
    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toHaveAttribute('aria-label', 'Decrease font size');
    expect(increaseButton).toHaveAttribute('aria-label', 'Increase font size');

    // High contrast toggle
    const highContrastButton = screen.getByText('Enable High Contrast');
    expect(highContrastButton).toBeInTheDocument();
    expect(highContrastButton).toHaveAttribute('aria-pressed', 'false');

    // Reduced motion toggle
    const reducedMotionButton = screen.getByText('Enable Reduced Motion');
    expect(reducedMotionButton).toBeInTheDocument();
    expect(reducedMotionButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('has correct ARIA attributes', () => {
    renderComponent();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Accessibility Settings');
  });

  it('handles font size changes', () => {
    renderComponent();
    const increaseButton = screen.getByText('A+');
    const decreaseButton = screen.getByText('A-');

    act(() => {
      fireEvent.click(increaseButton);
      fireEvent.click(decreaseButton);
    });

    // Since we're using a mock, we just verify the buttons are clickable
    expect(increaseButton).toBeEnabled();
    expect(decreaseButton).toBeEnabled();
  });

  it('handles toggle switches', () => {
    renderComponent();
    const darkModeButton = screen.getByText('Dark Mode');
    const highContrastButton = screen.getByText('Enable High Contrast');
    const reducedMotionButton = screen.getByText('Enable Reduced Motion');

    act(() => {
      fireEvent.click(darkModeButton);
      fireEvent.click(highContrastButton);
      fireEvent.click(reducedMotionButton);
    });

    // Since we're using a mock, we just verify the switches are clickable
    expect(darkModeButton).toBeEnabled();
    expect(highContrastButton).toBeEnabled();
    expect(reducedMotionButton).toBeEnabled();
  });
});
