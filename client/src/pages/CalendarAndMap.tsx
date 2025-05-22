import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SeasonalCalendar from '../components/SeasonalCalendar';
import CalendarMap from '../components/CalendarMap';
import NewsletterSignup from '../components/NewsletterSignup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { CalendarClock, MapPin, Filter, Calendar, FilterX } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, addMonths, subMonths } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CalendarAndMap = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 3));

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Events Calendar & Map | Texas Hill Country</title>
        <meta name="description" content="Explore Texas Hill Country events with our interactive calendar and map. Find upcoming festivals, concerts, outdoor activities, and more throughout the region." />
        <meta property="og:title" content="Events Calendar & Map | Texas Hill Country" />
        <meta property="og:description" content="Explore Texas Hill Country events with our interactive calendar and map. Find upcoming festivals, concerts, outdoor activities, and more throughout the region." />
        <meta property="og:image" content="/images/og-events-calendar.jpg" />
        <meta property="og:url" content="/calendar-map" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Hill Country Events</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Discover upcoming events across the Texas Hill Country with our interactive calendar and map.
            Featuring real-time data from Google Calendar and our own curated events database.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/events">
              View All Events
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarClock size={18} />
              <span className="hidden sm:inline">Calendar View</span>
              <span className="sm:hidden">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin size={18} />
              <span className="hidden sm:inline">Map View</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Filters Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <CardTitle>Filter Events</CardTitle>
              </div>
              {(selectedCategory !== 'all' || startDate > new Date() || endDate < addMonths(new Date(), 3)) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1 text-gray-500 hover:text-primary"
                  onClick={() => {
                    setSelectedCategory('all');
                    setStartDate(new Date());
                    setEndDate(addMonths(new Date(), 3));
                  }}
                >
                  <FilterX className="h-4 w-4" />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>
            <CardDescription>
              Refine events by category and date range to find exactly what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Event Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="festival">Festivals</SelectItem>
                    <SelectItem value="concert">Concerts</SelectItem>
                    <SelectItem value="foodwine">Food & Wine</SelectItem>
                    <SelectItem value="market">Markets</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && date >= startDate && setEndDate(date)}
                      disabled={(date) => date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Active Filters */}
            {(selectedCategory !== 'all' || startDate > new Date() || endDate < addMonths(new Date(), 3)) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </Badge>
                )}
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  Date: {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <TabsContent value="calendar" className="mt-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <h2 className="text-2xl font-semibold mb-2">Seasonal Calendar</h2>
              <p className="text-gray-600">
                Navigate through months to see all upcoming events. Click on any event for details.
                Events with a dashed border are recurring events.
              </p>
            </div>
            <div className="p-4">
              <SeasonalCalendar 
                selectedCategory={selectedCategory}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="map" className="mt-0">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <h2 className="text-2xl font-semibold mb-2">Interactive Event Map</h2>
              <p className="text-gray-600">
                Explore events geographically across the Texas Hill Country region.
                Click on markers to see event details. Colors indicate different event categories.
              </p>
            </div>
            <div className="p-4">
              <CalendarMap 
                selectedCategory={selectedCategory}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Calendar Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Color-coded events by category</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Special indicators for recurring events</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Google Calendar integration</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Map Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Colored markers by event category</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Interactive map popups with event details</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>See events from Google Calendar on the map</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Popular Categories</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="justify-start bg-purple-50 hover:bg-purple-100 border-purple-200">
              Festivals
            </Button>
            <Button variant="outline" className="justify-start bg-blue-50 hover:bg-blue-100 border-blue-200">
              Concerts
            </Button>
            <Button variant="outline" className="justify-start bg-green-50 hover:bg-green-100 border-green-200">
              Outdoor
            </Button>
            <Button variant="outline" className="justify-start bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
              Markets
            </Button>
          </div>
        </div>
      </div>
      
      {/* Newsletter Signup Section */}
      <div className="mt-8">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default CalendarAndMap;