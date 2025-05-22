import { Link } from "wouter";
import { SEO } from "@/lib/seo";

const About = () => {
  return (
    <>
      <SEO
        title="About Us | Texas Hill Country Guide"
        description="Learn about our mission to showcase the best of the Texas Hill Country and provide exceptional cabin experiences in Wimberley."
        canonical="/about"
        type="website"
      />
      
      <div className="relative h-[40vh] min-h-[300px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://pixabay.com/get/g5456258b3967d7e9fdf08c3bcb6f19db474ede9c748b383966f3bb104ff2ec6c63f0a3d6c387ce3e994a5e874ee2954ba51147642411ec371257b15f604f53c3_1280.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg md:text-xl">Discover the story behind our passion for the Texas Hill Country</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6 text-center">Our Story</h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Welcome to Texas Hill Country Guide, your comprehensive resource for exploring the stunning 
                Texas Hill Country region. Our journey began with a simple love for the rolling landscapes, 
                charming towns, and vibrant culture that define this special part of Texas.
              </p>
              
              <p>
                What started as a personal passion for sharing the beauty of the Hill Country has grown into a 
                mission to connect visitors with authentic experiences throughout the region. From the tranquil 
                swimming holes of Wimberley to the vibrant music scene of Austin, we believe that the Texas Hill 
                Country offers something truly special for every type of traveler.
              </p>
              
              <p>
                As proud owners of Cabins at Flite Acres in Wimberley, we've had the privilege of welcoming 
                guests to experience the natural beauty and warm hospitality of the Hill Country firsthand. 
                Our collection of thoughtfully designed cabins provides the perfect home base for exploring 
                all that the region has to offer.
              </p>
              
              <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-map-marked-alt text-primary text-xl"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">Local Expertise</h3>
                  <p className="text-sm">Over 15 years of experience sharing the Hill Country's best-kept secrets</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-home text-primary text-xl"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">Quality Accommodations</h3>
                  <p className="text-sm">Meticulously maintained cabins designed for comfort and relaxation</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-heart text-primary text-xl"></i>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">Passion for Service</h3>
                  <p className="text-sm">Dedicated to creating memorable experiences for every guest</p>
                </div>
              </div>
              
              <p>
                Through this website, we aim to provide visitors with comprehensive information about destinations, 
                events, attractions, and accommodations throughout the Texas Hill Country. Whether you're planning 
                a weekend getaway, a family vacation, or a special celebration, we're here to help you discover 
                the perfect Hill Country experience.
              </p>
              
              <p>
                We invite you to explore our guide, discover new adventures, and experience the beauty and charm 
                of the Texas Hill Country for yourself. And when you're ready to visit, we hope to welcome you to 
                one of our cozy cabins in Wimberley.
              </p>
            </div>
          </div>
          
          <div className="bg-neutral-100 rounded-xl p-8 mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6 text-center">Our Mission</h2>
            
            <p className="text-center mb-8">
              To showcase the natural beauty, cultural richness, and warm hospitality of the Texas Hill Country while 
              providing exceptional accommodations that allow visitors to fully experience the magic of the region.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-heading font-bold text-xl mb-4">For Our Visitors</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Provide accurate, comprehensive information about the region</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Highlight authentic experiences that showcase local culture</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Create comfortable, memorable accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Offer personalized recommendations for every type of traveler</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-heading font-bold text-xl mb-4">For Our Community</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Support local businesses and artisans</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Promote sustainable tourism practices</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Preserve the natural beauty and resources of the Hill Country</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                    <span>Contribute to the economic vitality of the region</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold mb-6">Ready to Experience the Hill Country?</h2>
            <p className="text-lg mb-8">
              Browse our cabins in Wimberley and start planning your perfect Hill Country getaway today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/cabins" 
                className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                View Our Cabins
              </Link>
              <Link 
                href="/contact" 
                className="bg-secondary hover:bg-secondary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
