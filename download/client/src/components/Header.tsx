import { useState } from "react";
import { Link, useLocation } from "wouter";

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
            <span className="font-accent text-lg text-secondary ml-1">Guide</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/destinations" 
              className={`font-medium transition-colors duration-200 ${isActive("/destinations") ? "text-primary" : "hover:text-primary"}`}
            >
              Destinations
            </Link>
            <Link 
              href="/events" 
              className={`font-medium transition-colors duration-200 ${isActive("/events") ? "text-primary" : "hover:text-primary"}`}
            >
              Events
            </Link>
            <Link 
              href="/calendar-map" 
              className={`font-medium transition-colors duration-200 ${isActive("/calendar-map") ? "text-primary" : "hover:text-primary"}`}
            >
              Events Calendar & Map
            </Link>
            <Link 
              href="/attractions" 
              className={`font-medium transition-colors duration-200 ${isActive("/attractions") ? "text-primary" : "hover:text-primary"}`}
            >
              Attractions
            </Link>
            <Link 
              href="/cabins" 
              className={`font-medium transition-colors duration-200 ${isActive("/cabins") ? "text-primary" : "hover:text-primary"}`}
            >
              Cabins
            </Link>
            <Link 
              href="/blog" 
              className={`font-medium transition-colors duration-200 ${isActive("/blog") ? "text-primary" : "hover:text-primary"}`}
            >
              Travel Tips
            </Link>
            <Link 
              href="/travel-assistant" 
              className={`font-medium transition-colors duration-200 ${isActive("/travel-assistant") ? "text-primary" : "hover:text-primary"}`}
            >
              <span className="flex items-center">
                <span className="mr-1">Travel Assistant</span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
              </span>
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-colors duration-200 ${isActive("/about") ? "text-primary" : "hover:text-primary"}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition-colors duration-200 ${isActive("/contact") ? "text-primary" : "hover:text-primary"}`}
            >
              Contact
            </Link>
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
        
        {/* Mobile Menu */}
        <div className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <nav className="flex flex-col py-4 space-y-4">
            <Link href="/destinations" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Destinations
            </Link>
            <Link href="/events" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Events
            </Link>
            <Link href="/calendar-map" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Events Calendar & Map
            </Link>
            <Link href="/attractions" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Attractions
            </Link>
            <Link href="/cabins" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Cabins
            </Link>
            <Link href="/blog" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Travel Tips
            </Link>
            <Link href="/travel-assistant" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              <span className="flex items-center">
                <span className="mr-1">Travel Assistant</span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">AI</span>
              </span>
            </Link>
            <Link href="/about" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" onClick={closeMobileMenu} className="font-medium hover:text-primary transition-colors duration-200">
              Contact
            </Link>
            <div className="flex items-center pt-2">
              <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200">
                <i className="fas fa-search text-neutral-800"></i>
              </button>
              <Link href="/cabins" onClick={closeMobileMenu} className="ml-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200">
                Book A Cabin
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
