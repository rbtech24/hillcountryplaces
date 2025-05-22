import React, { useState } from "react";
import { 
  Calendar as CalendarComponent,
  CalendarProps
} from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { Event } from "@shared/schema";

interface EventCalendarProps {
  events: Event[];
  className?: string;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ events, className }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Get all dates that have events, including recurring events
  const eventDates = events.reduce((dates: Record<string, Event[]>, event) => {
    // Make sure we have valid dates before proceeding
    if (!event.startDate || !event.endDate) return dates;
    
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Verify dates are valid before continuing
    if (!isValid(startDate) || !isValid(endDate)) return dates;
    
    // For non-recurring events, just add the start date
    if (!event.isRecurring) {
      const dateStr = format(startDate, "yyyy-MM-dd");
      
      if (!dates[dateStr]) {
        dates[dateStr] = [];
      }
      dates[dateStr].push(event);
    } 
    // For recurring events, add all relevant dates based on pattern
    else {
      // Get current month (for optimization)
      const currentMonth = month.getMonth();
      const currentYear = month.getFullYear();
      
      // Add start date
      const startDateStr = format(startDate, "yyyy-MM-dd");
      if (!dates[startDateStr]) {
        dates[startDateStr] = [];
      }
      dates[startDateStr].push(event);
      
      // Handle different recurrence patterns
      if (event.recurrencePattern === 'weekly') {
        // Add all weeks in the current month view
        const tempDate = new Date(startDate);
        while (tempDate <= endDate) {
          // Only add dates within current month view (optimization)
          if (tempDate.getMonth() === currentMonth && tempDate.getFullYear() === currentYear) {
            const dateStr = format(tempDate, "yyyy-MM-dd");
            if (!dates[dateStr]) {
              dates[dateStr] = [];
            }
            dates[dateStr].push(event);
          }
          
          // Move to next week
          tempDate.setDate(tempDate.getDate() + 7);
        }
      } 
      else if (event.recurrencePattern === 'monthly') {
        // Add the same day of each month
        const dayOfMonth = startDate.getDate();
        const tempDate = new Date(startDate);
        
        while (tempDate <= endDate) {
          // Only add for current month view
          if (tempDate.getMonth() === currentMonth && tempDate.getFullYear() === currentYear) {
            const dateStr = format(tempDate, "yyyy-MM-dd");
            if (!dates[dateStr]) {
              dates[dateStr] = [];
            }
            dates[dateStr].push(event);
          }
          
          // Move to next month (same day)
          tempDate.setMonth(tempDate.getMonth() + 1);
        }
      }
    }
    
    return dates;
  }, {});

  // Get events for the selected date
  const selectedDateEvents = date && isValid(date)
    ? eventDates[format(date, "yyyy-MM-dd")] || []
    : [];

  // Custom rendering for calendar days
  const renderDay = {
    Day: (props: any) => {
      // Safety check for invalid dates
      if (!props.day || !(props.day instanceof Date) || !isValid(props.day)) {
        return <div {...props} className={props.className}>{"?"}</div>;
      }
      
      try {
        const dateStr = format(props.day, "yyyy-MM-dd");
        const dateEvents = eventDates[dateStr] || [];
        const hasEvents = dateEvents.length > 0;
        const hasRecurringEvents = dateEvents.some(event => event.isRecurring);
        
        return (
          <div 
            {...props}
            className={`relative ${props.className} ${hasEvents ? 'font-bold' : ''}`}
          >
            {format(props.day, "d")}
            {hasEvents && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                {/* Regular event indicator */}
                <div 
                  className={`w-1 h-1 ${hasRecurringEvents ? 'bg-secondary' : 'bg-primary'} rounded-full`}
                />
                
                {/* Special indicator for recurring events */}
                {hasRecurringEvents && (
                  <div className="w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
            )}
          </div>
        );
      } catch (error) {
        // Fallback for any unexpected errors
        console.error("Error rendering calendar day:", error);
        return <div {...props} className={props.className}>{"!"}</div>;
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className={className}>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle>Event Calendar</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const prevMonth = new Date(month);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setMonth(prevMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] px-3 gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{isValid(month) ? format(month, "MMMM yyyy") : "Invalid Date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    initialFocus
                    selected={month}
                    onSelect={(date) => date && setMonth(date)}
                    month={month}
                    onMonthChange={setMonth}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const nextMonth = new Date(month);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setMonth(nextMonth);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Browse upcoming events in the Hill Country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border"
            components={renderDay}
          />
          
          {date && isValid(date) && selectedDateEvents.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-medium text-lg">
                Events on {format(date, "MMMM d, yyyy")}
              </h3>
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <div className="p-3 border rounded-md hover:border-primary hover:bg-muted/50 cursor-pointer transition-colors">
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.location} • {
                          isValid(new Date(event.startDate)) 
                            ? format(new Date(event.startDate), "h:mm a") 
                            : "TBD"
                        }
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {date && isValid(date) && selectedDateEvents.length === 0 && (
            <p className="mt-4 text-center text-muted-foreground">
              No events scheduled for this date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};