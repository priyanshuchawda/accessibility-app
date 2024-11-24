// Import canvas mock first
import 'jest-canvas-mock';

// Import jest-dom
import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(callback => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(),
  marker: jest.fn(),
  tileLayer: jest.fn(),
  latLng: jest.fn(),
  point: jest.fn(),
  icon: jest.fn(),
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(),
}));

// Mock react-leaflet components
jest.mock('react-leaflet', () => {
  const mockLeaflet = jest.requireActual('react');
  
  return {
    MapContainer: jest.fn().mockImplementation(({ children, ...props }) => 
      mockLeaflet.createElement('div', { 'data-testid': 'map-container', ...props }, children)
    ),
    TileLayer: jest.fn().mockImplementation(({ ...props }) => 
      mockLeaflet.createElement('div', { 'data-testid': 'tile-layer', ...props })
    ),
    Marker: jest.fn().mockImplementation(({ children, ...props }) => 
      mockLeaflet.createElement('div', { 'data-testid': 'marker', ...props }, children)
    ),
    Popup: jest.fn().mockImplementation(({ children, ...props }) => 
      mockLeaflet.createElement('div', { 'data-testid': 'popup', ...props }, children)
    ),
    useMap: jest.fn(() => ({
      setView: jest.fn(),
      flyTo: jest.fn(),
    })),
  };
});
