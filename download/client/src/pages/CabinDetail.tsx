import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Cabin, Testimonial } from "@shared/schema";
import { SEO } from "@/lib/seo";
import { VideoEmbed } from "@/components/VideoEmbed";

const CabinDetail = () => {
  const { slug } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const { data: cabin, isLoading: cabinLoading, error: cabinError } = useQuery({
    queryKey: [`/api/cabins/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: [`/api/cabins/${cabin?.id}/testimonials`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!cabin?.id,
  });

  if (cabinLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
          </div>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
        </div>
      </div>
    );
  }

  if (cabinError || !cabin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4">Cabin Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the cabin you're looking for.</p>
        <Link href="/cabins" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Browse All Cabins
        </Link>
      </div>
    );
  }

  // Combine main image with additional images
  const allImages = [cabin.imageUrl, ...cabin.imageUrls];

  return (
    <>
      <SEO
        title={`${cabin.name} | Texas Hill Country Cabin Rentals`}
        description={cabin.shortDescription}
        canonical={`/cabins/${slug}`}
        type="product"
        image={cabin.imageUrl}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/cabins" className="text-primary hover:text-primary-dark">
              <i className="fas fa-arrow-left mr-2"></i> Back to All Cabins
            </Link>
          </div>
          
          <h1 className="font-heading text-4xl font-bold mb-4">{cabin.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex">
              {[...Array(Math.floor(cabin.rating / 10))].map((_, i) => (
                <i key={i} className="fas fa-star text-accent"></i>
              ))}
              {cabin.rating % 10 >= 5 && <i className="fas fa-star-half-alt text-accent"></i>}
            </div>
            <span>
              {(cabin.rating / 10).toFixed(1)} ({cabin.reviewCount} reviews)
            </span>
            <span className="text-neutral-600">
              <i className="fas fa-map-marker-alt text-secondary mr-1"></i> {cabin.location}
            </span>
          </div>
          
          {/* Image Gallery */}
          <div className="mb-8">
            <div 
              className="h-[500px] rounded-xl overflow-hidden mb-2 bg-cover bg-center"
              style={{ backgroundImage: `url('${allImages[activeImageIndex]}')` }}
            ></div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`h-20 w-20 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all ${index === activeImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={image} alt={`Cabin view ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    <i className="fas fa-bed mr-2 text-secondary"></i> {cabin.bedrooms} Bedroom
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    <i className="fas fa-bath mr-2 text-secondary"></i> {cabin.bathrooms} Bathroom
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    <i className="fas fa-user-friends mr-2 text-secondary"></i> Sleeps {cabin.sleeps}
                  </span>
                </div>
                
                <h2 className="font-heading text-2xl font-bold mb-4">About This Cabin</h2>
                <p className="mb-6 leading-relaxed">{cabin.description}</p>
                
                {cabin.videoUrl && (
                  <div className="mt-8 mb-6">
                    <h3 className="font-heading text-xl font-bold mb-4">Cabin Video Tour</h3>
                    <VideoEmbed url={cabin.videoUrl} title={`${cabin.name} Video Tour`} className="rounded-xl overflow-hidden shadow-md" />
                  </div>
                )}
                
                <h3 className="font-heading text-xl font-bold mb-4">Cabin Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {cabin.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-check-circle text-primary mt-1 mr-2"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Testimonials */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="font-heading text-2xl font-bold mb-6">Guest Reviews</h2>
                
                {testimonialsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : testimonials && testimonials.length > 0 ? (
                  <div className="space-y-6">
                    {testimonials.map((testimonial: Testimonial) => (
                      <div key={testimonial.id} className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex text-accent mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                        <p className="italic mb-3">"{testimonial.review}"</p>
                        <div className="flex justify-between">
                          <span className="font-medium">{testimonial.name}</span>
                          <span className="text-sm text-neutral-600">{testimonial.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews yet for this cabin.</p>
                )}
              </div>
            </div>
            
            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary">${cabin.price}<span className="text-neutral-600 text-lg font-normal"> / night</span></div>
                </div>
                
                <div className="border-t border-b border-neutral-200 py-4 mb-4">
                  <h3 className="font-heading font-bold mb-2">Booking Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Check-in:</span>
                      <span>After 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Check-out:</span>
                      <span>Before 11:00 AM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Min. nights:</span>
                      <span>2 nights</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Max. guests:</span>
                      <span>{cabin.sleeps} guests</span>
                    </li>
                  </ul>
                </div>
                
                <a 
                  href={cabin.bookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex justify-center items-center mb-4"
                >
                  Book Now
                </a>
                
                <p className="text-xs text-center text-neutral-600 mb-6">You'll be redirected to our secure booking platform</p>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h3 className="font-heading font-bold mb-2">Why Stay With Us?</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <i className="fas fa-check text-primary mt-1 mr-2"></i>
                      <span>Prime location in Wimberley</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-primary mt-1 mr-2"></i>
                      <span>5-star rated accommodations</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-primary mt-1 mr-2"></i>
                      <span>Easy contactless check-in</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-primary mt-1 mr-2"></i>
                      <span>Close to Hill Country attractions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related cabins */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">Explore More Cabins</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/cabins" className="bg-neutral-100 rounded-xl p-8 text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-xl text-primary"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Browse All Cabins</h3>
                <p>Find the perfect cabin for your Hill Country getaway</p>
              </Link>
              
              <Link href="/attractions" className="bg-neutral-100 rounded-xl p-8 text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-mountain text-xl text-primary"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Nearby Attractions</h3>
                <p>Discover things to do during your stay</p>
              </Link>
              
              <Link href="/events" className="bg-neutral-100 rounded-xl p-8 text-center transition-transform duration-300 hover:-translate-y-2">
                <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-calendar-alt text-xl text-primary"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Upcoming Events</h3>
                <p>See what's happening during your visit</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CabinDetail;
