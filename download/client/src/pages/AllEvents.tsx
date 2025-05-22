import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse, isAfter, isBefore, parseISO } from "date-fns";
import { Event } from "@shared/schema";
import { SEO } from "@/lib/seo";
import { EventCalendar } from "@/components/EventCalendar";

const categoryColors = {
  "Festival": "bg-primary-light text-white",
  "Music": "bg-secondary text-white",
  "Market": "bg-accent text-neutral-900",
  "default": "bg-neutral-200 text-neutral-800"
};

const AllEvents = () => {
  const [location, setLocation] = useLocation();
  const query = new URLSearchParams(location.split("?")[1] || "");
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['/api/events'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const today = new Date();
    
    let start: Date | null = null;
    let end: Date | null = null;
    
    switch (value) {
      case "this-month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "next-month":
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        break;
      case "three-months":
        start = today;
        end = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        break;
      default:
        // All events or reset
        break;
    }
    
    setDateRange({ start, end });
  };
  
  const filteredEvents = events?.filter((event: Event) => {
    // Filter by category if selected
    if (selectedCategory && event.category !== selectedCategory) {
      return false;
    }
    
    // Filter by date range if set
    if (dateRange.start || dateRange.end) {
      const eventStart = parseISO(event.startDate as unknown as string);
      const eventEnd = parseISO(event.endDate as unknown as string);
      
      if (dateRange.start && isAfter(dateRange.start, eventEnd)) {
        return false;
      }
      
      if (dateRange.end && isBefore(dateRange.end, eventStart)) {
        return false;
      }
    }
    
    // Check if there's a search query
    const searchQuery = query.get("q");
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    return true;
  });

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  return (
    <>
      <SEO
        title="Events | Texas Hill Country Guide"
        description="Discover upcoming events, festivals, concerts, and gatherings throughout the Texas Hill Country. Find the perfect event for your visit."
        canonical="/events"
        type="website"
      />
      
      <div className="relative h-[40vh] min-h-[300px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Hill Country Events</h1>
            <p className="text-lg md:text-xl">Discover exciting festivals, concerts, markets, and more happening throughout the Texas Hill Country.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
              <h2 className="font-heading text-2xl font-bold mb-4">Find Events</h2>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <label htmlFor="category-filter" className="block mb-2 font-medium">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {["Festival", "Music", "Market"].map(category => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category 
                            ? getCategoryColor(category)
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="date-filter" className="block mb-2 font-medium">Date Range</label>
                  <select
                    id="date-filter"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={handleDateFilterChange}
                  >
                    <option value="">All Dates</option>
                    <option value="this-month">This Month</option>
                    <option value="next-month">Next Month</option>
                    <option value="three-months">Next 3 Months</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Events List */}
            <div className="space-y-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-xl" />
            ))
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load events. Please try again later.</p>
            </div>
          ) : filteredEvents?.length === 0 ? (
            <div className="text-center py-12 bg-neutral-100 rounded-xl">
              <h3 className="font-heading text-xl font-bold mb-2">No Events Found</h3>
              <p>Try adjusting your filters or check back later for new events.</p>
            </div>
          ) : (
            filteredEvents?.map((event: Event) => {
              const startDate = parseISO(event.startDate as unknown as string);
              const endDate = parseISO(event.endDate as unknown as string);
              const formattedDateRange = format(startDate, 'MMMM d') === format(endDate, 'MMMM d')
                ? format(startDate, 'MMMM d, yyyy')
                : `${format(startDate, 'MMMM d')}-${format(endDate, 'd, yyyy')}`;
                
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                  <div 
                    className="md:w-1/3 h-64 md:h-auto bg-cover bg-center" 
                    style={{ backgroundImage: `url('${event.imageUrl}')` }}
                  ></div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`inline-block ${getCategoryColor(event.category)} text-xs px-2 py-1 rounded-full mb-2`}>
                          {event.category}
                        </span>
                        <h3 className="font-heading text-2xl font-bold">{event.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-neutral-600">{formattedDateRange}</span>
                      </div>
                    </div>
                    <p className="text-neutral-700 mb-6">{event.shortDescription}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm"><i className="fas fa-map-marker-alt text-secondary mr-1"></i> {event.location}</span>
                      <Link href={`/events/${event.slug}`} className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
            </div>
          </div>
          
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            {!isLoading && events && (
              <EventCalendar events={events} className="sticky top-4" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEvents;
