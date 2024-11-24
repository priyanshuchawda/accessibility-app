import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { AccessibilityFeature, AccessibilityGap } from '../types/accessibility';

// Add Google Maps types
interface LatLng {
  lat: number;
  lng: number;
  toString(): string;
}

export interface AccessibilityAnalysis {
  overall: number;
  details: string;
  improvements: string[];
}

export interface AccessibleRoute {
  path: [number, number][];
  distance: number;
  duration: number;
  accessibility: number;
  warnings: string[];
}

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const getResponseText = (result: GenerateContentResult): string => {
  console.log('API Response:', result);
  
  if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Invalid response structure:', result);
    throw new Error('Invalid response format from AI model');
  }
  return result.response.candidates[0].content.parts[0].text;
};

export async function analyzeAccessibility(features: AccessibilityFeature[]): Promise<AccessibilityAnalysis> {
  const prompt = `Analyze these accessibility features: ${JSON.stringify(features)}`;
  console.log('Sending analysis prompt:', prompt);
  
  try {
    const result = await model.generateContent(prompt);
    const text = getResponseText(result);
    return JSON.parse(text) as AccessibilityAnalysis;
  } catch (error) {
    console.error('Error analyzing accessibility:', error);
    throw error;
  }
}

export async function findAccessibleRoute(
  start: LatLng,
  end: LatLng,
  preferences: string[]
): Promise<AccessibleRoute> {
  const prompt = `Find accessible route from ${start.toString()} to ${end.toString()} with preferences: ${preferences.join(', ')}`;
  console.log('Sending route prompt:', prompt);
  
  try {
    const result = await model.generateContent(prompt);
    const text = getResponseText(result);
    return JSON.parse(text) as AccessibleRoute;
  } catch (error) {
    console.error('Error finding accessible route:', error);
    throw error;
  }
}

export async function identifyAccessibilityGaps(features: AccessibilityFeature[]): Promise<AccessibilityGap[]> {
  const prompt = `Identify gaps in accessibility coverage for: ${JSON.stringify(features)}`;
  console.log('Sending gaps prompt:', prompt);
  
  try {
    const result = await model.generateContent(prompt);
    const text = getResponseText(result);
    const data = JSON.parse(text) as { gaps: AccessibilityGap[] };
    return data.gaps;
  } catch (error) {
    console.error('Error identifying accessibility gaps:', error);
    throw error;
  }
}
