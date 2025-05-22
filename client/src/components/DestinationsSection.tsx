import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Destination } from "@shared/schema";

const DestinationCard = ({ destination }: { destination: Destination }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div 
        className="h-64 bg-cover bg-center" 
        style={{ backgroundImage: `url('${destination.imageUrl}')` }}
      ></div>
      <div className="p-6">
        <h3 className="font-heading text-2xl font-bold mb-2">{destination.name}</h3>
        <p className="mb-4">{destination.shortDescription}</p>
        <Link 
          href={`/destinations/${destination.slug}`} 
          className="inline-flex items-center text-primary font-medium hover:text-primary-dark"
        >
          Explore {destination.name} <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
};

const DestinationCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
};

const DestinationsSection = () => {
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ['/api/destinations/featured'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section id="destinations" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">Explore Hill Country Destinations</h2>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto">
            Discover charming towns and cities nestled throughout the stunning Texas Hill Country landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Display skeletons while loading
            Array(6).fill(0).map((_, index) => (
              <DestinationCardSkeleton key={index} />
            ))
          ) : error ? (
            // Display error message
            <div className="col-span-full text-center py-8">
              <p className="text-red-500">Failed to load destinations. Please try again later.</p>
            </div>
          ) : (
            // Display destinations
            destinations?.map((destination: Destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/destinations" 
            className="inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
