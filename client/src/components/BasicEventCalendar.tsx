import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

const BasicEventCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Fetch events data safely
  const { data: eventsData = [] } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Safely type and filter events
  const events = Array.isArray(eventsData) ? eventsData : [];
  
  // Format selected date
  const formattedDate = format(date, 'MMMM d, yyyy');
  
  // Get events for the selected date
  const selectedDateEvents = events.filter(event => {
    try {
      const eventDate = new Date(event.startDate);
      return !isNaN(eventDate.getTime()) && 
        format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    } catch {
      return false;
    }
  });
  
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
            Events on {formattedDate}
          </h3>
          
          {selectedDateEvents.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No events scheduled for this date.</p>
                <p className="text-sm text-gray-400 mt-1">Try selecting another day or browse our featured events.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.shortDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicEventCalendar;