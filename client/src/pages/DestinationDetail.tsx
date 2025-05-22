import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Destination, Event, Attraction } from "@shared/schema";
import { SEO } from "@/lib/seo";
import { VideoEmbed } from "@/components/VideoEmbed";

const DestinationDetail = () => {
  const { slug } = useParams();
  
  const { data: destination, isLoading: destinationLoading, error: destinationError } = useQuery({
    queryKey: [`/api/destinations/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: [`/api/destinations/${destination?.id}/events`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!destination?.id,
  });
  
  const { data: attractions, isLoading: attractionsLoading } = useQuery({
    queryKey: [`/api/destinations/${destination?.id}/attractions`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!destination?.id,
  });

  if (destinationLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (destinationError || !destination) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Destination Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the destination you're looking for.</p>
        <Link href="/destinations" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          View All Destinations
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${destination.name} - Texas Hill Country Guide`}
        description={destination.shortDescription}
        canonical={`/destinations/${slug}`}
        type="article"
        image={destination.imageUrl}
      />
      
      <div className="relative h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${destination.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <p className="text-xl md:text-2xl">{destination.shortDescription}</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6">About {destination.name}</h2>
            <p className="mb-4">{destination.description}</p>
            
            {destination.videoUrl && (
              <div className="mt-8">
                <h3 className="font-heading text-2xl font-bold mb-4">{destination.name} Video Tour</h3>
                <VideoEmbed url={destination.videoUrl} title={`${destination.name} Video Tour`} className="rounded-xl overflow-hidden shadow-md" />
              </div>
            )}
          </div>
          
          {/* Events Section */}
          <div className="mb-16">
            <h2 className="font-heading text-3xl font-bold mb-6">Events in {destination.name}</h2>
            
            {eventsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : events && events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event: Event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                    <div 
                      className="md:w-1/4 h-48 md:h-auto bg-cover bg-center" 
                      style={{ backgroundImage: `url('${event.imageUrl}')` }}
                    ></div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading text-xl font-bold">{event.name}</h3>
                        <span className="text-sm text-neutral-600">
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-neutral-700 mb-4">{event.shortDescription}</p>
                      <Link href={`/events/${event.slug}`} className="text-primary font-medium hover:text-primary-dark">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-8">
                  <Link href="/events" className="inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium px-6 py-2 rounded-lg transition-colors">
                    View All Events
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 bg-neutral-100 rounded-lg">No upcoming events in {destination.name}.</p>
            )}
          </div>
          
          {/* Attractions Section */}
          <div className="mb-16">
            <h2 className="font-heading text-3xl font-bold mb-6">Top Attractions in {destination.name}</h2>
            
            {attractionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : attractions && attractions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((attraction: Attraction) => (
                  <div key={attraction.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div 
                      className="h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url('${attraction.imageUrl}')` }}
                    ></div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold mb-2">{attraction.name}</h3>
                      <p className="text-neutral-700 mb-4 line-clamp-3">{attraction.shortDescription}</p>
                      <Link href={`/attractions/${attraction.slug}`} className="text-primary font-medium hover:text-primary-dark">
                        Learn More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 bg-neutral-100 rounded-lg">No attractions listed for {destination.name} yet.</p>
            )}
            
            <div className="text-center mt-8">
              <Link href="/attractions" className="inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium px-6 py-2 rounded-lg transition-colors">
                View All Attractions
              </Link>
            </div>
          </div>
          
          {/* Call-to-action for cabins */}
          <div className="bg-neutral-100 rounded-xl p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Stay in {destination.name}</h2>
            <p className="mb-6">Looking for the perfect place to stay during your visit to {destination.name}? Check out our selection of charming cabins in the Texas Hill Country.</p>
            <Link href="/cabins" className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors">
              Browse Cabins
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetail;
