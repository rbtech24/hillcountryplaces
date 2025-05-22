import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/lib/seo";
import { VideoEmbed } from "@/components/VideoEmbed";

const AttractionDetail = () => {
  const { slug } = useParams();
  
  const { data: attraction, isLoading, error } = useQuery({
    queryKey: [`/api/attractions/${slug}`],
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
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
        </div>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Attraction Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the attraction you're looking for.</p>
        <Link href="/attractions" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Browse All Attractions
        </Link>
      </div>
    );
  }

  const fullStars = Math.floor(attraction.rating / 10);
  const halfStar = attraction.rating % 10 >= 5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      <SEO
        title={`${attraction.name} | Texas Hill Country Attractions`}
        description={attraction.shortDescription}
        canonical={`/attractions/${slug}`}
        type="article"
        image={attraction.imageUrl}
      />
      
      <div className="relative h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${attraction.imageUrl}')` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-10 relative z-10">
          <div className="max-w-3xl text-white">
            <span className="inline-block bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-full mb-4 text-sm">
              {attraction.category}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">{attraction.name}</h1>
            <div className="flex items-center gap-2 text-lg">
              <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                  <i key={`full-${i}`} className="fas fa-star text-accent"></i>
                ))}
                {halfStar && <i className="fas fa-star-half-alt text-accent"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                  <i key={`empty-${i}`} className="far fa-star text-accent"></i>
                ))}
              </div>
              <span className="ml-1">
                {(attraction.rating / 10).toFixed(1)} ({attraction.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="font-heading text-3xl font-bold mb-6">About {attraction.name}</h2>
            <p className="mb-6 text-lg leading-relaxed">{attraction.description}</p>
            
            {attraction.videoUrl && (
              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold mb-4">Video Showcase</h3>
                <VideoEmbed url={attraction.videoUrl} title={attraction.name} className="rounded-xl overflow-hidden shadow-md" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold mb-4">Key Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Location:</span><br />
                      {attraction.location}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-tag text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Category:</span><br />
                      {attraction.category}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-star text-primary mt-1 mr-3"></i>
                    <div>
                      <span className="font-medium">Rating:</span><br />
                      {(attraction.rating / 10).toFixed(1)} out of 5 ({attraction.reviewCount} reviews)
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold mb-4">Planning Your Visit</h3>
                <p className="mb-4">Make the most of your visit to {attraction.name} by staying at one of our charming cabins in Wimberley. The perfect home base for your Hill Country adventure!</p>
                <Link 
                  href="/cabins" 
                  className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  View Cabin Rentals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Nearby attractions */}
          <div className="mt-12">
            <h2 className="font-heading text-3xl font-bold mb-6 text-center">More To Explore</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/attractions" className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://pixabay.com/get/g2964f5ff9bb5a6ea70b9af65056443edc4d2d41dbbfe921c8cd0959453f04eeb9dc30875bbb3de952c0b0397762848325555e76cda77a9887699370a74432df9_1280.jpg')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">More Attractions</h3>
                    <p className="text-neutral-700">Discover other amazing places to visit in the Texas Hill Country.</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/events" className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">Upcoming Events</h3>
                    <p className="text-neutral-700">Find events happening in the area during your visit.</p>
                  </div>
                </div>
              </Link>
              
              <Link href={`/destinations/${attraction.destinationId ? attraction.destinationId : ''}`} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570639224010-04962102a37a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=300')" }}></div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">Area Guide</h3>
                    <p className="text-neutral-700">Learn more about the area surrounding this attraction.</p>
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

export default AttractionDetail;
