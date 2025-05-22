import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Destination } from "@shared/schema";
import { SEO } from "@/lib/seo";

const AllDestinations = () => {
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ['/api/destinations'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <>
      <SEO
        title="Destinations | Texas Hill Country Guide"
        description="Explore charming towns and cities throughout the Texas Hill Country. Discover local attractions, events, and unique experiences in each destination."
        canonical="/destinations"
        type="website"
      />
      
      <div className="relative h-[40vh] min-h-[300px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570639224010-04962102a37a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Hill Country Destinations</h1>
            <p className="text-lg md:text-xl">Explore the charming towns and cities that make the Texas Hill Country a special place to visit.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Discover the Heart of Texas</h2>
          <p className="text-lg">
            The Texas Hill Country is home to a variety of charming communities, each with its own unique character and attractions. 
            From vibrant cities to small artistic towns, you'll find breathtaking landscapes, rich culture, and warm hospitality 
            throughout the region.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load destinations. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations?.map((destination: Destination) => (
              <div 
                key={destination.id}
                className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
              >
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
            ))}
          </div>
        )}
      </div>
      
      {/* Call-to-action */}
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Ready to Explore the Hill Country?</h2>
            <p className="text-lg mb-6">Book your stay at one of our charming cabins in Wimberley and make it your home base for adventure.</p>
            <Link 
              href="/cabins" 
              className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              View Cabin Rentals
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllDestinations;
