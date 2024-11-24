export class GoogleGenerativeAI {
  constructor(apiKey: string) {}

  getGenerativeModel({ model }: { model: string }) {
    return {
      generateContent: jest.fn().mockResolvedValue({
        response: Promise.resolve({
          text: () => Promise.resolve(JSON.stringify({
            overall: 4,
            details: "Mock accessibility analysis",
            improvements: ["Improvement 1", "Improvement 2"],
            path: [[51.5, -0.09], [51.51, -0.08]],
            distance: 500,
            duration: 10,
            accessibility: 4,
            warnings: ["Warning 1"],
            features: [],
            gaps: [
              {
                location: [51.5, -0.09],
                missingFeatures: ["ramp"],
                priority: "high",
                recommendation: "Add a ramp"
              }
            ]
          }))
        })
      })
    };
  }
}
