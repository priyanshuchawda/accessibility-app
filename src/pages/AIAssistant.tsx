import React, { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { analyzeAccessibility } from '../services/mapAIService';
import { AccessibilityFeature } from '../types/accessibility';

export const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAccessibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Convert the query into a mock accessibility feature for analysis
      const mockFeature: AccessibilityFeature = {
        id: 'query',
        type: 'query',
        description: query,
        coordinates: [0, 0], // Default coordinates
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user',
        verified: false
      };

      const result = await analyzeAccessibility([mockFeature]);
      setResponse(`Accessibility Rating: ${result.overall}/5\n\n${result.details}\n\nSuggested Improvements:\n${result.improvements.map((imp: string) => `- ${imp}`).join('\n')}`);
    } catch (error) {
      setResponse('Sorry, I encountered an error processing your request.');
      console.error('AI Assistant Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-assistant-container ${isDarkMode ? 'dark' : 'light'}`}>
      <h2>AI Accessibility Assistant</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about accessibility features or get recommendations..."
          rows={4}
          className="query-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="submit-button"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {response && (
        <div className="response-container">
          <h3>Response:</h3>
          <pre className="response-text">{response}</pre>
        </div>
      )}
    </div>
  );
};
