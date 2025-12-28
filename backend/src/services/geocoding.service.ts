import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export interface GeocodingResult {
  city: string | null;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export const detectCity = async (taskText: string): Promise<GeocodingResult | null> => {
  const GOOGLE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_GENERATIVE_AI_API_KEY not configured, skipping city detection');
    return null;
  }

  if (!taskText || taskText.trim().length === 0) {
    return null;
  }

  try {
    const model = google('gemini-2.5-flash', {
      apiKey: GOOGLE_AI_API_KEY,
    });

    const prompt = `Extract the first city name mentioned in the following text. Return only the city name (e.g., "Paris", "New York", "Tokyo"). If no city is mentioned, return exactly "None". Do not include any additional text or explanation.

Text: "${taskText}"

City name:`;

    const { text } = await generateText({
      model,
      prompt,
    });

    const cityName = text.trim();

    if (!cityName || cityName.toLowerCase() === 'none' || cityName.length === 0) {
      return null;
    }

    return {
      city: cityName,
    };
  } catch (error) {
    console.error('Error detecting city with Gemini:', error);
    return null;
  }
};

