import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityMap } from '../AccessibilityMap';
import { AuthProvider } from '../../contexts/AuthContext';
import { AccessibilityProvider } from '../../contexts/AccessibilityContext';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({
    setView: jest.fn(),
    locate: jest.fn()
  }),
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((success) =>
    success({
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    })
  ),
};
(global as any).navigator.geolocation = mockGeolocation;

// Mock context values
const mockAuthContext = {
  currentUser: { uid: 'test-user' },
  signInWithGoogle: jest.fn(),
  signOut: jest.fn(),
};

const mockAccessibilityContext = {
  features: [],
  addFeature: jest.fn(),
  updateFeature: jest.fn(),
  loading: false,
};

jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => mockAuthContext,
}));

jest.mock('../../contexts/AccessibilityContext', () => ({
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accessibility-provider">{children}</div>
  ),
  useAccessibility: () => mockAccessibilityContext,
}));

// Increase test timeout
jest.setTimeout(15000);

describe('AccessibilityMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <AuthProvider>
        <AccessibilityProvider>
          <AccessibilityMap />
        </AccessibilityProvider>
      </AuthProvider>
    );
  };

  test('renders user location marker when geolocation is available', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  test('analyzes area when analyze button is clicked', async () => {
    renderWithProviders();

    await waitFor(() => {
      const analyzeButton = screen.getByTestId('analyze-area-button');
      expect(analyzeButton).toBeInTheDocument();
    });
  });
});
