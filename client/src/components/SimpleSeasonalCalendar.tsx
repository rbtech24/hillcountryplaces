import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { MapPin, Clock, CalendarIcon } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'festival': 'bg-purple-100 text-purple-800 border-purple-300',
  'concert': 'bg-blue-100 text-blue-800 border-blue-300',
  'foodwine': 'bg-pink-100 text-pink-800 border-pink-300',
  'market': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'outdoor': 'bg-green-100 text-green-800 border-green-300',
  'cultural': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'family': 'bg-teal-100 text-teal-800 border-teal-300',
  'holiday': 'bg-red-100 text-red-800 border-red-300',
  'sports': 'bg-orange-100 text-orange-800 border-orange-300',
  'art': 'bg-violet-100 text-violet-800 border-violet-300',
  'default': 'bg-gray-100 text-gray-800 border-gray-300'
};

const SimpleSeasonalCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Fetch events data
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Format date string for easy comparison
  const selectedDateString = format(date, 'yyyy-MM-dd');
  
  // Filter events for selected date
  const selectedDateEvents = allEvents.filter((event: any) => {
    try {
      const eventDate = new Date(event.startDate);
      // Check if date is valid before formatting
      if (isNaN(eventDate.getTime())) return false;
      
      const eventDateString = format(eventDate, 'yyyy-MM-dd');
      return eventDateString === selectedDateString;
    } catch (e) {
      return false;
    }
  });
  
  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-100 animate-pulse rounded-md w-1/3" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
        </div>
        
        <div className="lg:w-1/2">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Events on {format(date, 'MMMM d, yyyy')}
          </h3>
          
          {selectedDateEvents.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No events scheduled for this date.</p>
                <p className="text-sm text-gray-400 mt-1">Try selecting another day or browsing our upcoming events.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event: any) => {
                const startTime = new Date(event.startDate);
                const isValidDate = !isNaN(startTime.getTime());
                const category = event.category?.toLowerCase() || 'default';
                const colorClass = categoryColors[category] || categoryColors.default;
                
                return (
                  <Card 
                    key={event.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-2 bg-gray-100 text-gray-700">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.name}</h4>
                          <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isValidDate ? format(startTime, 'h:mm a') : 'Time TBA'}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className={colorClass}>
                          {event.category || 'Event'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Event details dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedEvent.name}</DialogTitle>
              <DialogDescription>
                {(() => {
                  try {
                    const eventDate = new Date(selectedEvent.startDate);
                    return !isNaN(eventDate.getTime()) 
                      ? format(eventDate, 'EEEE, MMMM d, yyyy • h:mm a')
                      : 'Date and time to be announced';
                  } catch (e) {
                    return 'Date and time to be announced';
                  }
                })()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedEvent.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-md">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Badge className={categoryColors[selectedEvent.category?.toLowerCase()] || categoryColors.default}>
                  {selectedEvent.category || 'Event'}
                </Badge>
                
                <p className="text-gray-700">{selectedEvent.shortDescription}</p>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowEventDetails(false)}
              >
                Close
              </Button>
              <Button asChild>
                <Link href={`/events/${selectedEvent.slug}`}>
                  View Full Details
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SimpleSeasonalCalendar;