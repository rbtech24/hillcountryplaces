import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { SEO } from "@/lib/seo";
import { VideoEmbed } from "@/components/VideoEmbed";

const EventDetail = () => {
  const { slug } = useParams();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: [`/api/events/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the event you're looking for.</p>
        <Link href="/events" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Browse All Events
        </Link>
      </div>
    );
  }

  const startDate = parseISO(event.startDate as unknown as string);
  const endDate = parseISO(event.endDate as unknown as string);
  const formattedDateRange = format(startDate, 'MMMM d') === format(endDate, 'MMMM d')
    ? format(startDate, 'MMMM d, yyyy')
    : `${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d, yyyy')}`;

  // Category badge color
  const categoryColor = 
    event.category === "Festival" ? "bg-primary-light text-white" : 
    event.category === "Music" ? "bg-secondary text-white" : 
    event.category === "Market" ? "bg-accent text-neutral-900" : 
    "bg-neutral-200 text-neutral-800";

  return (
    <>
      <SEO
        title={`${event.name} | Texas Hill Country Events`}
        description={event.shortDescription}
        canonical={`/events/${slug}`}
        type="event"
        image={event.imageUrl}
      />
      
      <div className="relative h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${event.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-10 relative z-10">
          <div className="max-w-3xl text-white">
            <span className={`inline-block ${categoryColor} text-xs px-3 py-1 rounded-full mb-4`}>
              {event.category}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <span><i className="far fa-calendar-alt mr-2"></i>{formattedDateRange}</span>
              <span><i className="fas fa-map-marker-alt mr-2"></i>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="font-heading text-3xl font-bold mb-6">About This Event</h2>
            <p className="mb-6 text-lg leading-relaxed">{event.description}</p>
            
            {event.videoUrl && (
              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold mb-4">Event Preview</h3>
                <VideoEmbed url={event.videoUrl} title={event.name} className="rounded-xl overflow-hidden shadow-md" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold mb-4">Event Details</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="far fa-calendar-alt text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Date:</span><br />
                      {formattedDateRange}
                      {event.isRecurring && (
                        <div className="mt-1 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                            <i className="fas fa-repeat mr-1"></i>
                            Recurring {event.recurrencePattern === 'weekly' ? 'Weekly' : 
                                      event.recurrencePattern === 'monthly' ? 'Monthly' : 
                                      event.recurrencePattern}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Location:</span><br />
                      {event.location}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-tag text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Category:</span><br />
                      {event.category}
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold mb-4">Planning Your Visit</h3>
                <p className="mb-4">Make the most of your visit to this event by staying at one of our charming cabins in Wimberley. The perfect home base for your Hill Country adventure!</p>
                <Link 
                  href="/cabins" 
                  className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  View Cabin Rentals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Related content */}
          <div className="mt-12">
            <h2 className="font-heading text-3xl font-bold mb-6 text-center">Explore More in the Hill Country</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/events" className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">More Events</h3>
                    <p className="text-neutral-700">Discover other exciting events happening in the Texas Hill Country.</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/attractions" className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565938087719-7a82f54471a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">Attractions</h3>
                    <p className="text-neutral-700">Explore the top attractions and activities throughout the region.</p>
                  </div>
                </div>
              </Link>
              
              <Link href={`/destinations/${event.destinationId ? event.destinationId : ''}`} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570639224010-04962102a37a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">Area Guide</h3>
                    <p className="text-neutral-700">Learn more about the destinations in the Texas Hill Country.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
