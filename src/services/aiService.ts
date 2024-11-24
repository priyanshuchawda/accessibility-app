import { generateResponse } from '../config/gemini';

const ACCESSIBILITY_CONTEXT = `You are an AI assistant specialized in accessibility. Your role is to:
1. Help users find accessible routes and facilities
2. Provide detailed information about accessibility features
3. Offer guidance on accessibility requirements and standards
4. Suggest improvements for making places more accessible
5. Answer questions about disability rights and accommodations`;

export interface AIResponse {
  text: string;
  suggestions?: string[];
  relatedTopics?: string[];
}

export const getAIResponse = async (
  userInput: string,
  userLocation?: { lat: number; lng: number }
): Promise<AIResponse> => {
  try {
    const contextualPrompt = `${ACCESSIBILITY_CONTEXT}
    
User's input: ${userInput}
${userLocation ? `User's location: ${userLocation.lat}, ${userLocation.lng}` : ''}

Please provide a response in the following JSON format:
{
  "text": "Your main response here",
  "suggestions": ["2-3 follow-up questions or suggestions"],
  "relatedTopics": ["2-3 related accessibility topics"]
}`;

    const response = await generateResponse(contextualPrompt);
    try {
      return JSON.parse(response);
    } catch {
      // If JSON parsing fails, return just the text
      return { text: response };
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      text: 'I apologize, but I encountered an error. Please try again.',
      suggestions: ['Could you rephrase your question?'],
    };
  }
};

export const getSpeechRecognition = (): SpeechRecognition | null => {
  if (!('webkitSpeechRecognition' in window)) {
    return null;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  return recognition;
};

export const speak = (text: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
};
