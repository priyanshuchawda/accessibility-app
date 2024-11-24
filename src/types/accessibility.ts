export interface AccessibilityFeature {
  id: string;
  type: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  createdAt: string;
  updatedAt: string;
  userId: string;
  verified: boolean;
  rating?: number;
  comments?: string[];
}

export type FeatureType = 
  | 'ramp'
  | 'elevator'
  | 'handicapParking'
  | 'accessibleRestroom'
  | 'brailleSignage'
  | 'hearingLoop'
  | 'tactilePaving'
  | 'lowCounter'
  | 'automaticDoor'
  | 'wheelchairLift'
  | 'other';

export interface AccessibilityRating {
  overall: number; // 1-5
  details: string;
  improvements: string[];
}

export interface RouteRecommendation {
  path: [number, number][]; // Array of [latitude, longitude] coordinates
  distance: number;
  duration: number;
  accessibility: number; // 1-5
  warnings: string[];
  features: AccessibilityFeature[];
}

export interface AccessibilityGap {
  location: [number, number];
  missingFeatures: string[];
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface AccessibilityAnalysis {
  rating: AccessibilityRating;
  gaps: AccessibilityGap[];
  recommendations: string[];
}
