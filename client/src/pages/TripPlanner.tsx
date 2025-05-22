import React from 'react';
import { TripPlanner as TripPlannerComponent } from '@/components/TripPlanner';
import { SEO } from '@/lib/seo';

const TripPlanner = () => {
  return (
    <>
      <SEO
        title="Interactive Trip Planner | Texas Hill Country Places"
        description="Plan your perfect Texas Hill Country getaway with our customizable trip planner. Choose destinations, activities, and preferences to create your ideal itinerary."
        canonical="/trip-planner"
        type="website"
      />
      
      <div className="relative h-[30vh] min-h-[200px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577351441996-83aa525b0b56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Plan Your Hill Country Adventure</h1>
            <p className="text-lg md:text-xl">Create a custom itinerary tailored to your interests and preferences</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-bold mb-4">Interactive Trip Planner</h2>
            <p>
              Our interactive trip planner helps you design your perfect Texas Hill Country getaway. 
              Select your travel dates, preferred destinations, activities you're interested in, and more. 
              We'll generate a customized day-by-day itinerary that you can save, print, or share with your 
              travel companions.
            </p>
          </div>
          
          <TripPlannerComponent className="mb-10" />
          
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="font-heading text-2xl font-bold mb-4">Trip Planning Tips</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-calendar-alt text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Best Time to Visit</h3>
                <p className="text-gray-600">
                  Spring (March-May) and Fall (September-November) offer the most pleasant temperatures and beautiful 
                  scenery. Summer can be hot but perfect for water activities, while winter provides fewer crowds 
                  and mild temperatures.
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-map-marked-alt text-green-600 text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Getting Around</h3>
                <p className="text-gray-600">
                  A car is essential for exploring the Hill Country's scenic routes and remote attractions. 
                  Consider renting a vehicle with good clearance for rural roads. Many attractions are 
                  30-60 minutes apart, so plan your routes accordingly.
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-suitcase text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Packing Essentials</h3>
                <p className="text-gray-600">
                  Pack layers as temperatures can vary throughout the day. Include sun protection, 
                  comfortable walking shoes, swimming gear (in warm months), and a camera to capture 
                  the stunning landscapes and sunsets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripPlanner;