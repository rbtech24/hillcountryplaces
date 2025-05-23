import { Link } from "wouter";
import NewsletterSection from "./NewsletterSection";

const Footer = () => {
  return (
    <>
      <NewsletterSection />
      
      <footer className="bg-neutral-800 text-white pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            {/* About */}
            <div className="mb-2 sm:mb-0">
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 md:mb-4">Texas Hill Country Guide</h3>
              <p className="text-neutral-300 text-sm sm:text-base mb-4">Your comprehensive resource for exploring the beautiful Texas Hill Country region. Discover destinations, events, attractions, and lodging options.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-white hover:text-accent transition-colors text-lg sm:text-xl">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors text-lg sm:text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors text-lg sm:text-xl">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white hover:text-accent transition-colors text-lg sm:text-xl">
                  <i className="fab fa-pinterest"></i>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="mb-2 sm:mb-0">
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 md:mb-4">Quick Links</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-neutral-300 text-sm sm:text-base">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/calendar-map" className="hover:text-white transition-colors">Calendar & Map</Link></li>
                <li><Link href="/attractions" className="hover:text-white transition-colors">Attractions</Link></li>
                <li><Link href="/cabins" className="hover:text-white transition-colors">Cabins</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Top Destinations */}
            <div className="mb-2 sm:mb-0">
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 md:mb-4">Top Destinations</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-neutral-300 text-sm sm:text-base">
                <li><Link href="/destinations/wimberley" className="hover:text-white transition-colors">Wimberley</Link></li>
                <li><Link href="/destinations/austin" className="hover:text-white transition-colors">Austin</Link></li>
                <li><Link href="/destinations/new-braunfels" className="hover:text-white transition-colors">New Braunfels</Link></li>
                <li><Link href="/destinations/fredericksburg" className="hover:text-white transition-colors">Fredericksburg</Link></li>
                <li><Link href="/destinations/dripping-springs" className="hover:text-white transition-colors">Dripping Springs</Link></li>
                <li><Link href="/destinations/johnson-city" className="hover:text-white transition-colors">Johnson City</Link></li>
                <li><Link href="/destinations/san-marcos" className="hover:text-white transition-colors">San Marcos</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-3 md:mb-4">Contact Us</h3>
              <ul className="space-y-3 text-neutral-300 text-sm sm:text-base">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-secondary"></i>
                  <span>123 Hill Country Way<br/>Austin, TX 78701</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-3 text-secondary"></i>
                  <span>512-555-1234</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-secondary"></i>
                  <span>info@hillcountryplaces.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-neutral-700 mb-6 sm:mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-xs sm:text-sm text-center md:text-left mb-4 md:mb-0">&copy; {new Date().getFullYear()} Texas Hill Country Guide. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
