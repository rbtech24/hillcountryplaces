import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_mph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
    }>;
  };
}

interface FormattedWeatherResponse {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

// Convert API icon URL to our simple icon codes
const getIconCode = (iconUrl: string): string => {
  if (iconUrl.includes('sunny') || iconUrl.includes('clear')) return 'clear-day';
  if (iconUrl.includes('night')) return 'clear-night';
  if (iconUrl.includes('partly')) return 'partly-cloudy-day';
  if (iconUrl.includes('cloudy')) return 'cloudy';
  if (iconUrl.includes('rain')) return 'rain';
  if (iconUrl.includes('snow')) return 'snow';
  if (iconUrl.includes('sleet')) return 'sleet';
  if (iconUrl.includes('wind')) return 'wind';
  if (iconUrl.includes('fog')) return 'fog';
  if (iconUrl.includes('thunder')) return 'thunderstorm';
  return 'cloudy'; // default
};

// Mock weather data for when API key is not available
const getMockWeatherData = (location: string): FormattedWeatherResponse => {
  const cityName = location.charAt(0).toUpperCase() + location.slice(1).replace('-', ' ');
  
  return {
    location: `${cityName}, TX`,
    temperature: Math.floor(Math.random() * 20) + 70, // Random temp between 70-90
    condition: ['Sunny', 'Partly Cloudy', 'Clear', 'Mostly Sunny'][Math.floor(Math.random() * 4)],
    icon: ['clear-day', 'partly-cloudy-day'][Math.floor(Math.random() * 2)],
    humidity: Math.floor(Math.random() * 30) + 40, // Random humidity between 40-70%
    windSpeed: Math.floor(Math.random() * 10) + 5, // Random wind 5-15mph
    forecast: [
      {
        date: 'Today',
        high: Math.floor(Math.random() * 15) + 75,
        low: Math.floor(Math.random() * 10) + 60,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy-day'
      },
      {
        date: 'Tomorrow',
        high: Math.floor(Math.random() * 15) + 75,
        low: Math.floor(Math.random() * 10) + 60,
        condition: 'Sunny',
        icon: 'clear-day'
      },
      {
        date: 'Friday',
        high: Math.floor(Math.random() * 15) + 75,
        low: Math.floor(Math.random() * 10) + 60,
        condition: 'Sunny',
        icon: 'clear-day'
      },
      {
        date: 'Saturday',
        high: Math.floor(Math.random() * 15) + 75,
        low: Math.floor(Math.random() * 10) + 60,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy-day'
      },
      {
        date: 'Sunday',
        high: Math.floor(Math.random() * 15) + 75,
        low: Math.floor(Math.random() * 10) + 60,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy-day'
      }
    ]
  };
};

// Format API response to our standardized format
const formatWeatherData = (data: WeatherApiResponse): FormattedWeatherResponse => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Format forecast to include day names
  const forecast = data.forecast.forecastday.map((day, index) => {
    const date = new Date(day.date);
    const dayName = index === 0 ? 'Today' : 
                    index === 1 ? 'Tomorrow' : 
                    weekdays[date.getDay()];
                    
    return {
      date: dayName,
      high: Math.round(day.day.maxtemp_f),
      low: Math.round(day.day.mintemp_f),
      condition: day.day.condition.text,
      icon: getIconCode(day.day.condition.icon)
    };
  });
  
  return {
    location: `${data.location.name}, ${data.location.region}`,
    temperature: Math.round(data.current.temp_f),
    condition: data.current.condition.text,
    icon: getIconCode(data.current.condition.icon),
    humidity: data.current.humidity,
    windSpeed: Math.round(data.current.wind_mph),
    forecast
  };
};

// Map location slugs to proper city names for the API
const locationMapping: Record<string, string> = {
  'austin': 'Austin,Texas',
  'fredericksburg': 'Fredericksburg,Texas',
  'new-braunfels': 'New Braunfels,Texas',
  'san-marcos': 'San Marcos,Texas',
  'wimberley': 'Wimberley,Texas',
  'dripping-springs': 'Dripping Springs,Texas',
  'marble-falls': 'Marble Falls,Texas',
  'boerne': 'Boerne,Texas',
  'johnson-city': 'Johnson City,Texas',
  'canyon-lake': 'Canyon Lake,Texas',
  'kerrville': 'Kerrville,Texas'
};

/**
 * Get weather data for a specific Hill Country location
 */
export const getWeatherData = async (req: Request, res: Response) => {
  const { location = 'austin' } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  
  // If location is not in our mapping, return an error
  if (!locationMapping[location]) {
    return res.status(400).json({ 
      error: 'Invalid location. Please provide a valid Hill Country location.' 
    });
  }
  
  try {
    // If we have an API key, fetch real weather data
    if (apiKey) {
      const apiLocation = locationMapping[location];
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${apiLocation}&days=5&aqi=no&alerts=no`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
      }
      
      const data = await response.json() as WeatherApiResponse;
      const formattedData = formatWeatherData(data);
      
      return res.json(formattedData);
    } 
    
    // If no API key, return mock data
    console.log('No Weather API key found, returning mock data');
    const mockData = getMockWeatherData(location);
    return res.json(mockData);
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};