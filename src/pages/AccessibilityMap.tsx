import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAccessibility } from '../contexts/AccessibilityContext';
import L from 'leaflet';
import { identifyAccessibilityGaps } from '../services/mapAIService';
import { AccessibilityFeature } from '../types/accessibility';

export const AccessibilityMap = () => {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [accessibilityPoints, setAccessibilityPoints] = useState<Array<{
    position: L.LatLng;
    description: string;
  }>>([]);
  const { isDarkMode } = useAccessibility();
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = new L.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        setUserLocation(location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setUserLocation(new L.LatLng(51.505, -0.09));
      }
    );
  }, []);

  const handleAnalyzeArea = async () => {
    if (!userLocation) return;

    try {
      const mockFeature: AccessibilityFeature = {
        id: `feature-${Date.now()}`,
        type: 'ramp',
        coordinates: [userLocation.lat, userLocation.lng],
        description: 'Test feature',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'test-user',
        verified: false
      };

      const gaps = await identifyAccessibilityGaps([mockFeature]);
      const points = gaps.map(gap => ({
        position: new L.LatLng(gap.location[0], gap.location[1]),
        description: `Missing features: ${gap.missingFeatures.join(', ')}\n${gap.recommendation}`
      }));
      setAccessibilityPoints(points);
    } catch (error) {
      console.error('Error analyzing area:', error);
    }
  };

  return (
    <div className={`map-container ${isDarkMode ? 'dark' : 'light'}`} data-testid="map-page">
      <MapContainer
        center={userLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
        ref={mapRef}
        data-testid="map-container"
      >
        <TileLayer
          url={isDarkMode 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {userLocation && (
          <Marker position={userLocation} data-testid="user-location-marker">
            <Popup>You are here</Popup>
          </Marker>
        )}

        {accessibilityPoints.map((point, index) => (
          <Marker key={index} position={point.position} data-testid={`accessibility-point-${index}`}>
            <Popup>{point.description}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          data-testid="add-feature-button"
          onClick={() => {/* Add feature handler */}}
        >
          Add Feature
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          data-testid="analyze-area-button"
          onClick={handleAnalyzeArea}
        >
          Analyze Area
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded shadow hover:bg-purple-600"
          data-testid="accessibility-button"
          onClick={() => {/* Accessibility settings handler */}}
        >
          Accessibility Settings
        </button>
      </div>
    </div>
  );
};
