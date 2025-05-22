import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import AttractionsSection from "@/components/AttractionsSection";
import CabinsSection from "@/components/CabinsSection";
import MapSection from "@/components/MapSection";
import { WeatherWidget } from "@/components/WeatherWidget";
import { SEO } from "@/lib/seo";

const Home = () => {
  return (
    <>
      <SEO
        title="Texas Hill Country Guide | Events, Activities & Cabin Rentals"
        description="Discover the beauty of Texas Hill Country. Find events, attractions, and activities in Wimberley, Austin, New Braunfels and more. Book your perfect cabin getaway at Flite Acres."
        canonical="/"
        type="website"
      />
      
      <HeroSection />
      
      {/* Weather Widget and Trip Planning Section */}
      <div className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="w-full lg:w-2/3">
            <h2 className="font-heading text-3xl font-bold mb-6">Plan Your Visit</h2>
            <p className="mb-4">
              The Texas Hill Country offers beautiful weather throughout the year. Check current conditions
              and forecasts to help plan your perfect trip to this stunning region.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <i className="fas fa-calendar-alt text-blue-600"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg">Best Times to Visit</h3>
                </div>
                <p className="text-gray-600">Spring (March-May) brings wildflower blooms and pleasant temperatures. Fall (September-November) offers mild weather and beautiful foliage. Summers are hot but perfect for water activities.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <i className="fas fa-hiking text-green-600"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg">Outdoor Activities</h3>
                </div>
                <p className="text-gray-600">Plan outdoor adventures based on weather conditions. From hiking and biking to swimming in natural springs, each season offers unique opportunities to enjoy the Hill Country landscape.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <i className="fas fa-glass-cheers text-purple-600"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg">Seasonal Events</h3>
                </div>
                <p className="text-gray-600">Check our calendar for seasonal events like wine festivals, rodeos, and music performances. Many Hill Country towns host special events throughout the year that showcase local culture.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    <i className="fas fa-map-marked-alt text-orange-600"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg">Day Trip Routes</h3>
                </div>
                <p className="text-gray-600">Explore our suggested day trip routes through the Hill Country. From wine trails to scenic drives, these curated itineraries help you make the most of your visit regardless of the weather.</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <WeatherWidget defaultLocation="austin" className="h-full sticky top-24" />
            
            <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-heading font-bold text-lg mb-3">Weather Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <i className="fas fa-umbrella mr-2 text-blue-500"></i>
                  <span>Flash flood alerts common in spring</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-sun mr-2 text-yellow-500"></i>
                  <span>UV index highest from 10am-4pm</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-temperature-high mr-2 text-red-500"></i>
                  <span>Summer temperatures can exceed 100°F</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-snowflake mr-2 text-blue-300"></i>
                  <span>Winter occasionally brings light freezes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <DestinationsSection />
      <EventsSection />
      <AttractionsSection />
      <CabinsSection />
      <MapSection />
    </>
  );
};

export default Home;
