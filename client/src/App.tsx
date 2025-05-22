import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import AllDestinations from "@/pages/AllDestinations";
import DestinationDetail from "@/pages/DestinationDetail";
import AllEvents from "@/pages/AllEvents";
import EventDetail from "@/pages/EventDetail";
import AllAttractions from "@/pages/AllAttractions";
import AttractionDetail from "@/pages/AttractionDetail";
import AllCabins from "@/pages/AllCabins";
import CabinDetail from "@/pages/CabinDetail";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import SeasonalEvents from "@/pages/SeasonalEvents";
import CalendarAndMap from "@/pages/CalendarAndMap";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import TravelAssistant from "@/pages/TravelAssistant";
import TravelQuiz from "@/pages/TravelQuiz";
import TripPlanner from "@/pages/TripPlanner";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import SeasonalContent from "@/pages/admin/SeasonalContent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Destination Routes */}
      <Route path="/destinations" component={AllDestinations} />
      <Route path="/destinations/:slug" component={DestinationDetail} />
      
      {/* Event Routes */}
      <Route path="/events" component={AllEvents} />
      <Route path="/events/:slug" component={EventDetail} />
      <Route path="/seasonal-events" component={SeasonalEvents} />
      <Route path="/calendar-map" component={CalendarAndMap} />
      
      {/* Attraction Routes */}
      <Route path="/attractions" component={AllAttractions} />
      <Route path="/attractions/:slug" component={AttractionDetail} />
      
      {/* Cabin Routes */}
      <Route path="/cabins" component={AllCabins} />
      <Route path="/cabins/:slug" component={CabinDetail} />
      
      {/* Blog Routes */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      
      {/* Other Routes */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/travel-assistant" component={TravelAssistant} />
      <Route path="/quiz" component={TravelQuiz} />
      <Route path="/trip-planner" component={TripPlanner} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/seasonal-content" component={SeasonalContent} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.includes('/admin');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          // Admin pages without site layout
          <>
            <Router />
            <Toaster />
          </>
        ) : (
          // Regular pages with site layout
          <Layout>
            <Router />
            <Toaster />
          </Layout>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
