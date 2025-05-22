import {
  destinations, type Destination, type InsertDestination,
  events, type Event, type InsertEvent,
  attractions, type Attraction, type InsertAttraction,
  cabins, type Cabin, type InsertCabin,
  testimonials, type Testimonial, type InsertTestimonial,
  subscribers, type Subscriber, type InsertSubscriber,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  adminUsers, type AdminUser, type InsertAdminUser,
  images, type Image, type InsertImage,
  siteSettings, type SiteSetting, type InsertSiteSetting,
  blogPosts, type BlogPost, type InsertBlogPost
} from "@shared/schema";

export interface IStorage {
  // Admin methods
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  verifyAdminPassword(username: string, password: string): Promise<AdminUser | null>;
  
  // Destination methods
  getAllDestinations(): Promise<Destination[]>;
  getFeaturedDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  getDestinationBySlug(slug: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: number, destination: Partial<Destination>): Promise<Destination | null>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  getEventsByDestination(destinationId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | null>;
  
  // Attraction methods
  getAllAttractions(): Promise<Attraction[]>;
  getFeaturedAttractions(): Promise<Attraction[]>;
  getAttraction(id: number): Promise<Attraction | undefined>;
  getAttractionBySlug(slug: string): Promise<Attraction | undefined>;
  getAttractionsByDestination(destinationId: number): Promise<Attraction[]>;
  getAttractionsByCategory(category: string): Promise<Attraction[]>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;
  updateAttraction(id: number, attraction: Partial<Attraction>): Promise<Attraction | null>;
  
  // Cabin methods
  getAllCabins(): Promise<Cabin[]>;
  getFeaturedCabins(): Promise<Cabin[]>;
  getCabin(id: number): Promise<Cabin | undefined>;
  getCabinBySlug(slug: string): Promise<Cabin | undefined>;
  createCabin(cabin: InsertCabin): Promise<Cabin>;
  updateCabin(id: number, cabin: Partial<Cabin>): Promise<Cabin | null>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByCabin(cabinId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Subscriber methods
  getAllSubscribers(): Promise<Subscriber[]>;
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Contact methods
  submitContactForm(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Image methods
  getAllImages(): Promise<Image[]>;
  getImage(id: number): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  deleteImage(id: number): Promise<boolean>;
  
  // Site Settings methods
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<BlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private adminUsersData: Map<number, AdminUser>;
  private destinationsData: Map<number, Destination>;
  private eventsData: Map<number, Event>;
  private attractionsData: Map<number, Attraction>;
  private cabinsData: Map<number, Cabin>;
  private testimonialsData: Map<number, Testimonial>;
  private subscribersData: Map<number, Subscriber>;
  private contactSubmissionsData: Map<number, ContactSubmission>;
  private imagesData: Map<number, Image>;
  private siteSettingsData: Map<number, SiteSetting>;
  private blogPostsData: Map<number, BlogPost>;
  
  private adminUserId = 1;
  private destinationId = 1;
  private eventId = 1;
  private attractionId = 1;
  private cabinId = 1;
  private testimonialId = 1;
  private subscriberId = 1;
  private contactSubmissionId = 1;
  private imageId = 1;
  private siteSettingId = 1;
  private blogPostId = 1;
  
  constructor() {
    this.adminUsersData = new Map();
    this.destinationsData = new Map();
    this.eventsData = new Map();
    this.attractionsData = new Map();
    this.cabinsData = new Map();
    this.testimonialsData = new Map();
    this.subscribersData = new Map();
    this.contactSubmissionsData = new Map();
    this.imagesData = new Map();
    this.siteSettingsData = new Map();
    this.blogPostsData = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // Admin methods
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsersData.get(id);
  }
  
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsersData.values()).find(
      (admin) => admin.username === username,
    );
  }
  
  async createAdminUser(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const id = this.adminUserId++;
    const admin: AdminUser = { ...insertAdmin, id, createdAt: new Date() };
    this.adminUsersData.set(id, admin);
    return admin;
  }
  
  async verifyAdminPassword(username: string, password: string): Promise<AdminUser | null> {
    const admin = await this.getAdminUserByUsername(username);
    if (!admin) return null;
    
    // In a real app, we'd use bcrypt to compare passwords
    if (admin.passwordHash === password) {
      return admin;
    }
    
    return null;
  }
  
  // Image methods
  async getAllImages(): Promise<Image[]> {
    return Array.from(this.imagesData.values());
  }
  
  async getImage(id: number): Promise<Image | undefined> {
    return this.imagesData.get(id);
  }
  
  async createImage(image: InsertImage): Promise<Image> {
    const id = this.imageId++;
    const newImage: Image = { ...image, id, createdAt: new Date() };
    this.imagesData.set(id, newImage);
    return newImage;
  }
  
  async deleteImage(id: number): Promise<boolean> {
    return this.imagesData.delete(id);
  }
  
  // Destination methods
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinationsData.values());
  }
  
  async getFeaturedDestinations(): Promise<Destination[]> {
    return Array.from(this.destinationsData.values()).filter(d => d.featured);
  }
  
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinationsData.get(id);
  }
  
  async getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    return Array.from(this.destinationsData.values()).find(d => d.slug === slug);
  }
  
  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.destinationId++;
    const newDestination: Destination = { 
      ...destination, 
      id,
      featured: destination.featured || false,
      videoUrl: destination.videoUrl || null
    };
    this.destinationsData.set(id, newDestination);
    return newDestination;
  }
  
  async updateDestination(id: number, destination: Partial<Destination>): Promise<Destination | null> {
    const existingDestination = this.destinationsData.get(id);
    if (!existingDestination) {
      return null;
    }
    
    const updatedDestination = { ...existingDestination, ...destination };
    this.destinationsData.set(id, updatedDestination);
    return updatedDestination;
  }
  
  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.eventsData.values());
  }
  
  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.eventsData.values()).filter(e => e.featured);
  }
  
  async getUpcomingEvents(limit = 5): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.eventsData.values())
      .filter(e => new Date(e.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.eventsData.get(id);
  }
  
  async getEventBySlug(slug: string): Promise<Event | undefined> {
    return Array.from(this.eventsData.values()).find(e => e.slug === slug);
  }
  
  async getEventsByDestination(destinationId: number): Promise<Event[]> {
    return Array.from(this.eventsData.values()).filter(e => e.destinationId === destinationId);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = { 
      ...event, 
      id,
      featured: event.featured || false,
      videoUrl: event.videoUrl || null,
      isRecurring: event.isRecurring || false,
      recurrencePattern: event.recurrencePattern || null,
      destinationId: event.destinationId || null
    };
    this.eventsData.set(id, newEvent);
    return newEvent;
  }
  
  async updateEvent(id: number, event: Partial<Event>): Promise<Event | null> {
    const existingEvent = this.eventsData.get(id);
    if (!existingEvent) {
      return null;
    }
    
    const updatedEvent = { ...existingEvent, ...event };
    this.eventsData.set(id, updatedEvent);
    return updatedEvent;
  }
  
  // Attraction methods
  async getAllAttractions(): Promise<Attraction[]> {
    return Array.from(this.attractionsData.values());
  }
  
  async getFeaturedAttractions(): Promise<Attraction[]> {
    return Array.from(this.attractionsData.values()).filter(a => a.featured);
  }
  
  async getAttraction(id: number): Promise<Attraction | undefined> {
    return this.attractionsData.get(id);
  }
  
  async getAttractionBySlug(slug: string): Promise<Attraction | undefined> {
    return Array.from(this.attractionsData.values()).find(a => a.slug === slug);
  }
  
  async getAttractionsByDestination(destinationId: number): Promise<Attraction[]> {
    return Array.from(this.attractionsData.values()).filter(a => a.destinationId === destinationId);
  }
  
  async getAttractionsByCategory(category: string): Promise<Attraction[]> {
    return Array.from(this.attractionsData.values()).filter(a => a.category === category);
  }
  
  async createAttraction(attraction: InsertAttraction): Promise<Attraction> {
    const id = this.attractionId++;
    const newAttraction: Attraction = { 
      ...attraction, 
      id,
      featured: attraction.featured || false,
      videoUrl: attraction.videoUrl || null,
      destinationId: attraction.destinationId || null
    };
    this.attractionsData.set(id, newAttraction);
    return newAttraction;
  }
  
  async updateAttraction(id: number, attraction: Partial<Attraction>): Promise<Attraction | null> {
    const existingAttraction = this.attractionsData.get(id);
    if (!existingAttraction) {
      return null;
    }
    
    const updatedAttraction = { ...existingAttraction, ...attraction };
    this.attractionsData.set(id, updatedAttraction);
    return updatedAttraction;
  }
  
  // Cabin methods
  async getAllCabins(): Promise<Cabin[]> {
    return Array.from(this.cabinsData.values());
  }
  
  async getFeaturedCabins(): Promise<Cabin[]> {
    return Array.from(this.cabinsData.values()).filter(c => c.featured);
  }
  
  async getCabin(id: number): Promise<Cabin | undefined> {
    return this.cabinsData.get(id);
  }
  
  async getCabinBySlug(slug: string): Promise<Cabin | undefined> {
    return Array.from(this.cabinsData.values()).find(c => c.slug === slug);
  }
  
  async createCabin(cabin: InsertCabin): Promise<Cabin> {
    const id = this.cabinId++;
    const newCabin: Cabin = { 
      ...cabin, 
      id,
      featured: cabin.featured || false,
      videoUrl: cabin.videoUrl || null,
      amenities: cabin.amenities || [],
      imageUrls: cabin.imageUrls || [],
      bookingUrl: cabin.bookingUrl || null
    };
    this.cabinsData.set(id, newCabin);
    return newCabin;
  }
  
  async updateCabin(id: number, cabin: Partial<Cabin>): Promise<Cabin | null> {
    const existingCabin = this.cabinsData.get(id);
    if (!existingCabin) {
      return null;
    }
    
    const updatedCabin = { ...existingCabin, ...cabin };
    this.cabinsData.set(id, updatedCabin);
    return updatedCabin;
  }
  
  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonialsData.values());
  }
  
  async getTestimonialsByCabin(cabinId: number): Promise<Testimonial[]> {
    return Array.from(this.testimonialsData.values()).filter(t => t.cabinId === cabinId);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const newTestimonial: Testimonial = { 
      ...testimonial, 
      id,
      cabinId: testimonial.cabinId || null
    };
    this.testimonialsData.set(id, newTestimonial);
    return newTestimonial;
  }
  
  // Subscriber methods
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribersData.values());
  }
  
  async addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberId++;
    // Default receiveCalendarUpdates to true if not provided
    const receiveCalendarUpdates = subscriber.receiveCalendarUpdates !== undefined 
      ? subscriber.receiveCalendarUpdates 
      : true;
    
    const newSubscriber: Subscriber = { 
      ...subscriber, 
      id, 
      createdAt: new Date(),
      receiveCalendarUpdates
    };
    
    this.subscribersData.set(id, newSubscriber);
    return newSubscriber;
  }
  
  // Contact methods
  async submitContactForm(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactSubmissionId++;
    const newSubmission: ContactSubmission = { ...submission, id, createdAt: new Date() };
    this.contactSubmissionsData.set(id, newSubmission);
    return newSubmission;
  }
  
  // Site Settings methods
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettingsData.values());
  }
  
  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    for (const setting of this.siteSettingsData.values()) {
      if (setting.key === key) {
        return setting;
      }
    }
    return undefined;
  }
  
  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    // Check if setting with this key already exists
    const existingSetting = await this.getSiteSettingByKey(setting.key);
    
    if (existingSetting) {
      // Update existing setting
      const updatedSetting: SiteSetting = {
        ...existingSetting,
        value: setting.value,
        updatedAt: new Date()
      };
      this.siteSettingsData.set(existingSetting.id, updatedSetting);
      return updatedSetting;
    } else {
      // Create new setting
      const id = this.siteSettingId++;
      const newSetting: SiteSetting = {
        ...setting,
        id,
        updatedAt: new Date()
      };
      this.siteSettingsData.set(id, newSetting);
      return newSetting;
    }
  }
  
  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .filter(post => post.featured)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .filter(post => post.category === category)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsData.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsData.values()).find(post => post.slug === slug);
  }
  
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostId++;
    const newBlogPost: BlogPost = {
      ...blogPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: blogPost.featured || false
    };
    this.blogPostsData.set(id, newBlogPost);
    return newBlogPost;
  }
  
  async updateBlogPost(id: number, blogPost: Partial<BlogPost>): Promise<BlogPost | null> {
    const existingPost = this.blogPostsData.get(id);
    if (!existingPost) {
      return null;
    }
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...blogPost,
      updatedAt: new Date()
    };
    
    this.blogPostsData.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsData.delete(id);
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create a unique admin user with more secure credentials
    const admin = {
      username: "hillcountry_admin",
      passwordHash: "TXHillCountry2025!", // In a real app, this would be hashed
    };
    this.createAdminUser(admin);
    
    // Initialize site settings with hero image
    this.upsertSiteSetting({
      key: "heroImage",
      value: "/images/hill-country-sunset.jpg"
    });
    
    // Add more site settings for different image types
    const siteSettingsToAdd = [
      { key: "destinationsHero", value: "/images/destinations-hero.jpg" },
      { key: "eventsHero", value: "/images/events-hero.jpg" },
      { key: "attractionsHero", value: "/images/attractions-hero.jpg" },
      { key: "cabinsHero", value: "/images/cabins-hero.jpg" },
      { key: "blogHero", value: "/images/blog-hero.jpg" },
      { key: "subscribeBackground", value: "/images/subscribe-bg.jpg" },
      { key: "testimonialsBackground", value: "/images/testimonials-bg.jpg" },
      { key: "siteLogo", value: "/images/hill-country-logo.png" },
      { key: "footerLogo", value: "/images/hill-country-logo-light.png" },
      { key: "defaultDestinationImage", value: "/images/default-destination.jpg" },
      { key: "defaultEventImage", value: "/images/default-event.jpg" },
      { key: "defaultAttractionImage", value: "/images/default-attraction.jpg" },
      { key: "defaultCabinImage", value: "/images/default-cabin.jpg" },
      { key: "defaultBlogImage", value: "/images/default-blog.jpg" }
    ];
    
    siteSettingsToAdd.forEach(setting => {
      this.upsertSiteSetting(setting);
    });
    
    // Add sample blog posts
    this.createBlogPost({
      title: "Best Hiking Trails in the Hill Country",
      slug: "best-hiking-trails-hill-country",
      excerpt: "Discover the most scenic hiking trails throughout the Texas Hill Country, from easy walks to challenging hikes.",
      content: "<h2>The Top Hiking Trails in Hill Country</h2><p>The Texas Hill Country offers some of the most beautiful hiking trails in the state.</p>",
      imageUrl: "/images/hill-country-hiking.jpg",
      author: "Emma Woodward",
      category: "Outdoor Adventures",
      tags: ["hiking", "trails", "outdoor activities", "nature"],
      featured: true,
      publishedAt: new Date(2025, 4, 10) // May 10, 2025
    });
    
    this.createBlogPost({
      title: "Hidden Wineries of the Hill Country",
      slug: "hidden-wineries-hill-country",
      excerpt: "Explore lesser-known but exceptional wineries throughout the Texas Hill Country wine trail.",
      content: "<h2>Discover the Hidden Gems of Texas Wine Country</h2><p>While the Texas Hill Country wine region has gained recognition in recent years, there are still many hidden gems waiting to be discovered by wine enthusiasts.</p>",
      imageUrl: "/images/hill-country-wineries.jpg",
      author: "Michael Torres",
      category: "Food & Drink",
      tags: ["wine", "wineries", "food", "tasting"],
      featured: true,
      publishedAt: new Date(2025, 4, 8) // May 8, 2025
    });
    
    this.createBlogPost({
      title: "Top 10 Hidden Gems in the Texas Hill Country",
      slug: "top-10-hidden-gems-texas-hill-country",
      excerpt: "Discover the lesser-known treasures of Texas Hill Country that locals love but tourists often miss.",
      content: "<h2>Discover the Secret Spots of the Hill Country</h2><p>The Texas Hill Country is famous for its rolling landscapes, charming towns, and vibrant culture.</p>",
      imageUrl: "/images/hill-country-hidden-gems.jpg",
      author: "Hill Country Team",
      category: "Destinations",
      tags: ["hidden gems", "local favorites", "outdoor adventures"],
      featured: false,
      publishedAt: new Date(2025, 4, 15) // May 15, 2025
    });
    
    // Add sample images
    const sampleImages = [
      {
        url: "/images/hill-country-sunset.jpg",
        name: "Hill Country Sunset",
        description: "Beautiful sunset over the Texas Hill Country"
      },
      {
        url: "/images/pedernales-falls.jpg",
        name: "Pedernales Falls",
        description: "Scenic view of Pedernales Falls State Park"
      },
      {
        url: "/images/wineries.jpg",
        name: "Hill Country Wineries",
        description: "Vineyards in the Texas Hill Country wine region"
      }
    ];
    
    sampleImages.forEach(img => this.createImage(img));
    
    // Add sample destinations
    const destinations = [
      {
        name: "Austin",
        slug: "austin",
        description: "Austin is the state capital of Texas, an inland city bordering the Hill Country region.",
        shortDescription: "The vibrant capital city of Texas with a thriving music scene and outdoor activities.",
        imageUrl: "/images/austin.jpg",
        featured: true
      },
      {
        name: "Fredericksburg",
        slug: "fredericksburg",
        description: "Fredericksburg is a city in central Texas, known for its wineries and German heritage.",
        shortDescription: "Historic German town with over 50 wineries and charming B&Bs.",
        imageUrl: "/images/fredericksburg.jpg",
        featured: true
      }
    ];
    
    destinations.forEach(dest => {
      this.createDestination(dest);
    });
  }
}

export const storage = new MemStorage();