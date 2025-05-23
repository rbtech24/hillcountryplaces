import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, contactFormSchema, newsletterSignupSchema } from "@shared/schema";
import { uploadSingleImage } from "./upload";
import path from "path";
import { fileURLToPath } from 'url';
import { fetchCalendarEvents, formatCalendarEvents } from './googleCalendar';
import { sendCalendarUpdateNotification } from './email';
import { chatWithTravelAssistant } from './openai';
import { getWeatherData } from './weather';
import { 
  getAllSeasons, 
  getSeasonById, 
  createSeason, 
  updateSeason, 
  deleteSeason,
  getAllSeasonalActivities,
  getSeasonalActivityById,
  getSeasonalActivitiesBySeasonId,
  createSeasonalActivity,
  updateSeasonalActivity,
  deleteSeasonalActivity,
  initializeSeasonalData
} from './seasonal';

// Get current directory path (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Root endpoint for health checks
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "OK", message: "Texas Hill Country API is running" });
  });
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
  
  // API routes - prefix with /api
  
  // Destinations routes
  app.get("/api/destinations", async (_req: Request, res: Response) => {
    const destinations = await storage.getAllDestinations();
    res.json(destinations);
  });
  
  app.get("/api/destinations/featured", async (_req: Request, res: Response) => {
    const destinations = await storage.getFeaturedDestinations();
    res.json(destinations);
  });
  
  app.get("/api/destinations/:slug", async (req: Request, res: Response) => {
    const destination = await storage.getDestinationBySlug(req.params.slug);
    
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    res.json(destination);
  });
  
  // Events routes
  app.get("/api/events", async (_req: Request, res: Response) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });
  
  app.get("/api/events/featured", async (_req: Request, res: Response) => {
    const events = await storage.getFeaturedEvents();
    res.json(events);
  });
  
  app.get("/api/events/upcoming", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const events = await storage.getUpcomingEvents(limit);
    res.json(events);
  });
  
  app.get("/api/events/:slug", async (req: Request, res: Response) => {
    const event = await storage.getEventBySlug(req.params.slug);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  });
  
  app.get("/api/destinations/:destinationId/events", async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    const events = await storage.getEventsByDestination(destinationId);
    res.json(events);
  });
  
  // Attractions routes
  app.get("/api/attractions", async (_req: Request, res: Response) => {
    const attractions = await storage.getAllAttractions();
    res.json(attractions);
  });
  
  app.get("/api/attractions/featured", async (_req: Request, res: Response) => {
    const attractions = await storage.getFeaturedAttractions();
    res.json(attractions);
  });
  
  app.get("/api/attractions/:slug", async (req: Request, res: Response) => {
    const attraction = await storage.getAttractionBySlug(req.params.slug);
    
    if (!attraction) {
      return res.status(404).json({ message: "Attraction not found" });
    }
    
    res.json(attraction);
  });
  
  app.get("/api/attractions/category/:category", async (req: Request, res: Response) => {
    const attractions = await storage.getAttractionsByCategory(req.params.category);
    res.json(attractions);
  });
  
  app.get("/api/destinations/:destinationId/attractions", async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    const attractions = await storage.getAttractionsByDestination(destinationId);
    res.json(attractions);
  });
  
  // Cabins routes
  app.get("/api/cabins", async (_req: Request, res: Response) => {
    const cabins = await storage.getAllCabins();
    res.json(cabins);
  });
  
  app.get("/api/cabins/featured", async (_req: Request, res: Response) => {
    const cabins = await storage.getFeaturedCabins();
    res.json(cabins);
  });
  
  app.get("/api/cabins/:slug", async (req: Request, res: Response) => {
    const cabin = await storage.getCabinBySlug(req.params.slug);
    
    if (!cabin) {
      return res.status(404).json({ message: "Cabin not found" });
    }
    
    res.json(cabin);
  });
  
  // Testimonials routes
  app.get("/api/testimonials", async (_req: Request, res: Response) => {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  });
  
  app.get("/api/cabins/:cabinId/testimonials", async (req: Request, res: Response) => {
    const cabinId = parseInt(req.params.cabinId);
    const testimonials = await storage.getTestimonialsByCabin(cabinId);
    res.json(testimonials);
  });
  
  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      
      // Add subscriber to database
      const subscriber = await storage.addSubscriber(data);
      
      // If subscriber opted to receive calendar updates, we would handle that here
      if (data.receiveCalendarUpdates) {
        console.log(`Subscriber ${data.email} will receive calendar updates`);
        
        // Send a welcome email with upcoming events to new subscribers
        try {
          // Get upcoming events to include in the welcome email
          const calendarEvents = await fetchCalendarEvents();
          const formattedEvents = formatCalendarEvents(calendarEvents);
          
          // Take only the next 3 events for the welcome email
          const upcomingEvents = formattedEvents.slice(0, 3).map(event => ({
            name: event.name,
            date: new Date(event.startDate).toLocaleDateString('en-US', {
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric'
            }),
            location: event.location
          }));
          
          // Send the welcome email with calendar updates
          if (upcomingEvents.length > 0) {
            await sendCalendarUpdateNotification(data.email, upcomingEvents);
          }
        } catch (emailError) {
          console.error('Failed to send welcome calendar update email:', emailError);
          // We'll continue even if the email fails - the subscription was still successful
        }
      }
      
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });
  
  // Contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const data = contactFormSchema.parse(req.body);
      const submission = await storage.submitContactForm(data);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid contact form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const admin = await storage.verifyAdminPassword(username, password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      if (!req.session) {
        return res.status(500).json({ error: "Session not available" });
      }
      
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      
      return res.json({ 
        id: admin.id, 
        username: admin.username,
        success: true 
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Admin logout
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  // Google Calendar integration endpoint
  app.get("/api/calendar/events", async (req: Request, res: Response) => {
    try {
      // Parse query parameters
      const startDateStr = req.query.startDate as string;
      const endDateStr = req.query.endDate as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      // Convert date strings to Date objects
      const startDate = startDateStr ? new Date(startDateStr) : new Date();
      const endDate = endDateStr ? new Date(endDateStr) : undefined;
      
      // Fetch events from Google Calendar
      const googleEvents = await fetchCalendarEvents(startDate, endDate, limit);
      
      // Format events to match our application format
      const formattedEvents = formatCalendarEvents(googleEvents);
      
      return res.json(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });
  
  // Admin session check
  app.get("/api/admin/session", (req: Request, res: Response) => {
    if (req.session?.adminId) {
      return res.json({ 
        authenticated: true, 
        adminId: req.session.adminId, 
        username: req.session.adminUsername 
      });
    }
    res.json({ authenticated: false });
  });
  
  // Site Settings - Get all
  app.get("/api/site-settings", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });
  
  // Site Settings - Get by key
  app.get("/api/site-settings/:key", async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const setting = await storage.getSiteSettingByKey(key);
      
      if (!setting) {
        return res.status(404).json({ message: `Site setting with key '${key}' not found` });
      }
      
      res.json(setting);
    } catch (error) {
      console.error("Error fetching site setting:", error);
      res.status(500).json({ message: "Failed to fetch site setting" });
    }
  });
  
  // Blog post routes
  app.get("/api/blog", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  app.get("/api/blog/featured", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });
  
  app.get("/api/blog/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const posts = await storage.getBlogPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({ message: "Failed to fetch blog posts by category" });
    }
  });
  
  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: `Blog post with slug "${slug}" not found` });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  
  // Admin blog routes
  app.get("/api/admin/blog", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
      
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch admin blog posts" });
    }
  });
  
  app.post("/api/admin/blog", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
      
      const newPost = await storage.createBlogPost(req.body);
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  
  app.put("/api/admin/blog/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const updatedPost = await storage.updateBlogPost(id, req.body);
      
      if (!updatedPost) {
        return res.status(404).json({ message: `Blog post with id ${id} not found` });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  
  app.delete("/api/admin/blog/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: `Blog post with id ${id} not found` });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  
  // Site Settings - Update or create (admin only)
  app.put("/api/admin/site-settings", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated as admin
      if (!req.session?.adminId) {
        return res.status(401).json({ message: "Unauthorized: Admin access required" });
      }
      
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      
      const setting = await storage.upsertSiteSetting({ key, value });
      res.json(setting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(500).json({ message: "Failed to update site setting" });
    }
  });
  
  // Admin content routes
  // Destination admin routes
  app.get("/api/admin/destinations", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // For now, since we want to start with a clean slate, return empty array
      // This fixes the issue with any pre-existing destinations (like Fredericksburg)
      // appearing in the admin panel
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });
  
  app.put("/api/admin/destinations/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid destination ID" });
      }
      
      const destination = await storage.updateDestination(id, req.body);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      
      res.json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to update destination" });
    }
  });
  
  app.post("/api/admin/destinations", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const destination = await storage.createDestination(req.body);
      res.status(201).json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to create destination" });
    }
  });
  
  // Attraction admin routes
  app.get("/api/admin/attractions", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const attractions = await storage.getAllAttractions();
      res.json(attractions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attractions" });
    }
  });
  
  app.put("/api/admin/attractions/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid attraction ID" });
      }
      
      const attraction = await storage.updateAttraction(id, req.body);
      if (!attraction) {
        return res.status(404).json({ error: "Attraction not found" });
      }
      
      res.json(attraction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update attraction" });
    }
  });
  
  app.post("/api/admin/attractions", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const attraction = await storage.createAttraction(req.body);
      res.status(201).json(attraction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create attraction" });
    }
  });
  
  // Event admin routes
  app.get("/api/admin/events", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  
  app.put("/api/admin/events/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.updateEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });
  
  app.post("/api/admin/events", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });
  
  // Cabin admin routes
  app.get("/api/admin/cabins", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const cabins = await storage.getAllCabins();
      res.json(cabins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cabins" });
    }
  });
  
  app.put("/api/admin/cabins/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid cabin ID" });
      }
      
      const cabin = await storage.updateCabin(id, req.body);
      if (!cabin) {
        return res.status(404).json({ error: "Cabin not found" });
      }
      
      res.json(cabin);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cabin" });
    }
  });
  
  app.post("/api/admin/cabins", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const cabin = await storage.createCabin(req.body);
      res.status(201).json(cabin);
    } catch (error) {
      res.status(500).json({ error: "Failed to create cabin" });
    }
  });
  
  // Image admin routes
  app.get("/api/admin/images", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });
  
  app.post("/api/admin/images", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // In a real implementation, we'd use multer or similar for file uploads
      const imageData = req.body;
      const image = await storage.createImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // File upload route
  app.post("/api/admin/upload", async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      uploadSingleImage(req, res, next);
    } catch (error) {
      next(error);
    }
  });
  
  // AI Travel Assistant chat endpoint
  app.post("/api/travel-assistant/chat", async (req: Request, res: Response) => {
    try {
      const messages = req.body.messages;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request format. Expected array of messages." });
      }
      
      // Get the last user message to determine the appropriate response
      const userMessage = messages.filter(msg => msg.role === "user").pop()?.content || "";
      console.log("User sent message:", userMessage);
      
      try {
        // First try using the OpenAI service
        const response = await chatWithTravelAssistant(messages);
        return res.json(response);
      } catch (aiError) {
        console.error("OpenAI service error:", aiError);
        
        // Generate a fallback response
        const userQuery = userMessage.toLowerCase();
        let responseContent = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
        
        // Check for specific topics and provide canned responses
        if (userQuery.includes("bluebonnet") || userQuery.includes("flower") || userQuery.includes("spring")) {
          responseContent = "The best places to see bluebonnets in the Texas Hill Country are along Highway 281 between Burnet and Lampasas, Willow City Loop near Fredericksburg, and Enchanted Rock State Natural Area. Peak blooming season is typically late March to mid-April. Remember to respect private property and never pick the flowers!";
        } else if (userQuery.includes("wine") || userQuery.includes("winery") || userQuery.includes("vineyard")) {
          responseContent = "The Texas Hill Country is home to over 50 wineries! Some top recommendations include Grape Creek Vineyards, Becker Vineyards, and William Chris Vineyards. Wine Road 290 is a popular wine trail with numerous tasting rooms. Consider visiting during the Wine & Wildflower Journey in April or Christmas Wine Affair in December for special events.";
        } else if (userQuery.includes("fredericksburg")) {
          responseContent = "Fredericksburg is a charming German-influenced town in the heart of Hill Country. Must-visit attractions include historic Main Street with its shops and restaurants, the National Museum of the Pacific War, Enchanted Rock State Natural Area, and numerous surrounding wineries. Don't miss the German cuisine at restaurants like Der Lindenbaum or the Auslander!";
        } else if (userQuery.includes("family") || userQuery.includes("kid") || userQuery.includes("children")) {
          responseContent = "Family-friendly activities in the Hill Country include the Science Mill in Johnson City, tubing on the Guadalupe or Comal Rivers in summer, Pioneer Museum in Fredericksburg, and hiking at Enchanted Rock. Natural Bridge Wildlife Ranch near New Braunfels offers a drive-through safari with over 500 animals that kids love!";
        } else {
          responseContent = "The Texas Hill Country offers wonderful experiences including charming towns like Fredericksburg and Wimberley, award-winning wineries along Wine Road 290, outdoor activities at Enchanted Rock or Hamilton Pool, and the region's German heritage through local festivals and cuisine. What specific aspects of Hill Country travel are you interested in?";
        }
        
        return res.json({
          role: "assistant",
          content: responseContent
        });
      }
    } catch (error) {
      console.error("Error in travel assistant chat:", error);
      res.status(500).json({ 
        error: "Failed to process chat request",
        message: "Sorry, our travel assistant is unavailable at the moment. Please try again later."
      });
    }
  });

  app.delete("/api/admin/images/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid image ID" });
      }
      
      const success = await storage.deleteImage(id);
      if (!success) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });
  
  // Seasonal Content Management Routes
  
  // Get all seasons
  app.get("/api/admin/seasons", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const seasons = await getAllSeasons();
      res.json(seasons);
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).json({ error: 'Failed to fetch seasons' });
    }
  });
  
  // Get a single season
  app.get("/api/admin/seasons/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const seasonId = parseInt(req.params.id);
      const season = await getSeasonById(seasonId);
      
      if (!season) {
        return res.status(404).json({ error: 'Season not found' });
      }
      
      res.json(season);
    } catch (error) {
      console.error('Error fetching season:', error);
      res.status(500).json({ error: 'Failed to fetch season' });
    }
  });
  
  // Create a new season
  app.post("/api/admin/seasons", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const newSeason = req.body;
      const createdSeason = await createSeason(newSeason);
      res.status(201).json(createdSeason);
    } catch (error) {
      console.error('Error creating season:', error);
      res.status(500).json({ error: 'Failed to create season' });
    }
  });
  
  // Update a season
  app.put("/api/admin/seasons/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const seasonId = parseInt(req.params.id);
      const updates = req.body;
      const updatedSeason = await updateSeason(seasonId, updates);
      
      if (!updatedSeason) {
        return res.status(404).json({ error: 'Season not found' });
      }
      
      res.json(updatedSeason);
    } catch (error) {
      console.error('Error updating season:', error);
      res.status(500).json({ error: 'Failed to update season' });
    }
  });
  
  // Delete a season
  app.delete("/api/admin/seasons/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const seasonId = parseInt(req.params.id);
      const success = await deleteSeason(seasonId);
      
      if (!success) {
        return res.status(404).json({ error: 'Season not found' });
      }
      
      res.status(200).json({ message: 'Season deleted successfully' });
    } catch (error) {
      console.error('Error deleting season:', error);
      res.status(500).json({ error: 'Failed to delete season' });
    }
  });
  
  // Get all seasonal activities
  app.get("/api/admin/seasonal-activities", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const activities = await getAllSeasonalActivities();
      res.json(activities);
    } catch (error) {
      console.error('Error fetching seasonal activities:', error);
      res.status(500).json({ error: 'Failed to fetch seasonal activities' });
    }
  });
  
  // Get a single seasonal activity
  app.get("/api/admin/seasonal-activities/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const activityId = parseInt(req.params.id);
      const activity = await getSeasonalActivityById(activityId);
      
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      
      res.json(activity);
    } catch (error) {
      console.error('Error fetching activity:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  });
  
  // Create a new seasonal activity
  app.post("/api/admin/seasonal-activities", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const newActivity = req.body;
      const createdActivity = await createSeasonalActivity(newActivity);
      res.status(201).json(createdActivity);
    } catch (error) {
      console.error('Error creating seasonal activity:', error);
      res.status(500).json({ error: 'Failed to create seasonal activity' });
    }
  });
  
  // Update a seasonal activity
  app.put("/api/admin/seasonal-activities/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const activityId = parseInt(req.params.id);
      const updates = req.body;
      const updatedActivity = await updateSeasonalActivity(activityId, updates);
      
      if (!updatedActivity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      
      res.json(updatedActivity);
    } catch (error) {
      console.error('Error updating seasonal activity:', error);
      res.status(500).json({ error: 'Failed to update seasonal activity' });
    }
  });
  
  // Delete a seasonal activity
  app.delete("/api/admin/seasonal-activities/:id", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const activityId = parseInt(req.params.id);
      const success = await deleteSeasonalActivity(activityId);
      
      if (!success) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      
      res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
      console.error('Error deleting seasonal activity:', error);
      res.status(500).json({ error: 'Failed to delete seasonal activity' });
    }
  });
  
  // Public routes for seasonal content
  
  // Get all seasons
  app.get("/api/seasons", async (_req: Request, res: Response) => {
    try {
      const seasons = await getAllSeasons();
      res.json(seasons);
    } catch (error) {
      console.error('Error fetching seasons:', error);
      res.status(500).json({ error: 'Failed to fetch seasons' });
    }
  });
  
  // Get activities for a specific season
  app.get("/api/seasons/:seasonId/activities", async (req: Request, res: Response) => {
    try {
      const { seasonId } = req.params;
      const activities = await getSeasonalActivitiesBySeasonId(seasonId);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching seasonal activities:', error);
      res.status(500).json({ error: 'Failed to fetch seasonal activities' });
    }
  });

  // Weather API endpoint
  app.get("/api/weather/:location", getWeatherData);

  // Newsletter routes - public
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const data = newsletterSignupSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(data.email);
      if (existingSubscriber && existingSubscriber.active) {
        return res.status(400).json({ message: "This email is already subscribed to our newsletter." });
      }
      
      // Create or reactivate subscriber
      const subscriber = await storage.createNewsletterSubscriber({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        interests: data.interests || []
      });
      
      if (!subscriber) {
        return res.status(500).json({ message: "Failed to subscribe. Please try again later." });
      }
      
      res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "An error occurred. Please try again later." });
    }
  });

  // Unsubscribe route (public)
  app.get("/api/newsletter/unsubscribe/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      const success = await storage.unsubscribeByEmail(email);
      
      if (success) {
        res.status(200).json({ message: "You have been successfully unsubscribed." });
      } else {
        res.status(404).json({ message: "Email not found in our subscription list." });
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ message: "An error occurred. Please try again later." });
    }
  });

  // Admin authentication middleware
  const checkAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
  
  // Newsletter admin routes - protected
  app.get("/api/admin/newsletter/subscribers", checkAdminAuth, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.get("/api/admin/newsletter/subscribers/:id", checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscriber = await storage.getNewsletterSubscriberById(id);
      
      if (!subscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      res.json(subscriber);
    } catch (error) {
      console.error("Error fetching newsletter subscriber:", error);
      res.status(500).json({ message: "Failed to fetch subscriber" });
    }
  });

  app.put("/api/admin/newsletter/subscribers/:id", checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscriber = await storage.getNewsletterSubscriberById(id);
      
      if (!subscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      const updatedSubscriber = await storage.updateNewsletterSubscriber(id, req.body);
      
      if (!updatedSubscriber) {
        return res.status(500).json({ message: "Failed to update subscriber" });
      }
      
      res.json(updatedSubscriber);
    } catch (error) {
      console.error("Error updating newsletter subscriber:", error);
      res.status(500).json({ message: "Failed to update subscriber" });
    }
  });

  app.delete("/api/admin/newsletter/subscribers/:id", checkAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscriber = await storage.getNewsletterSubscriberById(id);
      
      if (!subscriber) {
        return res.status(404).json({ message: "Subscriber not found" });
      }
      
      const success = await storage.deleteNewsletterSubscriber(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete subscriber" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
