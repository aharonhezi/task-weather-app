import { WeatherData } from '../types';
import { GeocodingResult } from './geocoding.service';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '5e5763c7175b4db792853554242107';

interface WeatherAPIResponse {
  location?: {
    name?: string;
    country?: string;
  };
  current?: {
    temp_c?: number;
    temp_f?: number;
    condition?: {
      text?: string;
      icon?: string; // Full URL from WeatherAPI.com
      code?: number;
    };
  };
}

export const fetchWeatherData = async (
  geocodingResult: GeocodingResult
): Promise<WeatherData | null> => {
  if (!geocodingResult || !geocodingResult.city) {
    return null;
  }

  if (!WEATHER_API_KEY) {
    console.warn('WEATHER_API_KEY not configured, skipping weather fetch');
    return null;
  }

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(geocodingResult.city)}&aqi=no`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json() as WeatherAPIResponse;

    if (!response.ok) {
      console.error(`WeatherAPI error: ${response.status} ${response.statusText}`);
      console.error('Error details:', data);
      return null;
    }
    
    const current = data.current;
    if (!current) {
      console.warn('WeatherAPI returned incomplete data:', data);
      return null;
    }

    // Use icon URL directly from WeatherAPI.com (always provided in response)
    const weatherData: WeatherData = {
      temperature: current.temp_c ?? current.temp_f ?? undefined,
      condition: current.condition?.text ?? undefined,
      icon: current.condition?.icon, // Full URL from WeatherAPI.com, no fallback needed
    };

    return weatherData;
  } catch (error) {
    // For all errors, log and return null gracefully (graceful degradation)
    console.error('Error fetching weather data:', error);
    return null;
  }
};

