import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Event } from "@shared/schema";

const EventCard = ({ event }: { event: Event }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const formattedDateRange = startDate.toLocaleDateString() === endDate.toLocaleDateString()
    ? format(startDate, 'MMMM d, yyyy')
    : `${format(startDate, 'MMMM d')}-${format(endDate, 'd, yyyy')}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div 
        className="md:w-1/3 h-48 md:h-auto bg-cover bg-center" 
        style={{ backgroundImage: `url('${event.imageUrl}')` }}
      ></div>
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`inline-block ${
              event.category === 'Festival' ? 'bg-primary-light' : 
              event.category === 'Music' ? 'bg-secondary' : 
              'bg-accent'
            } ${
              event.category === 'Market' ? 'text-neutral-900' : 'text-white'
            } text-xs px-2 py-1 rounded-full mb-2`}>
              {event.category}
            </span>
            <h3 className="font-heading text-xl font-bold">{event.name}</h3>
          </div>
          <div className="text-right">
            <span className="text-sm text-neutral-600">{formattedDateRange}</span>
          </div>
        </div>
        <p className="text-neutral-700 mb-4">{event.shortDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm"><i className="fas fa-map-marker-alt text-secondary mr-1"></i> {event.location}</span>
          <Link href={`/events/${event.slug}`} className="text-primary font-medium hover:text-primary-dark">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      <Skeleton className="md:w-1/3 h-48 md:h-auto" />
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Skeleton className="w-16 h-6 mb-2" />
            <Skeleton className="w-48 h-7" />
          </div>
          <Skeleton className="w-24 h-5" />
        </div>
        <Skeleton className="w-full h-20 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-24 h-5" />
        </div>
      </div>
    </div>
  );
};

const EventsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Sample event dates - would be replaced with actual event data
  const eventDates = [8, 10, 16, 17, 18, 21, 24, 25, 26, 30, 31].map(day => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  });
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
      <h3 className="font-heading text-2xl font-bold mb-4">Events Calendar</h3>
      
      {/* Month Selector */}
      <div className="flex justify-between items-center mb-4">
        <button 
          className="p-2 text-neutral-600 hover:text-primary"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h4 className="font-medium text-lg">{format(currentMonth, 'MMMM yyyy')}</h4>
        <button 
          className="p-2 text-neutral-600 hover:text-primary"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-6">
        {/* Days of Week */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-sm font-medium text-neutral-600 py-2">{day}</div>
        ))}
        
        {/* Calendar days */}
        {Array(monthStart.getDay()).fill(null).map((_, i) => (
          <div key={`empty-start-${i}`} className="py-2 text-neutral-400"></div>
        ))}
        
        {daysInMonth.map(day => {
          const hasEvent = eventDates.some(eventDate => isSameDay(eventDate, day));
          const dayClasses = `py-2 relative ${
            !isSameMonth(day, currentMonth) ? 'text-neutral-400' : 
            isToday(day) ? 'bg-primary-light/10 font-bold rounded' : ''
          }`;
          
          const eventCategory = hasEvent ? 
            (day.getDate() >= 8 && day.getDate() <= 11) ? "Festival" : 
            (day.getDate() >= 16 && day.getDate() <= 18) ? "Music" : "Market"
            : null;
            
          const dotColor = eventCategory === "Festival" ? "bg-primary" : 
                          eventCategory === "Music" ? "bg-secondary" : 
                          "bg-accent";
          
          return (
            <div key={day.toString()} className={dayClasses}>
              {day.getDate()}
              {hasEvent && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 ${dotColor} rounded-full`}></div>
              )}
            </div>
          );
        })}
        
        {Array((7 - ((monthStart.getDay() + daysInMonth.length) % 7)) % 7).fill(null).map((_, i) => (
          <div key={`empty-end-${i}`} className="py-2 text-neutral-400"></div>
        ))}
      </div>
      
      {/* Event Categories */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
          <span className="text-sm">Festivals</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-secondary rounded-full mr-2"></span>
          <span className="text-sm">Music Events</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-accent rounded-full mr-2"></span>
          <span className="text-sm">Markets & Fairs</span>
        </div>
      </div>
      
      <Link href="/events" className="inline-flex items-center text-primary font-medium hover:text-primary-dark">
        View Full Calendar <i className="fas fa-arrow-right ml-2"></i>
      </Link>
    </div>
  );
};

const EventsSection = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/events/featured'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section id="events" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">Upcoming Hill Country Events</h2>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto">
            Discover exciting festivals, concerts, markets, and more happening throughout the Texas Hill Country.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events Calendar Preview */}
          <EventsCalendar />
          
          {/* Featured Events */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              // Display skeletons while loading
              Array(3).fill(0).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))
            ) : error ? (
              // Display error message
              <div className="text-center py-8">
                <p className="text-red-500">Failed to load events. Please try again later.</p>
              </div>
            ) : (
              // Display events
              events?.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
            
            <div className="text-center mt-8">
              <Link 
                href="/events" 
                className="inline-block bg-white hover:bg-neutral-200 text-neutral-800 font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
