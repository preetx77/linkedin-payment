import { createAIService, createMockAIService } from './gemini';

// Get the API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Log configuration status (without exposing the key)
console.log('AI Service Configuration:', {
  hasApiKey: !!GEMINI_API_KEY,
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV
});

// Create the appropriate service based on the environment
export const aiService = (() => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key found in environment variables');
      return createMockAIService();
    }
    return createAIService(GEMINI_API_KEY);
  } catch (error) {
    console.error('Failed to initialize AI service:', error);
    return createMockAIService();
  }
})();

export const POST_STYLES = {
  professional: {
    label: 'Professional',
    description: 'Formal and business-oriented content'
  },
  casual: {
    label: 'Casual',
    description: 'Friendly and conversational tone'
  },
  storytelling: {
    label: 'Storytelling',
    description: 'Narrative-driven content with personal experiences'
  },
  educational: {
    label: 'Educational',
    description: 'Informative content that teaches or explains'
  },
  promotional: {
    label: 'Promotional',
    description: 'Content focused on promoting products or services'
  }
} as const; 