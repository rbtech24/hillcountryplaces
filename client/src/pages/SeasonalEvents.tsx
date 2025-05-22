import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SimpleCalendarView from '../components/SimpleCalendarView';
import SeasonalFilter from '../components/SeasonalFilter';
import SeasonalFeaturedEvents from '../components/SeasonalFeaturedEvents';
import SeasonalActivities from '../components/SeasonalActivities';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarDays, MapPin } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const SeasonalEvents = () => {
  const [selectedSeason, setSelectedSeason] = useState('spring');

  // Get current season based on date for initial state
  const getCurrentSeason = (): string => {
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Seasonal Events Calendar | Texas Hill Country</title>
        <meta name="description" content="Browse our seasonal events calendar for upcoming festivals, concerts, outdoor activities, and more throughout the Texas Hill Country region." />
        <meta property="og:title" content="Seasonal Events Calendar | Texas Hill Country" />
        <meta property="og:description" content="Browse our seasonal events calendar for upcoming festivals, concerts, outdoor activities, and more throughout the Texas Hill Country region." />
        <meta property="og:image" content="/images/og-events-calendar.jpg" />
        <meta property="og:url" content="/seasonal-events" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Seasonal Hill Country Events</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Discover the best of the Texas Hill Country in every season. From vibrant spring wildflowers and summer river activities 
            to fall harvest festivals and winter light trails, there's something to enjoy year-round.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/events">
              <PlusCircle size={18} />
              View All Events
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/calendar-map">
              <MapPin size={18} />
              Calendar & Map
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Seasonal Filter */}
      <SeasonalFilter 
        selectedSeason={selectedSeason} 
        onSeasonChange={setSelectedSeason} 
      />
      
      {/* Featured Events for Selected Season */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured Events</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/events">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </Button>
        </div>
        <SeasonalFeaturedEvents season={selectedSeason} limit={3} />
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="mb-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="text-base py-3">
            <CalendarDays size={18} className="mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="activities" className="text-base py-3">
            <i className="fas fa-hiking mr-2"></i>
            Seasonal Activities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Seasonal Calendar</CardTitle>
              <CardDescription>
                Check out our interactive calendar and map to find events throughout the Hill Country.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CalendarDays className="h-16 w-16 text-primary/70 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">View Events Calendar</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Our interactive calendar and map feature shows all upcoming events in the {selectedSeason} season and throughout the Hill Country.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/calendar-map">
                      <MapPin className="mr-2 h-4 w-4" /> Calendar & Map
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/events">
                      <PlusCircle className="mr-2 h-4 w-4" /> All Events
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-green-700" />
                    </div>
                    <h4 className="font-medium mb-2">Interactive Map</h4>
                    <p className="text-sm text-gray-600">See all events plotted on an interactive map of the Hill Country</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <CalendarDays className="h-6 w-6 text-blue-700" />
                    </div>
                    <h4 className="font-medium mb-2">Date Filtering</h4>
                    <p className="text-sm text-gray-600">Filter events by date range to plan your perfect Hill Country visit</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-tag text-xl text-purple-700"></i>
                    </div>
                    <h4 className="font-medium mb-2">Category Filters</h4>
                    <p className="text-sm text-gray-600">Find events by category: festivals, concerts, markets, and more</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-6">
          <SeasonalActivities season={selectedSeason} />
        </TabsContent>
      </Tabs>
      
      {/* Seasonal Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <i className="fas fa-umbrella-beach text-green-600 mr-2"></i>
              Visiting Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Book accommodations 2-3 months in advance for popular events</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Weather can change quickly - check forecasts before trips</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Distances between towns can be significant - plan driving time</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <i className="fas fa-calendar-check text-blue-600 mr-2"></i>
              Event Features
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-blue-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Color-coded events with intuitive category system</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-blue-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Special indicators for recurring events</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-blue-200 p-1 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">Click on any event to view complete details and location</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <i className="fas fa-map-marked-alt text-purple-600 mr-2"></i>
              Plan Your Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <p className="text-sm text-gray-700">
              Create a custom itinerary with our Trip Planner to make the most of your Hill Country visit.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/trip-planner">Trip Planner</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/calendar-map">Events Map</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeasonalEvents;