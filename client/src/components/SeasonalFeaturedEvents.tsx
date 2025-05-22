import React from 'react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface FeaturedEventProps {
  season: string;
  limit?: number;
}

const seasonDateRanges: Record<string, { start: string; end: string }> = {
  spring: {
    start: `${new Date().getFullYear()}-03-01`,
    end: `${new Date().getFullYear()}-05-31`
  },
  summer: {
    start: `${new Date().getFullYear()}-06-01`,
    end: `${new Date().getFullYear()}-08-31`
  },
  fall: {
    start: `${new Date().getFullYear()}-09-01`,
    end: `${new Date().getFullYear()}-11-30`
  },
  winter: {
    start: `${new Date().getFullYear()}-12-01`,
    end: `${new Date().getFullYear() + 1}-02-28`
  }
};

const categoryIcons: Record<string, string> = {
  'festival': 'fa-ticket-alt',
  'concert': 'fa-music',
  'foodwine': 'fa-wine-glass-alt',
  'market': 'fa-store',
  'outdoor': 'fa-hiking',
  'cultural': 'fa-landmark',
  'family': 'fa-child',
  'holiday': 'fa-gift',
  'sports': 'fa-running',
  'art': 'fa-paint-brush'
};

const categoryColors: Record<string, string> = {
  'festival': 'bg-purple-100 text-purple-800 border-purple-200',
  'concert': 'bg-blue-100 text-blue-800 border-blue-200',
  'foodwine': 'bg-purple-100 text-purple-800 border-purple-200',
  'market': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'outdoor': 'bg-green-100 text-green-800 border-green-200',
  'cultural': 'bg-blue-100 text-blue-800 border-blue-200',
  'family': 'bg-teal-100 text-teal-800 border-teal-200',
  'holiday': 'bg-red-100 text-red-800 border-red-200',
  'sports': 'bg-orange-100 text-orange-800 border-orange-200',
  'art': 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

const SeasonalFeaturedEvents = ({ season, limit = 3 }: FeaturedEventProps) => {
  // Get date range for the season
  const dateRange = seasonDateRanges[season] || seasonDateRanges.spring;
  
  // Query events from both database and Google Calendar
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
    select: (allEvents: any[]) => {
      // Filter events by season
      const seasonalEvents = allEvents.filter(event => {
        const eventStart = new Date(event.startDate);
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);
        
        return eventStart >= rangeStart && eventStart <= rangeEnd;
      });
      
      // Sort by date
      return seasonalEvents.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ).slice(0, limit);
    }
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 rounded-t-lg bg-gray-200"></div>
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  // Show message if no events
  if (events.length === 0) {
    const seasonNames: Record<string, string> = {
      spring: 'Spring',
      summer: 'Summer',
      fall: 'Fall',
      winter: 'Winter'
    };
    
    return (
      <Card className="text-center p-6">
        <CardContent className="pt-6">
          <div className="text-4xl mb-4 text-gray-300">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No {seasonNames[season]} Events Found</h3>
          <p className="text-gray-600 mb-4">
            We're still adding events for this season. Check back soon or explore other seasons!
          </p>
          <Button asChild variant="outline">
            <Link href="/events">View All Events</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {events.map((event) => {
        const eventDate = new Date(event.startDate);
        const category = event.category?.toLowerCase() || 'festival';
        const colorClass = categoryColors[category] || categoryColors.festival;
        const iconClass = categoryIcons[category] || 'fa-calendar-day';
        
        return (
          <Card key={event.id} className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-shadow">
            <div 
              className="h-48 bg-cover bg-center relative" 
              style={{ backgroundImage: `url(${event.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
              <div className="absolute bottom-0 left-0 p-3">
                <Badge className={`${colorClass}`}>
                  <i className={`fas ${iconClass} mr-1.5`}></i>
                  {event.category || 'Event'}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{event.name}</CardTitle>
              <CardDescription>
                {format(eventDate, 'MMMM d, yyyy')} • {format(eventDate, 'h:mm a')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <p className="text-gray-600 line-clamp-3">{event.shortDescription}</p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/events/${event.slug}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SeasonalFeaturedEvents;