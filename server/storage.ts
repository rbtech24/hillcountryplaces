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
  blogPosts, type BlogPost, type InsertBlogPost,
  seasons, type Season, type InsertSeason,
  seasonalActivities, type SeasonalActivity, type InsertSeasonalActivity,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";

export interface IStorage {
  // Admin methods
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  verifyAdminPassword(username: string, password: string): Promise<AdminUser | null>;
  
  // Newsletter Subscriber methods
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberById(id: number): Promise<NewsletterSubscriber | undefined>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber | null>;
  updateNewsletterSubscriber(id: number, subscriber: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber | null>;
  deleteNewsletterSubscriber(id: number): Promise<boolean>;
  unsubscribeByEmail(email: string): Promise<boolean>;
  
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
  
  // Season methods
  getAllSeasons(): Promise<Season[]>;
  getSeasonById(id: number): Promise<Season | undefined>;
  getSeasonBySeasonId(seasonId: string): Promise<Season | undefined>;
  createSeason(season: InsertSeason): Promise<Season>;
  updateSeason(id: number, season: Partial<Season>): Promise<Season | null>;
  deleteSeason(id: number): Promise<boolean>;
  
  // Seasonal Activity methods
  getAllSeasonalActivities(): Promise<SeasonalActivity[]>;
  getSeasonalActivityById(id: number): Promise<SeasonalActivity | undefined>;
  getSeasonalActivitiesBySeasonId(seasonId: string): Promise<SeasonalActivity[]>;
  createSeasonalActivity(activity: InsertSeasonalActivity): Promise<SeasonalActivity>;
  updateSeasonalActivity(id: number, activity: Partial<SeasonalActivity>): Promise<SeasonalActivity | null>;
  deleteSeasonalActivity(id: number): Promise<boolean>;
  
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
  
  // Season and seasonal activity storage
  private seasonsData: Map<number, Season>;
  private seasonalActivitiesData: Map<number, SeasonalActivity>;
  private seasonId = 1;
  private seasonalActivityId = 1;

  // Newsletter subscriber storage
  private newsletterSubscribersData: Map<number, NewsletterSubscriber>;
  private newsletterSubscriberId = 1;

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
    this.newsletterSubscribersData = new Map();
    this.siteSettingsData = new Map();
    this.blogPostsData = new Map();
    this.seasonsData = new Map();
    this.seasonalActivitiesData = new Map();
    
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
    return Array.from(this.siteSettingsData.values()).find(s => s.key === key);
  }
  
  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    // Check if setting with this key already exists
    const existingSetting = await this.getSiteSettingByKey(setting.key);
    
