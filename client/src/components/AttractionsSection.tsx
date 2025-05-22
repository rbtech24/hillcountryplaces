import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Attraction } from "@shared/schema";

const categories = [
  "All",
  "Outdoor Adventures",
  "Wine & Spirits",
  "Natural Wonders",
  "Shopping",
  "Art & Culture"
];

const AttractionCard = ({ attraction }: { attraction: Attraction }) => {
  const fullStars = Math.floor(attraction.rating / 10);
  const halfStar = attraction.rating % 10 >= 5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="h-60 bg-cover bg-center relative" style={{ backgroundImage: `url('${attraction.imageUrl}')` }}>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-sm font-medium text-primary">{attraction.location}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{attraction.name}</h3>
        <p className="text-neutral-700 mb-4">{attraction.shortDescription}</p>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
              <i key={`full-${i}`} className="fas fa-star text-accent"></i>
            ))}
            {halfStar && <i className="fas fa-star-half-alt text-accent"></i>}
            {[...Array(emptyStars)].map((_, i) => (
              <i key={`empty-${i}`} className="far fa-star text-accent"></i>
            ))}
            <span className="ml-2 text-sm text-neutral-600">
              {(attraction.rating / 10).toFixed(1)} ({attraction.reviewCount} reviews)
            </span>
          </span>
          <Link href={`/attractions/${attraction.slug}`} className="text-primary font-medium hover:text-primary-dark">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const AttractionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <Skeleton className="h-60 w-full" />
      <div className="p-6">
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

const AttractionsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: attractions, isLoading, error } = useQuery({
    queryKey: ['/api/attractions/featured'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const filteredAttractions = activeCategory === "All" 
    ? attractions 
    : attractions?.filter((attraction: Attraction) => attraction.category === activeCategory);

  return (
    <section id="attractions" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">Top Hill Country Attractions</h2>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto">
            Explore the best activities, natural wonders, and must-visit places throughout the Texas Hill Country.
          </p>
        </div>
        
        {/* Categories Nav */}
        <div className="flex flex-wrap justify-center mb-10 gap-4">
          {categories.map(category => (
            <button
              key={category}
              className={`px-6 py-2 ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              } rounded-full font-medium transition-colors`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Display skeletons while loading
            Array(6).fill(0).map((_, index) => (
              <AttractionCardSkeleton key={index} />
            ))
          ) : error ? (
            // Display error message
            <div className="col-span-full text-center py-8">
              <p className="text-red-500">Failed to load attractions. Please try again later.</p>
            </div>
          ) : filteredAttractions?.length === 0 ? (
            // Display message when no attractions in category
            <div className="col-span-full text-center py-8">
              <p>No attractions found in this category.</p>
            </div>
          ) : (
            // Display attractions
            filteredAttractions?.map((attraction: Attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/attractions" 
            className="inline-block bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View All Attractions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AttractionsSection;
