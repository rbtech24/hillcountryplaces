import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBox from "./SearchBox";

const HeroSection = () => {
  const [heroImage, setHeroImage] = useState("/images/hill-country-sunset.jpg");
  
  // Fetch hero image from site settings using React Query
  const { data: heroImageSetting } = useQuery({
    queryKey: ['/api/site-settings/heroImage'],
    queryFn: async () => {
      const response = await fetch("/api/site-settings/heroImage");
      if (!response.ok) {
        throw new Error("Failed to fetch hero image setting");
      }
      return response.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 60000 // 1 minute
  });
  
  // Update hero image when the setting changes
  useEffect(() => {
    if (heroImageSetting?.value) {
      setHeroImage(heroImageSetting.value);
    }
  }, [heroImageSetting]);
  
  return (
    <section className="relative h-[70vh] min-h-[500px] sm:h-[80vh] sm:min-h-[600px] bg-neutral-800">
      {/* Hero background image - Texas Hill Country */}
      <div 
        className="absolute inset-0 bg-center bg-cover" 
        style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: "center bottom" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="w-full max-w-2xl text-white text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            Discover the Beauty of Texas Hill Country
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-light">
            Explore scenic towns, outdoor adventures, and charming accommodations in the heart of Texas.
          </p>
          
          <SearchBox />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
