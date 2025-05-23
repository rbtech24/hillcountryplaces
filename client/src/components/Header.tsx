import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CustomTooltip } from "@/components/ui/custom-tooltip";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-heading font-bold text-2xl text-primary">Texas Hill Country</span>
            <span className="font-accent text-lg text-secondary ml-1">Places</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-4">
            <CustomTooltip 
              content={
                <div className="text-gray-800">
                  <p className="font-medium mb-1">Destinations</p>
                  <p>Explore the beautiful towns and cities of the Texas Hill Country region.</p>
                </div>
              }
            >
              <Link 
                href="/destinations" 
                className={`font-medium text-sm transition-colors duration-200 ${isActive("/destinations") ? "text-primary" : "hover:text-primary"}`}
              >
                Destinations
              </Link>
            </CustomTooltip>
            
            <div className="relative group">
              <CustomTooltip 
                content={
                  <div className="text-gray-800">
                    <p className="font-medium mb-1">Events</p>
                    <p>Discover festivals, concerts, and activities happening throughout the Hill Country.</p>
                  </div>
                }
              >
                <button className={`font-medium text-sm transition-colors duration-200 flex items-center ${
                  isActive("/events") || isActive("/calendar-map") ? "text-primary" : "hover:text-primary"
                }`}>
                  Events <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
              </CustomTooltip>
              <div className="absolute z-[9999] left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link 
                  href="/events" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/events") ? "text-primary" : ""}`}
                >
                  All Events
                </Link>
                <Link 
                  href="/calendar-map" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/calendar-map") ? "text-primary" : ""}`}
                >
                  Calendar & Map
                </Link>
              </div>
            </div>
            
            <CustomTooltip 
              content={
                <div className="text-gray-800">
                  <p className="font-medium mb-1">Attractions</p>
                  <p>Find wineries, hiking trails, swimming holes, and other must-see attractions in the Hill Country.</p>
                </div>
              }
            >
              <Link 
                href="/attractions" 
                className={`font-medium text-sm transition-colors duration-200 ${isActive("/attractions") ? "text-primary" : "hover:text-primary"}`}
              >
                Attractions
              </Link>
            </CustomTooltip>
            
            <CustomTooltip 
              content={
                <div className="text-gray-800">
                  <p className="font-medium mb-1">Cabins</p>
                  <p>Browse rustic retreats, luxury lodges, and cozy cabins for your perfect Hill Country getaway.</p>
                </div>
              }
            >
              <Link 
                href="/cabins" 
                className={`font-medium text-sm transition-colors duration-200 ${isActive("/cabins") ? "text-primary" : "hover:text-primary"}`}
              >
                Cabins
              </Link>
            </CustomTooltip>
            
            <div className="relative group">
              <CustomTooltip 
                content={
                  <div className="text-gray-800">
                    <p className="font-medium mb-1">Plan Your Trip</p>
                    <p>Tools and resources to help you plan the perfect Hill Country vacation.</p>
                  </div>
                }
              >
                <button className={`font-medium text-sm transition-colors duration-200 flex items-center ${
                  isActive("/blog") || isActive("/quiz") || isActive("/travel-assistant") ? "text-primary" : "hover:text-primary"
                }`}>
                  Plan Your Trip <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
              </CustomTooltip>
              <div className="absolute z-[9999] left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link 
                  href="/trip-planner" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/trip-planner") ? "text-primary" : ""}`}
                >
                  <span className="flex items-center">
                    <span>Trip Planner</span>
                    <span className="ml-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                  </span>
                </Link>
                <Link 
                  href="/blog" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/blog") ? "text-primary" : ""}`}
                >
                  Travel Tips
                </Link>
                <Link 
                  href="/quiz" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/quiz") ? "text-primary" : ""}`}
                >
                  <span className="flex items-center">
                    <span>Experience Quiz</span>
                    <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                  </span>
                </Link>
                <Link 
                  href="/travel-assistant" 
                  className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isActive("/travel-assistant") ? "text-primary" : ""}`}
                >
                  <span className="flex items-center">
                    <span>Travel Assistant</span>
                    <span className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                  </span>
                </Link>
              </div>
            </div>
            
            <CustomTooltip 
              content={
                <div className="text-gray-800">
                  <p className="font-medium mb-1">About</p>
                  <p>Learn about Texas Hill Country Places and our mission to showcase this beautiful region.</p>
                </div>
              }
            >
              <Link 
                href="/about" 
                className={`font-medium text-sm transition-colors duration-200 ${isActive("/about") ? "text-primary" : "hover:text-primary"}`}
              >
                About
              </Link>
            </CustomTooltip>
            
            <CustomTooltip 
              content={
                <div className="text-gray-800">
                  <p className="font-medium mb-1">Contact</p>
                  <p>Reach out to us with questions, feedback, or partnership opportunities.</p>
                </div>
              }
            >
              <Link 
                href="/contact" 
                className={`font-medium text-sm transition-colors duration-200 ${isActive("/contact") ? "text-primary" : "hover:text-primary"}`}
              >
                Contact
              </Link>
            </CustomTooltip>
          </nav>
          
          {/* Search Button and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200">
              <i className="fas fa-search text-neutral-800"></i>
            </button>
            <Link href="/cabins" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200">
              Book A Cabin
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl text-neutral-800`}></i>
          </button>
        </div>
        
        {/* Mobile Menu - Slide-out drawer style */}
        <div className={`fixed lg:hidden inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={closeMobileMenu}>
          <div 
            className={`fixed top-0 right-0 w-[280px] sm:w-[350px] h-full bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="font-heading font-bold text-xl text-primary">Menu</span>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/destinations" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200 py-2 border-b border-gray-100">
                Destinations
              </Link>
              
              {/* Mobile Events dropdown */}
              <div className="space-y-2 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Events</span>
                  <button 
                    onClick={() => {
                      const eventsMenu = document.getElementById('mobile-events-menu');
                      eventsMenu?.classList.toggle('hidden');
                    }}
                    className="text-gray-500 hover:text-primary focus:outline-none p-1"
                  >
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                </div>
                <div id="mobile-events-menu" className="hidden pl-4 space-y-3 mt-2">
                  <Link href="/events" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary">
                    All Events
                  </Link>
                  <Link href="/calendar-map" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary">
                    Calendar & Map
                  </Link>
                </div>
              </div>
              
              <Link href="/attractions" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200 py-2 border-b border-gray-100">
                Attractions
              </Link>
              <Link href="/cabins" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200 py-2 border-b border-gray-100">
                Cabins
              </Link>
              
              {/* Mobile Plan Your Trip dropdown */}
              <div className="space-y-2 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Plan Your Trip</span>
                  <button 
                    onClick={() => {
                      const planMenu = document.getElementById('mobile-plan-menu');
                      planMenu?.classList.toggle('hidden');
                    }}
                    className="text-gray-500 hover:text-primary focus:outline-none p-1"
                  >
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                </div>
                <div id="mobile-plan-menu" className="hidden pl-4 space-y-3 mt-2">
                  <Link href="/trip-planner" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary py-1">
                    <span className="flex items-center">
                      <span>Trip Planner</span>
                      <span className="ml-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                    </span>
                  </Link>
                  <Link href="/blog" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary py-1">
                    Travel Tips
                  </Link>
                  <Link href="/quiz" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary py-1">
                    <span className="flex items-center">
                      <span>Experience Quiz</span>
                      <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                    </span>
                  </Link>
                  <Link href="/travel-assistant" onClick={closeMobileMenu} className="block text-gray-600 hover:text-primary py-1">
                    <span className="flex items-center">
                      <span>Travel Assistant</span>
                      <span className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
                    </span>
                  </Link>
                </div>
              </div>
              
              <Link href="/about" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200 py-2 border-b border-gray-100">
                About
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200 py-2 border-b border-gray-100">
                Contact
              </Link>
              
              <div className="pt-4 flex flex-col space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
                <Link 
                  href="/cabins" 
                  onClick={closeMobileMenu} 
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-md transition-colors duration-200 text-center font-medium"
                >
                  Book A Cabin
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
