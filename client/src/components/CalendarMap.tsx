import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import type { Event } from '@shared/schema';

// Leaflet icon setup
// This is necessary because of how Leaflet handles assets
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom colored marker icons for different event categories
const categoryIcons: Record<string, any> = {
  'festival': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-purple'
  }),
  'concert': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-blue'
  }),
  'foodwine': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-purple'
  }),
  'market': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-yellow'
  }),
  'outdoor': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-green'
  }),
  'cultural': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-blue'
  }),
  'family': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-teal'
  }),
  'General': new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'marker-gray'
  })
};

// Coordinates for Texas Hill Country center
const defaultCenter = [30.2849, -98.8759]; // Approximate center of Hill Country
const defaultZoom = 9;

// We need to add geocoding for events that don't have explicit coordinates
// This is a simplified version - in a production app, we would use a proper geocoding service
const locationCoordinates: Record<string, [number, number]> = {
  'Fredericksburg': [30.2752, -98.8719],
  'Austin': [30.2672, -97.7431],
  'San Antonio': [29.4252, -98.4946],
  'New Braunfels': [29.7030, -98.1244],
  'Marble Falls': [30.5782, -98.2729],
  'Dripping Springs': [30.1902, -98.0867],
  'Johnson City': [30.2761, -98.4105],
  'Wimberley': [29.9974, -98.0986],
  'Boerne': [29.7947, -98.7320],
  'Kerrville': [30.0474, -99.1402],
  'Bandera': [29.7266, -99.0753],
  'Luckenbach': [30.1813, -98.7538],
  'Llano': [30.7531, -98.6750],
  'Comfort': [29.9689, -98.9084],
  'Texas Hill Country': [30.2849, -98.8759], // Default for generic "Hill Country" location
};

// Get coordinates from a location string
const getCoordinates = (location: string): [number, number] => {
  // Check for exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  
  // Look for partial matches in the location string
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (location.includes(key)) {
      return coords;
    }
  }
  
  // Default to Hill Country center if no match
  return defaultCenter;
};

interface CalendarMapProps {
  className?: string;
  selectedCategory?: string;
  startDate?: Date;
  endDate?: Date;
}

