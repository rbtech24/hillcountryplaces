import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Attraction } from "@shared/schema";
import { SEO } from "@/lib/seo";

const categories = [
  "All",
  "Outdoor Adventures",
  "Wine & Spirits",
  "Natural Wonders",
  "Shopping",
  "Art & Culture"
];

const AllAttractions = () => {
  const [location, setLocation] = useLocation();
  const query = new URLSearchParams(location.split("?")[1] || "");
  
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const { data: attractions, isLoading, error } = useQuery({
    queryKey: ['/api/attractions'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const searchQuery = query.get("q");
  
  const filteredAttractions = attractions?.filter((attraction: Attraction) => {
    // First filter by category
    if (activeCategory !== "All" && attraction.category !== activeCategory) {
      return false;
    }
    
    // Then filter by search query if exists
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        attraction.name.toLowerCase().includes(lowerQuery) ||
        attraction.description.toLowerCase().includes(lowerQuery) ||
        attraction.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    return true;
  });

  return (
    <>
      <SEO
        title="Attractions | Texas Hill Country Guide"
        description="Discover the best attractions, things to do, and places to visit in the Texas Hill Country. Natural wonders, outdoor adventures, wineries, and more."
        canonical="/attractions"
        type="website"
      />
      
      <div className="relative h-[40vh] min-h-[300px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://pixabay.com/get/g3b1b7aefaaa1da18c8bc8b457bba600a325f3b5f471f5e0c04c29705e124a22bc40b230ea61dd54f1220c552f84dd3d98bc6e208c47a9dc771c0e90bf2724fdf_1280.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Hill Country Attractions</h1>
            <p className="text-lg md:text-xl">Explore the best activities, natural wonders, and must-visit places throughout the Texas Hill Country.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Categories Nav */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {categories.map(category => (
            <button
              key={category}
              className={`px-6 py-2 ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              } rounded-full font-medium transition-colors`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Attractions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(9).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load attractions. Please try again later.</p>
          </div>
        ) : filteredAttractions?.length === 0 ? (
          <div className="text-center py-12 bg-neutral-100 rounded-xl">
            <h3 className="font-heading text-xl font-bold mb-2">No Attractions Found</h3>
            <p>Try changing your category selection or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions?.map((attraction: Attraction) => {
              const fullStars = Math.floor(attraction.rating / 10);
              const halfStar = attraction.rating % 10 >= 5;
              const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
              
              return (
                <div 
                  key={attraction.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="h-60 bg-cover bg-center relative" style={{ backgroundImage: `url('${attraction.imageUrl}')` }}>
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-sm font-medium text-primary">{attraction.location}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold mb-2">{attraction.name}</h3>
                    <p className="text-neutral-700 mb-4 line-clamp-3">{attraction.shortDescription}</p>
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
                          {(attraction.rating / 10).toFixed(1)} ({attraction.reviewCount})
                        </span>
                      </span>
                      <Link 
                        href={`/attractions/${attraction.slug}`} 
                        className="text-primary font-medium hover:text-primary-dark"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Call-to-action */}
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">Plan Your Hill Country Adventure</h2>
            <p className="text-lg mb-6">Make Wimberley your home base and explore all these amazing attractions from the comfort of our cozy cabins.</p>
            <Link 
              href="/cabins" 
              className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllAttractions;
