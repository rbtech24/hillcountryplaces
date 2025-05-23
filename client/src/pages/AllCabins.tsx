import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Cabin } from "@shared/schema";
import { SEO } from "@/lib/seo";

const CabinCard = ({ cabin }: { cabin: Cabin }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
      <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url('${cabin.imageUrl}')` }}>
        <div className="h-full flex items-end p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
            <span className="text-primary">${cabin.price}</span> / night
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{cabin.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 bg-neutral-100 rounded-full text-xs">
            <i className="fas fa-bed mr-1 text-secondary"></i> {cabin.bedrooms} Bedroom
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-neutral-100 rounded-full text-xs">
            <i className="fas fa-bath mr-1 text-secondary"></i> {cabin.bathrooms} Bath
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-neutral-100 rounded-full text-xs">
            <i className="fas fa-user-friends mr-1 text-secondary"></i> Sleeps {cabin.sleeps}
          </span>
        </div>
        
        <p className="text-neutral-700 mb-4 line-clamp-2">{cabin.shortDescription}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(Math.floor(cabin.rating / 10))].map((_, i) => (
                <i key={i} className="fas fa-star text-accent text-sm"></i>
              ))}
              {cabin.rating % 10 >= 5 && <i className="fas fa-star-half-alt text-accent text-sm"></i>}
            </div>
            <span className="ml-1 text-sm text-neutral-600">({cabin.reviewCount})</span>
          </div>
          <Link href={`/cabins/${cabin.slug}`} className="text-primary font-medium hover:text-primary-dark">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const CabinCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
};

const AllCabins = () => {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split("?")[1] || "");
  
  const { data: cabins, isLoading, error } = useQuery({
    queryKey: ['/api/cabins'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Apply search filtering if query exists
  const searchQuery = query.get("q");
  const filteredCabins = searchQuery 
    ? cabins?.filter((cabin: Cabin) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          cabin.name.toLowerCase().includes(lowerQuery) ||
          cabin.description.toLowerCase().includes(lowerQuery) ||
          cabin.location.toLowerCase().includes(lowerQuery)
        );
      })
    : cabins;

  return (
    <>
      <SEO
        title="Cabin Rentals | Texas Hill Country Guide"
        description="Book your perfect cabin getaway in Wimberley and the Texas Hill Country. Cozy accommodations with easy access to local attractions."
        canonical="/cabins"
        type="website"
      />
      
      <div className="relative h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Experience Flite Acres Cabins</h1>
            <p className="text-xl md:text-2xl">Enjoy a peaceful retreat in our charming cabins nestled in the natural beauty of Wimberley, Texas.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Your Hill Country Getaway</h2>
          <p className="text-lg">
            Our cozy cabins offer the perfect blend of rustic charm and modern comfort, set in the heart of Wimberley.
            Each cabin is thoughtfully designed to provide a relaxing retreat after a day of exploring the Texas Hill Country.
            With convenient access to local attractions, restaurants, and outdoor activities, our cabins are ideal for couples
            and small families looking to experience the natural beauty and hospitality of the region.
          </p>
        </div>
        
        <div className="bg-neutral-100 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-home text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold mb-2">Comfortable Cabins</h3>
              <p className="text-sm">Cozy, well-appointed cabins with all the comforts of home</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-map-marker-alt text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold mb-2">Prime Location</h3>
              <p className="text-sm">Minutes from Wimberley Square and local attractions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-star text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold mb-2">5-Star Experience</h3>
              <p className="text-sm">Consistently rated 5 stars by our satisfied guests</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-tree text-2xl text-primary"></i>
              </div>
              <h3 className="font-heading font-bold mb-2">Natural Setting</h3>
              <p className="text-sm">Peaceful surroundings with beautiful Hill Country views</p>
            </div>
          </div>
        </div>
        
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">Our Cabins</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, index) => (
              <CabinCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load cabins. Please try again later.</p>
          </div>
        ) : filteredCabins?.length === 0 ? (
          <div className="text-center py-12 bg-neutral-100 rounded-xl">
            <h3 className="font-heading text-xl font-bold mb-2">No Cabins Found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCabins?.map((cabin: Cabin) => (
              <CabinCard key={cabin.id} cabin={cabin} />
            ))}
          </div>
        )}
      </div>
      
      {/* Testimonials section */}
      <div className="bg-neutral-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-10 text-center">What Our Guests Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex text-accent mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="italic mb-4">"Very clean little cabin with just enough space for 2. Close to town and far enough away to enjoy the quiet. I would definitely recommend and stay here again."</p>
              <div className="border-t border-neutral-200 pt-4">
                <p className="font-medium">Amy N.</p>
                <p className="text-sm text-neutral-600">May 2025</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex text-accent mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="italic mb-4">"Just the right amount of space for a couples getaway! Close to everything you need but still feels far from the hustle and bustle. Sitting out by the chiminea at night up under the stars was our favorite part!"</p>
              <div className="border-t border-neutral-200 pt-4">
                <p className="font-medium">McNeal's</p>
                <p className="text-sm text-neutral-600">March 2025</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex text-accent mb-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="italic mb-4">"Beautiful and relaxing, peaceful atmosphere. We will highly recommend this place to anyone we know. Cabin was very clean and more than what we expected. Thank you for allowing us to spend our Honeymoon staying in such a Beautiful place."</p>
              <div className="border-t border-neutral-200 pt-4">
                <p className="font-medium">Harry & Scottie G.</p>
                <p className="text-sm text-neutral-600">August 2022</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCabins;
