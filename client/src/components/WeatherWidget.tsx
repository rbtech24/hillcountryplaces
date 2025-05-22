import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

interface WeatherWidgetProps {
  defaultLocation?: string;
  showForecast?: boolean;
  className?: string;
}

export function WeatherWidget({ 
  defaultLocation = 'austin', 
  showForecast = true,
  className = '' 
}: WeatherWidgetProps) {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Common Hill Country locations
  const locations = [
    { value: 'austin', label: 'Austin' },
    { value: 'fredericksburg', label: 'Fredericksburg' },
    { value: 'new-braunfels', label: 'New Braunfels' },
    { value: 'san-marcos', label: 'San Marcos' },
    { value: 'wimberley', label: 'Wimberley' },
    { value: 'dripping-springs', label: 'Dripping Springs' },
    { value: 'marble-falls', label: 'Marble Falls' },
    { value: 'boerne', label: 'Boerne' },
    { value: 'johnson-city', label: 'Johnson City' }
  ];

  // Mock data for development/preview
  const mockWeatherData: WeatherData = {
    location: 'Austin, TX',
    temperature: 82,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy-day',
    humidity: 45,
    windSpeed: 8,
    forecast: [
      { date: 'Today', high: 85, low: 68, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
      { date: 'Tomorrow', high: 88, low: 70, condition: 'Sunny', icon: 'clear-day' },
      { date: 'Saturday', high: 90, low: 72, condition: 'Sunny', icon: 'clear-day' },
      { date: 'Sunday', high: 81, low: 66, condition: 'Rain', icon: 'rain' },
      { date: 'Monday', high: 76, low: 65, condition: 'Thunderstorms', icon: 'thunderstorm' },
    ]
  };

  // Fetch weather data from our backend API
  const fetchWeatherData = async (): Promise<WeatherData> => {
    try {
      const response = await fetch(`/api/weather/${selectedLocation}`);
      
      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
    }
  };

  // Get API key from environment or config (when available)
  useEffect(() => {
    // In a real implementation, we might check for an API key in localStorage or fetch from server
    // setApiKey(process.env.WEATHER_API_KEY || null);
  }, []);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', selectedLocation], 
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Icons mapping - in a real app, we would use weather icon images or an icon library
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      'clear-day': '☀️',
      'clear-night': '🌙',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '☁️',
      'cloudy': '☁️',
      'rain': '🌧️',
      'sleet': '🌨️',
      'snow': '❄️',
      'wind': '💨',
      'fog': '🌫️',
      'thunderstorm': '⛈️'
    };
    
    return iconMap[iconCode] || '❓';
  };

  // Color classes based on temperature
  const getTemperatureColorClass = (temp: number) => {
    if (temp >= 90) return 'text-red-600';
    if (temp >= 80) return 'text-orange-500';
    if (temp >= 70) return 'text-yellow-500';
    if (temp >= 60) return 'text-green-500';
    if (temp >= 50) return 'text-blue-400';
    return 'text-blue-600';
  };

  if (isLoading) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
        <h3 className="text-lg font-semibold text-red-600">Weather Unavailable</h3>
        <p className="text-sm text-gray-600">
          We couldn't load the weather information at this time. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header with location selector */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Hill Country Weather</h3>
          <Select 
            value={selectedLocation} 
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-36 h-8 bg-white/20 border-0 text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Current weather */}
      {weather && (
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold">{weather.location}</h4>
              <p className="text-sm text-gray-500">Current Conditions</p>
            </div>
            <div className="text-center">
              <span className="text-4xl">{getWeatherIcon(weather.icon)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div>
              <span className={`text-4xl font-bold ${getTemperatureColorClass(weather.temperature)}`}>
                {weather.temperature}°F
              </span>
              <p className="text-sm text-gray-600">{weather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Humidity: {weather.humidity}%</p>
              <p className="text-sm text-gray-600">Wind: {weather.windSpeed} mph</p>
            </div>
          </div>
          
          {/* 5-day forecast */}
          {showForecast && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">5-Day Forecast</h4>
              <div className="grid grid-cols-5 gap-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs font-medium">{day.date}</p>
                    <div className="my-1 text-xl">{getWeatherIcon(day.icon)}</div>
                    <p className="text-xs">
                      <span className={getTemperatureColorClass(day.high)}>{day.high}°</span>
                      {' / '}
                      <span className="text-gray-500">{day.low}°</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weather Tips */}
          <div className="mt-4 text-xs text-gray-600 text-center border-t pt-3">
            <p className="font-medium">Hill Country Weather Tips</p>
            <p>Spring and Fall offer the most comfortable temperatures</p>
            <p>Summer visitors should bring sun protection and stay hydrated</p>
          </div>
        </div>
      )}
    </div>
  );
}