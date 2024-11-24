export const identifyAccessibilityGaps = jest.fn().mockResolvedValue([
  {
    location: [51.5074, -0.1278],
    missingFeatures: ['ramp', 'handrail'],
    recommendation: 'Install a wheelchair ramp and handrails'
  }
]);
