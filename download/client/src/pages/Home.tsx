import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import EventsSection from "@/components/EventsSection";
import AttractionsSection from "@/components/AttractionsSection";
import CabinsSection from "@/components/CabinsSection";
import MapSection from "@/components/MapSection";
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
      <DestinationsSection />
      <EventsSection />
      <AttractionsSection />
      <CabinsSection />
      <MapSection />
    </>
  );
};

export default Home;
