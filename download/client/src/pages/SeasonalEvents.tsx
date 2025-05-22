import React from 'react';
import { Helmet } from 'react-helmet';
import SeasonalCalendar from '../components/SeasonalCalendar';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const SeasonalEvents = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Hill Country Event Calendar</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Discover upcoming events, festivals, and happenings throughout the Texas Hill Country region.
            Our calendar combines our curated events with Google Calendar integration for the most comprehensive
            listing of Hill Country activities.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/events">
              <PlusCircle size={18} />
              View All Events
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-primary/5">
            <h2 className="text-2xl font-semibold mb-2">Seasonal Calendar</h2>
            <p className="text-gray-600">
              Navigate through months to see all upcoming events. Click on any event for details.
              Events with a dashed border are recurring events.
            </p>
          </div>
          <div className="p-4">
            <SeasonalCalendar />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Calendar Features</h3>
            <ul className="space-y-2">
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
                <span>Google Calendar integration for up-to-date listings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Click on any event for detailed information</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Popular Event Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start bg-purple-50 hover:bg-purple-100 border-purple-200">
                Wine & Food
              </Button>
              <Button variant="outline" className="justify-start bg-blue-50 hover:bg-blue-100 border-blue-200">
                Music & Arts
              </Button>
              <Button variant="outline" className="justify-start bg-green-50 hover:bg-green-100 border-green-200">
                Outdoor & Recreation
              </Button>
              <Button variant="outline" className="justify-start bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
                General Events
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Our seasonal calendar includes events from across the Hill Country region, 
                integrated with Google Calendar for the most up-to-date listing of local happenings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalEvents;