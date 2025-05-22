import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Workaround for marker icon issue
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type MarkerType = {
  id: string;
  name: string;
  type: "city" | "attraction" | "winery" | "lodging";
  position: [number, number]; // [latitude, longitude]
  description?: string;
};

const hillCountryCenter: [number, number] = [30.3077, -98.8324]; // Center of Texas Hill Country

const MapSection = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const markers: MarkerType[] = [
    { id: "austin", name: "Austin", type: "city", position: [30.2672, -97.7431], description: "The capital city of Texas" },
    { id: "wimberley", name: "Wimberley", type: "city", position: [29.9974, -98.0988], description: "A charming town known for Blue Hole" },
    { id: "fredericksburg", name: "Fredericksburg", type: "city", position: [30.2752, -98.8719], description: "Known for German heritage and wineries" },
    { id: "dripping-springs", name: "Dripping Springs", type: "city", position: [30.1902, -98.0867], description: "The gateway to the Hill Country" },
    
    { id: "blue-hole", name: "Blue Hole", type: "attraction", position: [29.9947, -98.1027], description: "Popular swimming spot with clear waters" },
    { id: "enchanted-rock", name: "Enchanted Rock", type: "attraction", position: [30.5055, -98.8177], description: "Massive pink granite dome" },
    { id: "hamilton-pool", name: "Hamilton Pool", type: "attraction", position: [30.3426, -98.1268], description: "Natural preserve with unique collapsed grotto" },
    
    { id: "wine-trail-1", name: "Hill Country Winery", type: "winery", position: [30.2506, -98.6923], description: "Offers wine tastings with hill country views" },
    { id: "wine-trail-2", name: "Duchman Family Winery", type: "winery", position: [30.1505, -98.0101], description: "Italian varietal wines in a beautiful setting" },
    
    { id: "coyote-cabin", name: "Flite Acres Cabins", type: "lodging", position: [29.9932, -98.1064], description: "Cozy cabins near the Blanco River" },
    { id: "lodge-1", name: "Hill Country Lodge", type: "lodging", position: [30.2685, -98.8702], description: "Rustic accommodations with great views" }
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const filteredMarkers = activeFilter 
    ? markers.filter(marker => marker.type === activeFilter)
    : markers;
    
  // Get the appropriate detail page URL based on marker type
  const getLinkUrl = (marker: MarkerType): string => {
    switch(marker.type) {
      case "city":
        return `/destinations/${marker.id}`;
      case "attraction":
        return `/attractions/${marker.id}`;
      case "winery":
        return `/attractions/${marker.id}`;
      case "lodging":
        return `/cabins/${marker.id}`;
      default:
        return "/";
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">Explore the Hill Country Map</h2>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto">Discover the geography of Texas Hill Country and plan your perfect route.</p>
        </div>
        
        <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-lg p-4">
          <div className="aspect-w-16 aspect-h-9 relative h-[70vh] max-h-[600px] rounded-lg">
            {/* Leaflet Map Container */}
            <MapContainer 
              center={hillCountryCenter} 
              zoom={9} 
              style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Map markers */}
              {filteredMarkers.map((marker) => (
                <Marker 
                  key={marker.id}
                  position={marker.position}
                >
                  <Popup>
                    <div className="max-w-[250px]">
                      <h3 className="font-bold text-lg">{marker.name}</h3>
                      {marker.description && <p className="text-sm text-gray-600 mb-2">{marker.description}</p>}
                      <p className="text-xs mb-2 text-gray-500 italic">Type: {marker.type}</p>
                      
                      {/* Link to detail page based on marker type */}
                      <Button asChild size="sm" className="w-full mt-2">
                        <Link href={getLinkUrl(marker)}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <button 
              className={`${activeFilter === "city" ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"} text-neutral-800 px-4 py-2 rounded shadow transition-colors`}
              onClick={() => handleFilterClick("city")}
            >
              <i className="fas fa-map-marker-alt text-secondary mr-2"></i> Cities
            </button>
            <button 
              className={`${activeFilter === "attraction" ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"} text-neutral-800 px-4 py-2 rounded shadow transition-colors`}
              onClick={() => handleFilterClick("attraction")}
            >
              <i className="fas fa-swimming-pool text-primary mr-2"></i> Attractions
            </button>
            <button 
              className={`${activeFilter === "winery" ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"} text-neutral-800 px-4 py-2 rounded shadow transition-colors`}
              onClick={() => handleFilterClick("winery")}
            >
              <i className="fas fa-wine-glass-alt text-secondary mr-2"></i> Wineries
            </button>
            <button 
              className={`${activeFilter === "lodging" ? "bg-primary text-white" : "bg-white hover:bg-neutral-200"} text-neutral-800 px-4 py-2 rounded shadow transition-colors`}
              onClick={() => handleFilterClick("lodging")}
            >
              <i className="fas fa-home text-primary mr-2"></i> Lodging
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
