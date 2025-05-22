import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { 
  Destination as DestinationType,
  Attraction as AttractionType, 
  Event as EventType, 
  Cabin as CabinType 
} from '@shared/schema';

interface TripPlannerProps {
  className?: string;
}

interface TripPreferences {
  startDate: string;
  endDate: string;
  tripLength: number;
  location: string;
  interests: string[];
  transportation: string;
  accommodationType: string;
  budget: [number, number];
  groupSize: number;
  includeChildren: boolean;
  includeAccessibility: boolean;
}

interface ItineraryItem {
  id: string;
  type: 'attraction' | 'event' | 'meal' | 'accommodation' | 'activity';
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
  time?: string;
  day: number;
  address?: string;
  url?: string;
  price?: string;
  category?: string;
}

type ItineraryDay = {
  date: string;
  dayNumber: number;
  items: ItineraryItem[];
}

export function TripPlanner({ className = '' }: TripPlannerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('preferences');
  const [showSharing, setShowSharing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [itinerarySaved, setItinerarySaved] = useState(false);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  
  // Initialize preferences with defaults
  const [preferences, setPreferences] = useState<TripPreferences>({
    startDate: '',
    endDate: '',
    tripLength: 3,
    location: 'all',
    interests: [],
    transportation: 'car',
    accommodationType: 'cabin',
    budget: [100, 500],
    groupSize: 2,
    includeChildren: false,
    includeAccessibility: false
  });

  // Mock itinerary data - in a real app, this would be generated from an API call
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  
  // Query destinations
  const { data: destinations = [] } = useQuery<DestinationType[]>({
    queryKey: ['/api/destinations'],
  });
  
  // Query attractions
  const { data: attractions = [] } = useQuery<AttractionType[]>({
    queryKey: ['/api/attractions'],
  });
  
  // Query events
  const { data: events = [] } = useQuery<EventType[]>({
    queryKey: ['/api/events'],
  });
  
  // Query cabins
  const { data: cabins = [] } = useQuery<CabinType[]>({
    queryKey: ['/api/cabins'],
  });
  
  // Available interest options
  const interestOptions = [
    { value: 'wine', label: 'Wine Tasting', iconClass: 'fa-wine-glass-alt' },
    { value: 'hiking', label: 'Hiking & Nature', iconClass: 'fa-hiking' },
    { value: 'shopping', label: 'Shopping', iconClass: 'fa-shopping-bag' },
    { value: 'water', label: 'Water Activities', iconClass: 'fa-water' },
    { value: 'history', label: 'History & Culture', iconClass: 'fa-landmark' },
    { value: 'food', label: 'Food & Dining', iconClass: 'fa-utensils' },
    { value: 'music', label: 'Live Music', iconClass: 'fa-music' },
    { value: 'family', label: 'Family Activities', iconClass: 'fa-child' },
    { value: 'arts', label: 'Arts & Crafts', iconClass: 'fa-paint-brush' },
    { value: 'relaxation', label: 'Relaxation & Wellness', iconClass: 'fa-spa' }
  ];
  
  // Handler for input changes
  const handleInputChange = (field: keyof TripPreferences, value: any) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
  };
  
  // Handler for interest toggle
  const handleInterestToggle = (interest: string) => {
    const currentInterests = [...preferences.interests];
    
    if (currentInterests.includes(interest)) {
      // Remove interest if already selected
      handleInputChange('interests', currentInterests.filter(i => i !== interest));
    } else {
      // Add interest if not already selected
      handleInputChange('interests', [...currentInterests, interest]);
    }
  };
  
  // Handler for budget slider
  const handleBudgetChange = (value: number[]) => {
    setPreferences({
      ...preferences,
      budget: [value[0], value[1]] as [number, number]
    });
  };
  
  // Calculate trip length when dates change
  useEffect(() => {
    if (preferences.startDate && preferences.endDate) {
      const start = new Date(preferences.startDate);
      const end = new Date(preferences.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      handleInputChange('tripLength', diffDays);
    }
  }, [preferences.startDate, preferences.endDate]);
  
  // Generate itinerary based on preferences
  const generateItinerary = () => {
    if (!preferences.startDate || !preferences.endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates for your trip.",
        variant: "destructive",
      });
      return;
    }
    
    if (preferences.interests.length === 0) {
      toast({
        title: "No Interests Selected",
        description: "Please select at least one interest to help us plan your trip.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would make an API call here to generate the itinerary
    // For this demo, we'll create a mock itinerary based on the user's preferences
    
    const startDate = new Date(preferences.startDate);
    const itineraryDays: ItineraryDay[] = [];
    
    // Sample attractions based on interests
    const relevantAttractions = attractions.filter((attraction) => {
      if (preferences.location !== 'all' && attraction.destinationId?.toString() !== preferences.location) {
        return false;
      }
      
      // Simple matching of interests to attraction categories
      const lowercaseCategory = attraction.category?.toLowerCase() || '';
      return preferences.interests.some(interest => 
        lowercaseCategory.includes(interest) || 
        (attraction.description || '').toLowerCase().includes(interest)
      );
    });
    
    // Sample events that match the date range
    const relevantEvents = events.filter((event) => {
      // For events, use startDate instead of date
      const eventDate = event.startDate ? new Date(event.startDate) : null;
      if (!eventDate) return false;
      
      if (preferences.location !== 'all' && event.destinationId?.toString() !== preferences.location) {
        return false;
      }
      
      const tripStart = new Date(preferences.startDate);
      const tripEnd = new Date(preferences.endDate);
      
      return eventDate >= tripStart && eventDate <= tripEnd;
    });
    
    // Get accommodations based on preferences
    const relevantCabins = cabins.filter((cabin) => {
      // For location filtering, use cabin.location since cabins may not have destinationId
      if (preferences.location !== 'all') {
        const matchingDestination = destinations.find(d => d.id.toString() === preferences.location);
        if (matchingDestination && !cabin.location.includes(matchingDestination.name)) {
          return false;
        }
      }
      
      // Filter by price - use the price property from our schema
      const price = cabin.price || 0;
      return price >= preferences.budget[0] && price <= preferences.budget[1];
    });
    
    // Create daily itineraries
    for (let i = 0; i < preferences.tripLength; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long', 
        month: 'long', 
        day: 'numeric'
      });
      
      const dayItems: ItineraryItem[] = [];
      
      // Morning activity
      if (relevantAttractions.length > 0) {
        const morningAttraction = relevantAttractions[i % relevantAttractions.length];
        const location = morningAttraction.destinationId 
          ? destinations.find(d => d.id === morningAttraction.destinationId)?.name 
          : null;
        
        dayItems.push({
          id: `morning-${i}`,
          type: 'attraction',
          title: morningAttraction.name,
          location: location || morningAttraction.location || 'Hill Country',
          description: morningAttraction.description || 'Enjoy this beautiful attraction',
          imageUrl: morningAttraction.imageUrl,
          time: '9:00 AM - 11:30 AM',
          day: i + 1,
          category: morningAttraction.category
        });
      }
      
      // Lunch
      dayItems.push({
        id: `lunch-${i}`,
        type: 'meal',
        title: 'Lunch at Local Restaurant',
        location: preferences.location !== 'all' 
          ? destinations.find(d => d.id.toString() === preferences.location)?.name || 'Hill Country'
          : 'Hill Country',
        description: 'Enjoy lunch at a local restaurant with farm-to-table cuisine',
        time: '12:00 PM - 1:30 PM',
        day: i + 1,
        category: 'dining'
      });
      
      // Afternoon activity or event
      const relevantEvent = relevantEvents.find(event => {
        const eventDate = event.startDate ? new Date(event.startDate) : null;
        if (!eventDate) return false;
        
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      if (relevantEvent) {
        dayItems.push({
          id: `afternoon-${i}`,
          type: 'event',
          title: relevantEvent.name,
          location: destinations.find(d => d.id === relevantEvent.destinationId)?.name || relevantEvent.location || 'Hill Country',
          description: relevantEvent.description || 'Enjoy this special event',
          imageUrl: relevantEvent.imageUrl,
          time: '2:00 PM - 4:30 PM',
          day: i + 1,
          category: relevantEvent.category
        });
      } else if (relevantAttractions.length > 1) {
        const afternoonAttraction = relevantAttractions[(i + 1) % relevantAttractions.length];
        const attractionLocation = afternoonAttraction.destinationId 
          ? destinations.find(d => d.id === afternoonAttraction.destinationId)?.name 
          : null;
          
        dayItems.push({
          id: `afternoon-${i}`,
          type: 'attraction',
          title: afternoonAttraction.name,
          location: attractionLocation || 'Hill Country',
          description: afternoonAttraction.description || 'Enjoy this beautiful attraction',
          imageUrl: afternoonAttraction.imageUrl,
          time: '2:00 PM - 4:30 PM',
          day: i + 1,
          category: afternoonAttraction.category
        });
      }
      
      // Dinner
      dayItems.push({
        id: `dinner-${i}`,
        type: 'meal',
        title: 'Dinner Experience',
        location: preferences.location !== 'all' 
          ? destinations.find(d => d.id.toString() === preferences.location)?.name || 'Hill Country'
          : 'Hill Country',
        description: 'Enjoy dinner at a renowned local restaurant featuring Texas cuisine',
        time: '6:00 PM - 8:00 PM',
        day: i + 1,
        category: 'dining'
      });
      
      // Evening activity if it's not the last day (on last day, people usually pack)
      if (i < preferences.tripLength - 1) {
        if (preferences.interests.includes('music')) {
          dayItems.push({
            id: `evening-${i}`,
            type: 'activity',
            title: 'Live Music',
            location: preferences.location !== 'all' 
              ? destinations.find(d => d.id.toString() === preferences.location)?.name || 'Hill Country'
              : 'Hill Country',
            description: 'Enjoy live music at a local venue featuring Texas country and folk artists',
            time: '8:30 PM - 10:30 PM',
            day: i + 1,
            category: 'entertainment'
          });
        } else if (preferences.interests.includes('wine')) {
          dayItems.push({
            id: `evening-${i}`,
            type: 'activity',
            title: 'Wine Tasting',
            location: preferences.location !== 'all' 
              ? destinations.find(d => d.id.toString() === preferences.location)?.name || 'Hill Country'
              : 'Hill Country',
            description: 'Evening wine tasting featuring local Hill Country vineyards',
            time: '8:30 PM - 10:00 PM',
            day: i + 1,
            category: 'wine'
          });
        }
      }
      
      // Add accommodation for each night except the last
      if (i < preferences.tripLength - 1) {
        if (relevantCabins.length > 0) {
          const cabin = relevantCabins[i % relevantCabins.length];
          dayItems.push({
            id: `accommodation-${i}`,
            type: 'accommodation',
            title: cabin.name,
            location: cabin.location || 'Hill Country',
            description: cabin.description || 'A comfortable cabin for your stay',
            imageUrl: cabin.imageUrl,
            day: i + 1,
            price: `$${cabin.price} per night`,
            category: 'lodging'
          });
        } else {
          dayItems.push({
            id: `accommodation-${i}`,
            type: 'accommodation',
            title: 'Suggested Accommodation',
            location: preferences.location !== 'all' 
              ? destinations.find(d => d.id.toString() === preferences.location)?.name || 'Hill Country'
              : 'Hill Country',
            description: 'A comfortable place to stay for the night',
            day: i + 1,
            category: 'lodging'
          });
        }
      }
      
      itineraryDays.push({
        date: formattedDate,
        dayNumber: i + 1,
        items: dayItems
      });
    }
    
    setItinerary(itineraryDays);
    setItineraryGenerated(true);
    setActiveTab('itinerary');
    
    toast({
      title: "Itinerary Generated",
      description: "Your custom Hill Country itinerary has been created based on your preferences.",
    });
  };
  
  // Save/share itinerary
  const saveItinerary = () => {
    // In a real app, you would send this to your backend
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to save or share your itinerary.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate saving
    setItinerarySaved(true);
    
    toast({
      title: "Itinerary Saved",
      description: `Your itinerary has been saved and ${name ? 'sent to ' + email : 'shared with you'}. Check your email for details.`,
    });
    
    // Reset after saving
    setTimeout(() => {
      setShowSharing(false);
      setEmail('');
      setName('');
      setNotes('');
    }, 1000);
  };
  
  const getItemIcon = (type: string, category?: string) => {
    switch(type) {
      case 'attraction':
        if (category?.toLowerCase().includes('wine')) return 'fa-wine-glass-alt';
        if (category?.toLowerCase().includes('hike') || category?.toLowerCase().includes('nature')) return 'fa-hiking';
        if (category?.toLowerCase().includes('shop')) return 'fa-shopping-bag';
        if (category?.toLowerCase().includes('water')) return 'fa-water';
        if (category?.toLowerCase().includes('history')) return 'fa-landmark';
        return 'fa-map-marker-alt';
      case 'event':
        if (category?.toLowerCase().includes('music')) return 'fa-music';
        if (category?.toLowerCase().includes('food')) return 'fa-utensils';
        if (category?.toLowerCase().includes('festival')) return 'fa-ticket-alt';
        return 'fa-calendar-alt';
      case 'meal':
        return 'fa-utensils';
      case 'accommodation':
        if (preferences.accommodationType === 'cabin') return 'fa-home';
        if (preferences.accommodationType === 'hotel') return 'fa-hotel';
        if (preferences.accommodationType === 'camping') return 'fa-campground';
        return 'fa-bed';
      case 'activity':
        if (category?.toLowerCase().includes('wine')) return 'fa-wine-glass-alt';
        if (category?.toLowerCase().includes('music')) return 'fa-music';
        return 'fa-star';
      default:
        return 'fa-star';
    }
  };
  
  const formatBudget = (value: number) => {
    return `$${value}`;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <h2 className="text-2xl font-heading font-bold">Texas Hill Country Trip Planner</h2>
        <p className="mt-2">Create your perfect Hill Country getaway by customizing your trip preferences.</p>
      </div>
      
      <Tabs defaultValue="preferences" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-6">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto p-1">
            <TabsTrigger value="preferences" className="py-2 data-[state=active]:bg-primary/10">
              <i className="fas fa-sliders-h mr-2"></i>Trip Preferences
            </TabsTrigger>
            <TabsTrigger 
              value="itinerary" 
              className="py-2 data-[state=active]:bg-primary/10"
              disabled={!itineraryGenerated}
            >
              <i className="fas fa-map-marked-alt mr-2"></i>Your Itinerary
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preferences" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Trip Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={preferences.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={preferences.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={preferences.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                {preferences.tripLength > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md text-center text-sm">
                    Trip Duration: <span className="font-medium">{preferences.tripLength} {preferences.tripLength === 1 ? 'day' : 'days'}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location</Label>
                  <Select
                    value={preferences.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hill Country</SelectItem>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id.toString()}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group-size">Group Size</Label>
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleInputChange('groupSize', Math.max(1, preferences.groupSize - 1))}
                    >
                      <i className="fas fa-minus"></i>
                    </Button>
                    <span className="text-xl font-medium w-8 text-center">{preferences.groupSize}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleInputChange('groupSize', preferences.groupSize + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="children" 
                    checked={preferences.includeChildren}
                    onCheckedChange={(checked) => handleInputChange('includeChildren', checked)}
                  />
                  <Label htmlFor="children">Traveling with children</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="accessibility" 
                    checked={preferences.includeAccessibility}
                    onCheckedChange={(checked) => handleInputChange('includeAccessibility', checked)}
                  />
                  <Label htmlFor="accessibility">Need accessibility options</Label>
                </div>
              </div>
              
              <h3 className="text-xl font-medium mt-8 mb-4">Transportation &amp; Lodging</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Transportation Type</Label>
                  <RadioGroup
                    value={preferences.transportation}
                    onValueChange={(value) => handleInputChange('transportation', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="car" id="car" />
                      <Label htmlFor="car" className="cursor-pointer">Car</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rv" id="rv" />
                      <Label htmlFor="rv" className="cursor-pointer">RV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tour" id="tour" />
                      <Label htmlFor="tour" className="cursor-pointer">Tour Bus</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="motorcycle" id="motorcycle" />
                      <Label htmlFor="motorcycle" className="cursor-pointer">Motorcycle</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Accommodation Type</Label>
                  <RadioGroup
                    value={preferences.accommodationType}
                    onValueChange={(value) => handleInputChange('accommodationType', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cabin" id="cabin" />
                      <Label htmlFor="cabin" className="cursor-pointer">Cabin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hotel" id="hotel" />
                      <Label htmlFor="hotel" className="cursor-pointer">Hotel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="camping" id="camping" />
                      <Label htmlFor="camping" className="cursor-pointer">Camping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bnb" id="bnb" />
                      <Label htmlFor="bnb" className="cursor-pointer">B&amp;B</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Daily Budget Range</Label>
                    <span className="text-sm text-gray-500">
                      {formatBudget(preferences.budget[0])} - {formatBudget(preferences.budget[1])}
                    </span>
                  </div>
                  <Slider
                    value={preferences.budget}
                    min={50}
                    max={1000}
                    step={50}
                    onValueChange={handleBudgetChange}
                    className="mt-6"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$50</span>
                    <span>$500</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Interests &amp; Activities</h3>
              <p className="text-gray-600 mb-4">Select the activities and experiences you're interested in for your Hill Country trip.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {interestOptions.map((interest) => (
                  <div 
                    key={interest.value}
                    className={`
                      p-4 rounded-md cursor-pointer transition border-2
                      ${preferences.interests.includes(interest.value) 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'}
                    `}
                    onClick={() => handleInterestToggle(interest.value)}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-10 h-10 flex items-center justify-center rounded-full mr-3
                        ${preferences.interests.includes(interest.value) 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600'}
                      `}>
                        <i className={`fas ${interest.iconClass}`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">{interest.label}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  className="w-full py-6 text-lg"
                  onClick={generateItinerary}
                >
                  <i className="fas fa-magic mr-2"></i>
                  Create My Hill Country Itinerary
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="itinerary" className="p-0">
          {itineraryGenerated && itinerary.length > 0 ? (
            <div>
              <div className="bg-gray-50 p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium">Your Custom Itinerary</h3>
                    <p className="text-gray-600">
                      {preferences.tripLength} days in {preferences.location === 'all' 
                        ? 'Texas Hill Country' 
                        : destinations?.find((d: Destination) => d.id.toString() === preferences.location)?.name || 'Hill Country'}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Dialog open={showSharing} onOpenChange={setShowSharing}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <i className="fas fa-share-alt mr-2"></i>
                          Save &amp; Share
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save or Share Your Itinerary</DialogTitle>
                          <DialogDescription>
                            We'll email your custom Hill Country itinerary so you can access it later or share it with your travel companions.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="share-email">Your Email</Label>
                            <Input
                              id="share-email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="share-name">Your Name (Optional)</Label>
                            <Input
                              id="share-name"
                              placeholder="Your Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="share-notes">Notes (Optional)</Label>
                            <Textarea
                              id="share-notes"
                              placeholder="Add any notes about your trip..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowSharing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveItinerary} disabled={itinerarySaved}>
                            {itinerarySaved ? 'Sent!' : 'Save Itinerary'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" onClick={() => window.print()}>
                      <i className="fas fa-print mr-2"></i>
                      Print
                    </Button>
                    
                    <Button variant="outline" onClick={() => setActiveTab('preferences')}>
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-8">
                  {itinerary.map((day) => (
                    <Card key={day.dayNumber} className="overflow-hidden">
                      <CardHeader className="bg-primary/5 py-4">
                        <CardTitle className="flex justify-between items-center">
                          <span>Day {day.dayNumber}: {day.date}</span>
                          <span className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
                            {preferences.location === 'all' 
                              ? 'Hill Country Adventure' 
                              : destinations?.find((d: Destination) => d.id.toString() === preferences.location)?.name || 'Hill Country'}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {day.items.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50">
                              <div className="flex">
                                <div className="w-16 text-center pt-1">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <i className={`fas ${getItemIcon(item.type, item.category)} text-primary`}></i>
                                  </div>
                                  {item.time && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {item.time}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 ml-4">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-lg">{item.title}</h4>
                                    {item.price && (
                                      <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                                        {item.price}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-2">
                                    <i className="fas fa-map-marker-alt mr-1"></i> {item.location}
                                  </div>
                                  <p className="text-gray-700">{item.description}</p>
                                  
                                  {item.imageUrl && (
                                    <div className="mt-3">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        className="rounded-md w-full max-w-xs h-32 object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-6">
                  <h3 className="text-lg font-medium mb-2">Trip Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Dates</h4>
                      <p>{new Date(preferences.startDate).toLocaleDateString()} - {new Date(preferences.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Group</h4>
                      <p>{preferences.groupSize} {preferences.groupSize === 1 ? 'person' : 'people'}{preferences.includeChildren ? ' (including children)' : ''}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Interests</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {preferences.interests.map(interest => (
                          <span key={interest} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {interestOptions.find(i => i.value === interest)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-gray-600">
                    <p className="text-sm">
                      <i className="fas fa-info-circle mr-1"></i> 
                      This itinerary is a suggestion based on your preferences. All attractions, restaurants, and accommodations
                      should be confirmed before your trip as availability may change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mb-4 text-gray-400">
                <i className="fas fa-map-marked-alt text-6xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
              <p className="text-gray-600 mb-4">Fill out your preferences and generate an itinerary to see your custom Hill Country trip plan.</p>
              <Button onClick={() => setActiveTab('preferences')}>Go to Preferences</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}