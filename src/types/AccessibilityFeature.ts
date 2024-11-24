export interface AccessibilityFeature {
  id: string;
  type: 'ramp' | 'elevator' | 'braille' | 'handicap_parking' | 'accessible_restroom';
  latitude: number;
  longitude: number;
  description: string;
  verified: boolean;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}
