import { analyzeAccessibility, findAccessibleRoute, identifyAccessibilityGaps } from '../mapAIService';
import { AccessibilityFeature, AccessibilityGap } from '../../types/accessibility';
import { AccessibilityAnalysis, AccessibleRoute } from '../mapAIService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock response data
const mockAnalysisData: AccessibilityAnalysis = {
  overall: 4,
  details: "Good accessibility features",
  improvements: ["Add more ramps"]
};

const mockRouteData: AccessibleRoute = {
  path: [[40.7128, -74.0060], [40.7129, -74.0061]],
  distance: 100,
  duration: 5,
  accessibility: 4,
  warnings: ["Steep ramp ahead"]
};

const mockGapsData = {
  gaps: [{
    location: [40.7130, -74.0062],
    missingFeatures: ['ramp'],
    priority: 'high',
    recommendation: 'Install wheelchair ramp'
  }] as AccessibilityGap[]
};

// Mock the Google AI API
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockImplementation(async (prompt: string) => {
            console.log('Received prompt:', prompt);
            
            const mockResponse = {
              response: {
                candidates: [{
                  content: {
                    parts: [{
                      text: (() => {
                        if (prompt.includes('Analyze these accessibility features')) {
                          console.log('Matching analysis prompt');
                          return JSON.stringify(mockAnalysisData);
                        } else if (prompt.includes('Find accessible route')) {
                          console.log('Matching route prompt');
                          return JSON.stringify(mockRouteData);
                        } else if (prompt.includes('Identify gaps')) {
                          console.log('Matching gaps prompt');
                          return JSON.stringify(mockGapsData);
                        }
                        console.error('No matching prompt found');
                        throw new Error(`Unknown prompt type: ${prompt}`);
                      })()
                    }]
                  }
                }]
              }
            };
            
            return mockResponse;
          })
        })
      };
    })
  };
});

describe('mapAIService', () => {
  const mockFeatures: AccessibilityFeature[] = [
    {
      id: '1',
      type: 'ramp',
      description: 'Wheelchair ramp at entrance',
      coordinates: [40.7128, -74.0060],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'test-user',
      verified: true
    }
  ];

  const mockLatLng = {
    lat: 40.7128,
    lng: -74.0060,
    toString: () => '40.7128,-74.0060'
  };

  test('analyzeAccessibility should analyze accessibility features correctly', async () => {
    const result = await analyzeAccessibility(mockFeatures);
    expect(result).toEqual(mockAnalysisData);
  });

  test('findAccessibleRoute should find an accessible route between two points', async () => {
    const startPoint = { ...mockLatLng };
    const endPoint = { ...mockLatLng, lat: 40.7129, lng: -74.0061 };
    const preferences = ['wheelchair', 'avoid_stairs'];
    
    const result = await findAccessibleRoute(startPoint, endPoint, preferences);
    expect(result).toEqual(mockRouteData);
  });

  test('identifyAccessibilityGaps should identify gaps in accessibility coverage', async () => {
    const gaps = await identifyAccessibilityGaps(mockFeatures);
    expect(gaps).toEqual(mockGapsData.gaps);
  });
});
