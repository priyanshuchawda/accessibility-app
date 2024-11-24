import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from './App';

// Mock the router components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  RouterProvider: () => (
    <div>
      <div data-testid="mock-navigation">Navigation</div>
      <div data-testid="mock-accessibility-panel">Accessibility Panel</div>
    </div>
  )
}));

// Mock the context providers
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('./contexts/AccessibilityContext', () => ({
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('./contexts/ChatContext', () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('App Component', () => {
  const renderWithProviders = () => {
    return render(<App />);
  };

  test('renders app navigation', () => {
    act(() => {
      renderWithProviders();
    });
    const navElement = screen.getByTestId('mock-navigation');
    expect(navElement).toBeInTheDocument();
  });

  test('renders accessibility panel', () => {
    act(() => {
      renderWithProviders();
    });
    const settingsElement = screen.getByTestId('mock-accessibility-panel');
    expect(settingsElement).toBeInTheDocument();
  });
});
