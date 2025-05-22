/**
 * This file contains utility functions and constants for the application
 */

// Default meta image
export const DEFAULT_META_IMAGE = "https://images.unsplash.com/photo-1570639224010-04962102a37a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

// Helper functions for formatting
export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(price);
};

// Return a star rating display based on a 0-50 rating
export const getStarRating = (rating: number) => {
  const fullStars = Math.floor(rating / 10);
  const halfStar = rating % 10 >= 5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return {
    fullStars,
    halfStar,
    emptyStars,
    displayRating: (rating / 10).toFixed(1)
  };
};

// Common category colors
export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "Festival": "bg-primary-light text-white",
    "Music": "bg-secondary text-white",
    "Market": "bg-accent text-neutral-900",
    "Outdoor Adventures": "bg-primary text-white",
    "Wine & Spirits": "bg-secondary text-white",
    "Natural Wonders": "bg-primary-light text-white",
    "Shopping": "bg-accent text-neutral-900",
    "Art & Culture": "bg-secondary text-white",
    "default": "bg-neutral-200 text-neutral-800"
  };
  
  return categoryColors[category] || categoryColors.default;
};

// Hill Country regions for filtering or categorization
export const HILL_COUNTRY_REGIONS = [
  "Central",
  "Eastern",
  "Western",
  "Northern",
  "Southern"
];

// Common cabin amenities
export const CABIN_AMENITIES = [
  "Air Conditioning", 
  "WiFi",
  "Fully Equipped Kitchen",
  "Outdoor Seating",
  "Grill",
  "Fireplace",
  "TV/Streaming",
  "Coffee Maker",
  "Washer/Dryer",
  "Pet Friendly",
  "Pool Access",
  "Hot Tub"
];

// List of main Hill Country towns for navigation
export const HILL_COUNTRY_TOWNS = [
  { name: "Wimberley", slug: "wimberley" },
  { name: "Austin", slug: "austin" },
  { name: "New Braunfels", slug: "new-braunfels" },
  { name: "Fredericksburg", slug: "fredericksburg" },
  { name: "Dripping Springs", slug: "dripping-springs" },
  { name: "Johnson City", slug: "johnson-city" },
  { name: "San Marcos", slug: "san-marcos" },
];

// Features of the cabins at Flite Acres
export const CABIN_FEATURES = [
  "Private, peaceful settings in Wimberley",
  "Fully equipped kitchens for home-cooked meals",
  "Comfortable king or queen beds with quality linens",
  "Outdoor spaces with seating and grills",
  "Minutes from Wimberley Square and attractions",
  "Perfect for couples and small families",
  "High cleanliness standards",
  "Easy self check-in process"
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  pinterest: "#"
};

// Contact information
export const CONTACT_INFO = {
  address: "3 Palos Verdes Drive, Wimberley, TX 78676",
  phone: "512-551-0939",
  email: "info@hillcountrypremier.com",
  hours: {
    weekday: "9:00 AM - 5:00 PM",
    saturday: "10:00 AM - 3:00 PM",
    sunday: "Closed"
  }
};
