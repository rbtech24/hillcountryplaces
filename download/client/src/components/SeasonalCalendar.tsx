import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import type { Event } from '@shared/schema';

import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  category?: string;
  slug?: string;
  isRecurring?: boolean;
  recurrencePattern?: string | null;
}

const categoryColors: Record<string, string> = {
  'festival': 'bg-purple-500',
  'concert': 'bg-blue-500',
  'foodwine': 'bg-purple-500',
  'market': 'bg-yellow-500',
  'outdoor': 'bg-green-500',
  'cultural': 'bg-blue-500',
  'family': 'bg-teal-500',
  'General': 'bg-gray-500'
};

interface SeasonalCalendarProps {
  selectedCategory?: string;
  startDate?: Date;
  endDate?: Date;
}

const SeasonalCalendar = ({ 
  selectedCategory = 'all', 
  startDate: filterStartDate, 
  endDate: filterEndDate 
}: SeasonalCalendarProps = {}) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Format date range for API call
  const startDate = new Date(date);
  startDate.setDate(1); // Start of month
  
  const endDate = new Date(date);
  endDate.setMonth(date.getMonth() + 1);
  endDate.setDate(0); // End of month
  
  // Fetch events from both our database and Google Calendar
  const { data: dbEvents, isLoading: isLoadingDbEvents } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const { data: calendarEvents, isLoading: isLoadingCalendarEvents } = useQuery({
    queryKey: ['/api/calendar/events', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const response = await fetch(`/api/calendar/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      return response.json();
    }
  });

  useEffect(() => {
    let combinedEvents: CalendarEvent[] = [];
    
    // Add events from our database
    if (dbEvents && Array.isArray(dbEvents)) {
      dbEvents.forEach((event: Event) => {
        combinedEvents.push({
          id: event.id,
          title: event.name,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: false,
          category: event.category,
          slug: event.slug,
          isRecurring: event.isRecurring,
          recurrencePattern: event.recurrencePattern
        });
      });
    }
    
    // Add events from Google Calendar
    if (calendarEvents && Array.isArray(calendarEvents)) {
      calendarEvents.forEach((event: Event) => {
        // Avoid duplicates by checking if an event with the same title and date already exists
        const existingEvent = combinedEvents.find(e => 
          e.title === event.name && 
          e.start.toDateString() === new Date(event.startDate).toDateString()
        );
        
        if (!existingEvent) {
          combinedEvents.push({
            id: event.id,
            title: event.name,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            allDay: false,
            category: event.category,
            slug: event.slug,
            isRecurring: event.isRecurring,
            recurrencePattern: event.recurrencePattern
          });
        }
      });
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
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        
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
    
    setEvents(combinedEvents);
  }, [dbEvents, calendarEvents, selectedCategory, filterStartDate, filterEndDate]);

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() - 1);
        return newDate;
      });
    } else if (action === 'NEXT') {
      setDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
      });
    } else if (action === 'TODAY') {
      setDate(new Date());
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const category = event.category || 'General';
    const backgroundColor = categoryColors[category] || 'bg-gray-500';
    
    // Add indicator for recurring events
    const isRecurring = event.isRecurring;
    
    return {
      className: `${backgroundColor} text-white rounded-md p-1 overflow-hidden ${isRecurring ? 'border-l-4 border-white' : ''}`,
      style: {
        border: isRecurring ? '1px dashed white' : 'none',
      }
    };
  };

  const EventDetail = ({ event }: { event: CalendarEvent }) => {
    if (!event) return null;
    
    const categoryClass = event.category ? categoryColors[event.category] || 'bg-gray-500' : 'bg-gray-500';
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <Badge className={`${categoryClass} hover:${categoryClass}`}>
              {event.category || 'General'}
            </Badge>
          </div>
          <CardDescription>
            {format(event.start, 'MMMM dd, yyyy')}
            {!event.allDay && ` • ${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {event.isRecurring && (
            <div className="mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805V10a1 1 0 01-2 0V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H16a1 1 0 110 2h-5a1 1 0 01-1-1v-5a1 1 0 112 0v2.5a7.002 7.002 0 01-8.759-3.599 1 1 0 01.767-1.844z" clipRule="evenodd" />
                </svg>
                Recurring Event: {event.recurrencePattern}
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
          {event.slug && (
            <Button asChild>
              <Link href={`/events/${event.slug}`}>View Details</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const isLoading = isLoadingDbEvents || isLoadingCalendarEvents;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold mb-2 sm:mb-0">
          {format(date, 'MMMM yyyy')} Events
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleNavigate('PREV')}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => handleNavigate('TODAY')}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => handleNavigate('NEXT')}>Next</Button>
        </div>
      </div>
      
      {/* Category Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(categoryColors).map(([category, colorClass]) => (
          <Badge key={category} className={`${colorClass} hover:${colorClass}`}>
            {category}
          </Badge>
        ))}
        <Badge variant="outline" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805V10a1 1 0 01-2 0V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H16a1 1 0 110 2h-5a1 1 0 01-1-1v-5a1 1 0 112 0v2.5a7.002 7.002 0 01-8.759-3.599 1 1 0 01.767-1.844z" clipRule="evenodd" />
          </svg>
          Recurring Event
        </Badge>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="h-[600px] overflow-hidden rounded-lg border border-gray-200">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            view={view as any}
            onView={(newView) => setView(newView)}
            date={date}
            onNavigate={() => {}}
            popup
          />
        </div>
      )}
      
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <EventDetail event={selectedEvent} />
        </div>
      )}
    </div>
  );
};

export default SeasonalCalendar;