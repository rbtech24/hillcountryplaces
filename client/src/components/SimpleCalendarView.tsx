import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay, isToday, isSameMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const categoryColors: Record<string, string> = {
  'festival': 'bg-purple-100 text-purple-800',
  'concert': 'bg-blue-100 text-blue-800',
  'foodwine': 'bg-pink-100 text-pink-800',
  'market': 'bg-yellow-100 text-yellow-800',
  'outdoor': 'bg-green-100 text-green-800',
  'cultural': 'bg-indigo-100 text-indigo-800',
  'family': 'bg-teal-100 text-teal-800',
  'holiday': 'bg-red-100 text-red-800',
  'sports': 'bg-orange-100 text-orange-800',
  'art': 'bg-violet-100 text-violet-800',
  'default': 'bg-gray-100 text-gray-800'
};

const SimpleCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Fetch events data
  const { data: eventsData } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Safely handle events data
  const allEvents = Array.isArray(eventsData) ? eventsData : [];
  
  // Get calendar dates for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Calculate calendar rows
  const startDay = getDay(monthStart);
  const blanks = Array(startDay).fill(null);
  const daysWithBlanks = [...blanks, ...days];
  
  // Split days into weeks
  const weeks = [];
  let week = [];
  
  daysWithBlanks.forEach((day, i) => {
    week.push(day);
    if ((i + 1) % 7 === 0 || i === daysWithBlanks.length - 1) {
      weeks.push(week);
      week = [];
    }
  });
  
  // Get events for the selected day
  const selectedDateEvents = allEvents.filter(event => {
    try {
      const eventDate = new Date(event.startDate);
      return !isNaN(eventDate.getTime()) && 
        format(eventDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    } catch (e) {
      return false;
    }
  });
  
  // Event handling
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
  // Get events for a specific day (for highlighting days with events)
  const getEventsForDay = (day: Date | null) => {
    if (!day) return [];
    
    return allEvents.filter(event => {
      try {
        const eventDate = new Date(event.startDate);
        return !isNaN(eventDate.getTime()) && 
          format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      } catch (e) {
        return false;
      }
    });
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{format(currentMonth, dateFormat)}</h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-7 bg-muted/50">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          <div className="bg-white">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 border-t">
                {week.map((day, dayIndex) => {
                  const dayEvents = getEventsForDay(day);
                  const hasEvents = dayEvents.length > 0;
                  const isCurrentDay = day && isToday(day);
                  const isSelected = day && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  const isCurrentMonth = day && isSameMonth(day, currentMonth);
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`p-2 relative min-h-[60px] ${
                        !isCurrentMonth ? 'text-gray-300' : ''
                      } ${isSelected ? 'bg-primary/10' : ''}`}
                      onClick={() => day && onDateClick(day)}
                    >
                      {day ? (
                        <>
                          <div className={`text-center ${
                            isCurrentDay ? 'bg-primary text-white rounded-full w-6 h-6 mx-auto flex items-center justify-center' : ''
                          }`}>
                            {format(day, 'd')}
                          </div>
                          
                          {hasEvents && isCurrentMonth && (
                            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                              <div className="h-1 w-1 rounded-full bg-primary"></div>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:w-1/2">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Events on {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        {selectedDateEvents.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No events scheduled for this date.</p>
              <p className="text-sm text-gray-400 mt-1">Try selecting another day or check our featured events.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((event) => {
              const startTime = new Date(event.startDate);
              const isValidDate = !isNaN(startTime.getTime());
              const category = event.category?.toLowerCase() || 'default';
              const colorClass = categoryColors[category] || categoryColors.default;
              
              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/events/${event.slug}`}>
                      <div className="cursor-pointer">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{event.name}</h4>
                          <Badge className={colorClass}>
                            {event.category || 'Event'}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 text-sm space-y-1 text-gray-600">
                          {isValidDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{format(startTime, 'h:mm a')}</span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.shortDescription}</p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCalendarView;