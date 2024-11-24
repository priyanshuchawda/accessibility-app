import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ChatProvider } from './contexts/ChatContext';
import { Navbar } from './components/Navbar';
import { AccessibilityPanel } from './components/AccessibilitySettings/AccessibilityPanel';
import { Home as HomePage } from './pages/Home';
import { AccessibilityMap as AccessibilityMapPage } from './pages/AccessibilityMap';
import { AIAssistant as AIAssistantPage } from './pages/AIAssistant';

const Layout = () => {
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div data-testid="mock-navigation">
        <Navbar />
      </div>
      <div className="relative">
        {/* Accessibility Controls - Always visible */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-4">
          <button
            onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Accessibility Settings"
          >
            <span role="img" aria-hidden="true">♿</span>
          </button>
          
          {showAccessibilityPanel && (
            <div className="bg-white rounded-lg shadow-lg w-80" data-testid="mock-accessibility-panel">
              <AccessibilityPanel />
            </div>
          )}
        </div>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<AccessibilityMapPage />} />
      <Route path="/assistant" element={<AIAssistantPage />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
