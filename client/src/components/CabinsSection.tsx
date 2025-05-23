import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Cabin, Testimonial } from "@shared/schema";

const CabinFeatures = () => {
  const features = [
    "Private, peaceful settings in Wimberley",
    "Fully equipped kitchens for home-cooked meals",
    "Comfortable king or queen beds with quality linens",
    "Outdoor spaces with seating and grills",
    "Minutes from Wimberley Square and attractions",
    "Perfect for couples and small families",
    "High cleanliness standards",
    "Easy self check-in process"
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg p-6 h-full">
        <h3 className="font-heading text-2xl font-bold mb-4">Cabin Features</h3>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="p-4 bg-primary/10 rounded-lg mb-6">
          <div className="flex items-center mb-2">
            <i className="fas fa-award text-primary mr-2"></i>
            <h4 className="font-bold">Guest Favorite</h4>
          </div>
          <p className="text-sm">Our cabins consistently receive 5-star reviews for cleanliness, comfort, and location.</p>
        </div>
        
        <Link 
          href="/cabins" 
          className="inline-block w-full bg-primary hover:bg-primary-dark text-white font-medium text-center py-3 rounded-lg transition-colors duration-200"
        >
          View All Cabins
        </Link>
      </div>
    </div>
  );
};

const CabinShowcase = ({ cabin }: { cabin: Cabin }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div 
        className="h-72 bg-cover bg-center relative" 
        style={{ backgroundImage: `url('${cabin.imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star text-accent"></i>
              ))}
            </div>
            <span className="text-white">({cabin.reviewCount} reviews)</span>
          </div>
          <h3 className="font-heading text-2xl text-white font-bold">{cabin.name}</h3>
        </div>
      </div>
      
      <div className="p-6">
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
          <span className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-sm">
            <i className="fas fa-map-marker-alt mr-2 text-secondary"></i> {cabin.location}
          </span>
        </div>
        
        <p className="mb-6">{cabin.shortDescription}</p>
        
        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {cabin.imageUrls.map((imageUrl, index) => (
            <div 
              key={index}
              className="h-24 bg-cover bg-center rounded-lg" 
              style={{ backgroundImage: `url('${imageUrl}')` }}
            ></div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-primary">${cabin.price}</span>
            <span className="text-neutral-600"> / night</span>
          </div>
          <a 
            href={cabin.bookingUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
};

const OtherCabinCard = ({ cabin }: { cabin: Cabin }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div 
        className="h-40 sm:h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url('${cabin.imageUrl}')` }}
      ></div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
          <h3 className="font-heading text-base sm:text-lg font-bold">{cabin.name.replace('Cabins at Flite Acres - ', 'Experience Flite Acres - ')}</h3>
          <div className="flex items-center">
            <i className="fas fa-star text-accent text-xs sm:text-sm"></i>
            <span className="ml-1 text-xs sm:text-sm">{(cabin.rating / 10).toFixed(1)} ({cabin.reviewCount})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-neutral-100 rounded-full text-xs">
            <i className="fas fa-bed mr-1 text-secondary text-xs"></i> {cabin.bedrooms} Bedroom
          </span>
          <span className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-neutral-100 rounded-full text-xs">
            <i className="fas fa-user-friends mr-1 text-secondary text-xs"></i> Sleeps {cabin.sleeps}
          </span>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-bold text-primary text-sm sm:text-base">${cabin.price}<span className="text-neutral-600 text-xs sm:text-sm font-normal"> / night</span></span>
          <Link href={`/cabins/${cabin.slug}`} className="text-primary text-sm font-medium hover:text-primary-dark px-3 py-1 rounded-md hover:bg-primary-50 transition-colors">
            View Cabin
          </Link>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="flex text-accent">
          {[...Array(testimonial.rating)].map((_, i) => (
            <i key={i} className="fas fa-star text-sm sm:text-base"></i>
          ))}
        </div>
      </div>
      <p className="italic text-sm sm:text-base mb-4 sm:mb-6 flex-grow">"{testimonial.review}"</p>
      <div className="flex justify-between items-center border-t border-neutral-200 pt-3 sm:pt-4 mt-auto">
        <span className="font-medium text-sm sm:text-base">{testimonial.name}</span>
        <span className="text-xs sm:text-sm text-neutral-600">{testimonial.date}</span>
      </div>
    </div>
  );
};

const CabinSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div className="lg:col-span-1">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-72 w-full rounded-xl mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

const TestimonialsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  );
};

const CabinsSection = () => {
  const { data: cabins, isLoading: cabinsLoading } = useQuery({
    queryKey: ['/api/cabins/featured'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const featuredCabin = cabins?.find((cabin: Cabin) => cabin.slug === 'coyote-cabin');
  const otherCabins = cabins?.filter((cabin: Cabin) => cabin.slug !== 'coyote-cabin') || [];

  return (
    <section id="cabins" className="py-10 sm:py-12 md:py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Experience Flite Acres Cabins</h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-800 max-w-3xl mx-auto px-2">
            Enjoy a peaceful retreat in our charming cabins nestled in the natural beauty of Wimberley, Texas.
          </p>
        </div>
        
        {/* Cabins Overview */}
        {cabinsLoading ? (
          <CabinSectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            <CabinFeatures />
            
            <div className="lg:col-span-2">
              {/* Cabin Showcase */}
              {featuredCabin && <CabinShowcase cabin={featuredCabin} />}
              
              {/* More Cabins */}
              {otherCabins.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  {otherCabins.map((cabin: Cabin) => (
                    <OtherCabinCard key={cabin.id} cabin={cabin} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Testimonials */}
        <div className="mt-10 sm:mt-12 md:mt-16">
          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">What Our Guests Say</h3>
          
          {testimonialsLoading ? (
            <TestimonialsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials?.map((testimonial: Testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CabinsSection;