const CalendarMap: React.FC<CalendarMapProps> = ({ 
  className,
  selectedCategory = 'all',
  startDate: filterStartDate,
  endDate: filterEndDate
}) => {
  const [mapEvents, setMapEvents] = useState<Event[]>([]);
  
  // Get current date for API filtering
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setMonth(currentDate.getMonth() + 3); // Look ahead 3 months
  
  // Fetch events from our database with caching optimization
  const { data: dbEvents, isLoading: isLoadingDbEvents } = useQuery({
    queryKey: ['/api/events'],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,    // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,      // Garbage collection time (formerly cacheTime)
  });
  
  // Fetch events from Google Calendar with optimized caching
  const { data: calendarEvents, isLoading: isLoadingCalendarEvents, isError: isCalendarError } = useQuery({
    queryKey: ['/api/calendar/events', currentDate.toISOString(), futureDate.toISOString()],
    queryFn: async () => {
      const response = await fetch(`/api/calendar/events?startDate=${currentDate.toISOString()}&endDate=${futureDate.toISOString()}`);
      if (!response.ok) {
        console.warn('Google Calendar integration unavailable, continuing with local events only');
        return [];
      }
      return response.json();
    },
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Prevent excessive refetching
    refetchOnMount: false,       // Prevent refetching when component remounts
    refetchOnReconnect: false,   // Prevent refetching on reconnection
    staleTime: 5 * 60 * 1000,    // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,      // Garbage collection time (formerly cacheTime)
    onError: () => {
      console.warn('Google Calendar integration unavailable, continuing with local events only');
    }
  });
  
  // Memoize the processing function to prevent unnecessary recalculations
  const processEvents = useCallback(() => {
    let combinedEvents: Event[] = [];
    
    // Add events from our database
    if (dbEvents && Array.isArray(dbEvents)) {
      combinedEvents.push(...dbEvents);
    }
    
    // Add events from Google Calendar
    if (calendarEvents && Array.isArray(calendarEvents)) {
      // Filter out potential duplicates (events with same title and date)
      const filteredCalendarEvents = calendarEvents.filter(calEvent => {
        return !combinedEvents.some(dbEvent => 
          dbEvent.name === calEvent.name && 
          new Date(dbEvent.startDate).toDateString() === new Date(calEvent.startDate).toDateString()
        );
      });
      
      combinedEvents.push(...filteredCalendarEvents);
    }
    
    // Apply category filter if not "all"
    if (selectedCategory !== 'all') {
      combinedEvents = combinedEvents.filter(event => 
        event.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply date range filters
    if (filterStartDate || filterEndDate) {
      combinedEvents = combinedEvents.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        
        // Start date filter
        if (filterStartDate && eventEnd < filterStartDate) {
          return false;
        }
        
        // End date filter
        if (filterEndDate && eventStart > filterEndDate) {
          return false;
        }
        
        return true;
      });
    }
    
    return combinedEvents;
  }, [dbEvents, calendarEvents, selectedCategory, filterStartDate, filterEndDate]);
  
  // Apply debouncing to prevent rapid re-renders and excessive API calls
  useEffect(() => {
    // Using setTimeout to debounce the updates
    const debounceTimer = setTimeout(() => {
      const events = processEvents();
      setMapEvents(events);
    }, 300); // 300ms debounce delay
    
    // Cleanup the timeout on unmount or before next effect run
    return () => clearTimeout(debounceTimer);
  }, [processEvents]);
  
  const isLoading = isLoadingDbEvents || isLoadingCalendarEvents;
  
  // Custom CSS for markers
  useEffect(() => {
    // Add CSS for custom marker colors
    const style = document.createElement('style');
    style.textContent = `
      .marker-purple { filter: hue-rotate(250deg) brightness(0.8); }
      .marker-blue { filter: hue-rotate(200deg) brightness(0.8); }
      .marker-green { filter: hue-rotate(120deg) brightness(0.8); }
      .marker-yellow { filter: hue-rotate(50deg) brightness(0.9); }
      .marker-teal { filter: hue-rotate(160deg) brightness(0.8); }
      .marker-gray { filter: grayscale(100%) brightness(0.8); }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const getCategoryBadgeClass = (category: string) => {
    switch(category?.toLowerCase()) {
      case 'festival':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'concert':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'foodwine':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'market':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'outdoor':
        return 'bg-green-500 hover:bg-green-600';
      case 'cultural':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'family':
        return 'bg-teal-500 hover:bg-teal-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <div className={`${className || ''}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card>
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Event Map</h3>
            <p className="text-sm text-gray-500">
              Showing upcoming events from our database and Google Calendar for the next 3 months
            </p>
          </div>
          
          <div className="p-4">
            {/* Category indicators */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-purple-500 hover:bg-purple-500">Festivals</Badge>
              <Badge className="bg-blue-500 hover:bg-blue-500">Concerts</Badge>
              <Badge className="bg-purple-500 hover:bg-purple-500">Food & Wine</Badge>
              <Badge className="bg-yellow-500 hover:bg-yellow-500">Markets</Badge>
              <Badge className="bg-green-500 hover:bg-green-500">Outdoor</Badge>
              <Badge className="bg-blue-500 hover:bg-blue-500">Cultural</Badge>
              <Badge className="bg-teal-500 hover:bg-teal-500">Family</Badge>
            </div>
          </div>
          
          {/* Show message when no events are found */}
          {mapEvents.length === 0 && (
            <div className="flex flex-col justify-center items-center h-[300px] bg-gray-50 rounded-b-lg px-4 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500 max-w-md mb-4">
                There are no events matching your current filters. Try adjusting your filter criteria or add new events through the admin panel.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/login">Add Events</Link>
              </Button>
            </div>
          )}
          
          <div className="h-[500px] relative overflow-hidden rounded-b-lg">
            <MapContainer 
              center={defaultCenter} 
              zoom={defaultZoom} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {mapEvents.map((event, index) => {
                const coordinates = getCoordinates(event.location);
                const category = event.category || 'General';
                const eventIcon = categoryIcons[category] || customIcon;
                
                return (
                  <Marker 
                    key={`${event.id}-${index}`} 
                    position={coordinates}
                    icon={eventIcon}
                  >
                    <Popup>
                      <div className="max-w-[250px]">
                        <h3 className="font-semibold text-base">{event.name}</h3>
                        <div className="my-1">
                          <Badge className={getCategoryBadgeClass(category)}>
                            {category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                        <p className="text-sm font-medium mt-1">
                          {format(new Date(event.startDate), 'MMM d, yyyy')}
                        </p>
                        {event.isRecurring && (
                          <p className="text-xs italic mt-1">
                            Recurring Event: {event.recurrencePattern}
                          </p>
                        )}
                        
                        {/* Always show a button, with appropriate linking strategy */}
                        <div className="mt-2">
                          <Button asChild size="sm" className="w-full">
                            {event.slug ? (
                              // For events from our database with a slug
                              <Link href={`/events/${event.slug}`}>
                                View Details
                              </Link>
                            ) : (event as any).sourceId ? (
                              // For events from Google Calendar with a sourceId
                              <a href={`https://calendar.google.com/calendar/event?eid=${(event as any).sourceId}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer">
                                View in Google Calendar
                              </a>
                            ) : event.location ? (
                              // For events with no slug but with a location, try to find matching destinations
                              <Link href={`/destinations?location=${encodeURIComponent(event.location)}`}>
                                View Location
                              </Link>
                            ) : (
                              // Fallback for other events
                              <Link href={`/events`}>
                                View All Events
                              </Link>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CalendarMap;