    if (existingSetting) {
      // Update existing setting
      const updatedSetting = { 
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.siteSettingsData.set(id, newSetting);
      return newSetting;
    }
  }
  
  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPostsData.values())
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
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
      featured: blogPost.featured || false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogPostsData.set(id, newBlogPost);
    return newBlogPost;
  }
  
  async updateBlogPost(id: number, blogPost: Partial<BlogPost>): Promise<BlogPost | null> {
    const existingBlogPost = this.blogPostsData.get(id);
    if (!existingBlogPost) {
      return null;
    }
    
    const updatedBlogPost = { 
      ...existingBlogPost, 
      ...blogPost,
      updatedAt: new Date()
    };
    this.blogPostsData.set(id, updatedBlogPost);
    return updatedBlogPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPostsData.delete(id);
  }
  
  // Season methods
  async getAllSeasons(): Promise<Season[]> {
    return Array.from(this.seasonsData.values());
  }

  async getSeasonById(id: number): Promise<Season | undefined> {
    return this.seasonsData.get(id);
  }

  async getSeasonBySeasonId(seasonId: string): Promise<Season | undefined> {
    return Array.from(this.seasonsData.values()).find(season => season.seasonId === seasonId);
  }

  async createSeason(season: InsertSeason): Promise<Season> {
    const id = this.seasonId++;
    const newSeason: Season = {
      ...season,
      id,
      updatedAt: new Date()
    };
    this.seasonsData.set(id, newSeason);
    return newSeason;
  }

  async updateSeason(id: number, seasonUpdates: Partial<Season>): Promise<Season | null> {
    const season = this.seasonsData.get(id);
    if (!season) return null;
    
    const updatedSeason: Season = {
      ...season,
      ...seasonUpdates,
      updatedAt: new Date()
    };
    
    this.seasonsData.set(id, updatedSeason);
    return updatedSeason;
  }

  async deleteSeason(id: number): Promise<boolean> {
    return this.seasonsData.delete(id);
  }

  // Seasonal Activity methods
  async getAllSeasonalActivities(): Promise<SeasonalActivity[]> {
    return Array.from(this.seasonalActivitiesData.values());
  }

  async getSeasonalActivityById(id: number): Promise<SeasonalActivity | undefined> {
    return this.seasonalActivitiesData.get(id);
  }

  async getSeasonalActivitiesBySeasonId(seasonId: string): Promise<SeasonalActivity[]> {
    return Array.from(this.seasonalActivitiesData.values()).filter(
      activity => activity.seasonId === seasonId
    );
  }

  async createSeasonalActivity(activity: InsertSeasonalActivity): Promise<SeasonalActivity> {
    const id = this.seasonalActivityId++;
    const newActivity: SeasonalActivity = {
      ...activity,
      id,
      updatedAt: new Date()
    };
    this.seasonalActivitiesData.set(id, newActivity);
    return newActivity;
  }

  async updateSeasonalActivity(id: number, activityUpdates: Partial<SeasonalActivity>): Promise<SeasonalActivity | null> {
    const activity = this.seasonalActivitiesData.get(id);
    if (!activity) return null;
    
    const updatedActivity: SeasonalActivity = {
      ...activity,
      ...activityUpdates,
      updatedAt: new Date()
    };
    
    this.seasonalActivitiesData.set(id, updatedActivity);
    return updatedActivity;
  }

  async deleteSeasonalActivity(id: number): Promise<boolean> {
    return this.seasonalActivitiesData.delete(id);
  }
  
  // Newsletter subscriber methods
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribersData.values())
      .sort((a, b) => b.dateSubscribed.getTime() - a.dateSubscribed.getTime());
  }
  
  async getNewsletterSubscriberById(id: number): Promise<NewsletterSubscriber | undefined> {
    return this.newsletterSubscribersData.get(id);
  }
  
  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribersData.values())
      .find(subscriber => subscriber.email.toLowerCase() === email.toLowerCase());
  }
  
  async createNewsletterSubscriber(data: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const existingSubscriber = await this.getNewsletterSubscriberByEmail(data.email);
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        // Reactivate subscriber
        const updatedSubscriber = {
          ...existingSubscriber,
          active: true,
          interests: data.interests || existingSubscriber.interests,
          firstName: data.firstName || existingSubscriber.firstName,
          lastName: data.lastName || existingSubscriber.lastName,
        };
        this.newsletterSubscribersData.set(existingSubscriber.id, updatedSubscriber);
        return updatedSubscriber;
      }
      return existingSubscriber;
    }
    
    // Create new subscriber
    const id = this.newsletterSubscriberId++;
    const newSubscriber: NewsletterSubscriber = {
      id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName || null,
      dateSubscribed: new Date(),
      active: true,
      interests: data.interests || [],
    };
    
    this.newsletterSubscribersData.set(id, newSubscriber);
    return newSubscriber;
  }
  
  async updateNewsletterSubscriber(id: number, data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber | null> {
    const subscriber = this.newsletterSubscribersData.get(id);
    if (!subscriber) return null;
    
    const updatedSubscriber = { ...subscriber, ...data };
    this.newsletterSubscribersData.set(id, updatedSubscriber);
    return updatedSubscriber;
  }
  
  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    const success = this.newsletterSubscribersData.delete(id);
    return success;
  }
  
  async unsubscribeByEmail(email: string): Promise<boolean> {
    const subscriber = await this.getNewsletterSubscriberByEmail(email);
    if (!subscriber) return false;
    
    return this.updateNewsletterSubscriber(subscriber.id, { active: false })
      .then(result => !!result);
  }
  
  private initializeData() {
    // Create admin user
    const admin: InsertAdminUser = {
      username: "hillcountry_admin",
      passwordHash: "TXHillCountry2025!",
      email: "admin@hillcountry.example.com"
    };
    this.createAdminUser(admin);
    
    // Create destinations - empty array for now, will be added through admin interface
    const destinations: InsertDestination[] = [];
    
    // No destinations to create by default
    
    // Create cabins
    const cabins: InsertCabin[] = [
      {
        name: "Coyote Cabin",
        slug: "coyote-cabin",
        description: "Our cozy Coyote Cabin offers a perfect retreat for couples looking to enjoy the serenity of the Hill Country. This charming cabin features a comfortable queen bed, full kitchen, and a private porch overlooking the countryside.",
        shortDescription: "Cozy retreat perfect for couples with beautiful Hill Country views",
        imageUrl: "https://images.unsplash.com/photo-1516402707257-787c50fc3898?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1516402707257-787c50fc3898?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
          "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80"
        ],
        bedrooms: 1,
        bathrooms: 1,
        sleeps: 2,
        price: 145,
        features: [
          "Queen bed with luxury linens",
          "Full kitchen with all appliances",
          "Private porch with Hill Country views",
          "Fireplace",
          "Free WiFi",
          "Smart TV with streaming services"
        ],
        rating: 49,
        reviewCount: 27,
        location: "Wimberley",
        bookingUrl: "https://example.com/book/coyote-cabin",
        featured: true
      },
      {
        name: "Bluebonnet Lodge",
        slug: "bluebonnet-lodge",
        description: "Experience the beauty of the Texas Hill Country at our spacious Bluebonnet Lodge. With two bedrooms, a large living area, and a stunning outdoor space, this cabin is perfect for families or small groups wanting to enjoy everything Wimberley has to offer.",
        shortDescription: "Spacious two-bedroom lodge ideal for families and small groups",
        imageUrl: "https://images.unsplash.com/photo-1551927336-09d50efd69cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1551927336-09d50efd69cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
          "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80"
        ],
        bedrooms: 2,
        bathrooms: 2,
        sleeps: 4,
        price: 225,
        features: [
          "Two bedrooms with comfortable beds",
          "Two full bathrooms",
          "Fully equipped kitchen",
          "Spacious living area",
          "Large deck with outdoor seating",
          "BBQ grill",
          "Free WiFi and Smart TV"
        ],
        rating: 48,
        reviewCount: 18,
        location: "Wimberley",
        bookingUrl: "https://example.com/book/bluebonnet-lodge",
        featured: true
      }
    ];
    
    cabins.forEach(cabin => {
      this.createCabin(cabin);
    });
    
    // Create testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Amy N.",
        date: "May 2025",
        rating: 5,
        review: "Very clean little cabin with just enough space for 2. Close to town and far enough away to enjoy the quiet. I would definitely recommend and stay here again.",
        cabinId: 1
      },
      {
        name: "McNeal's",
        date: "March 2025",
        rating: 5,
        review: "Just the right amount of space for a couples getaway! Close to everything you need but still feels far from the hustle and bustle. Sitting out by the chiminea at night up under the stars was our favorite part!",
        cabinId: 1
      },
      {
        name: "Harry & Scottie G.",
        date: "August 2024",
        rating: 5,
        review: "Beautiful and relaxing, peaceful atmosphere. We will highly recommend this place to anyone we know. Cabin was very clean and more than what we expected. Thank you for allowing us to spend our Honeymoon staying in such a Beautiful place.",
        cabinId: 2
      },
      {
        name: "Jennifer K.",
        date: "June 2024",
        rating: 5,
        review: "Experience Flite Acres Cabins exceeded all our expectations! We spent a fabulous weekend exploring nearby wineries and hiking trails. The cabin was immaculate and so charming with all the modern amenities you could want while still feeling rustic and cozy.",
        cabinId: 3
      },
      {
        name: "The Roberts Family",
        date: "April 2025",
        rating: 5,
        review: "Our family had such a wonderful time at Experience Flite Acres Cabins. The kids loved exploring the Hill Country and we all enjoyed stargazing at night. The cabin was spacious, clean, and had everything we needed for a perfect getaway.",
        cabinId: 2
      },
      {
        name: "David & Maria",
        date: "February 2025",
        rating: 5,
        review: "The perfect Valentine's getaway! Peaceful, romantic setting with beautiful views. We loved sitting on the porch in the morning with our coffee watching the deer. Already booked our next stay!",
        cabinId: 1
      }
    ];
    
    testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();