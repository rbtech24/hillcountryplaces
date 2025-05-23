import { pgTable, text, serial, integer, timestamp, json, boolean, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Images
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  alt: text("alt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Destinations
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false),
  videoUrl: text("video_url"),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  destinationId: integer("destination_id"),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  videoUrl: text("video_url"),
  isRecurring: boolean("is_recurring").default(false),
  recurrencePattern: text("recurrence_pattern"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

// Attractions
export const attractions = pgTable("attractions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  destinationId: integer("destination_id"),
  category: text("category").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  featured: boolean("featured").default(false),
  videoUrl: text("video_url"),
});

export const insertAttractionSchema = createInsertSchema(attractions).omit({
  id: true,
});

// Cabins
export const cabins = pgTable("cabins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: json("image_urls").notNull().$type<string[]>(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  sleeps: integer("sleeps").notNull(),
  price: integer("price").notNull(),
  features: json("features").notNull().$type<string[]>(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  location: text("location").notNull(),
  bookingUrl: text("booking_url"),
  featured: boolean("featured").default(false),
  videoUrl: text("video_url"),
});

export const insertCabinSchema = createInsertSchema(cabins).omit({
  id: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  cabinId: integer("cabin_id"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

// Subscribers (for newsletter)
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  receiveCalendarUpdates: boolean("receive_calendar_updates").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  receiveCalendarUpdates: true,
});

// Contact Form
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactFormSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

// Seasons Table
export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  seasonId: text("season_id").notNull().unique(), // spring, summer, fall, winter, all
  name: text("name").notNull(),
  months: json("months").notNull().$type<string[]>(),
  description: text("description").notNull(),
  highlights: json("highlights").notNull().$type<string[]>(),
  iconClass: text("icon_class").notNull(),
  bgClass: text("bg_class").notNull(),
  textClass: text("text_class").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeasonSchema = createInsertSchema(seasons).omit({
  id: true,
  updatedAt: true,
});

// Seasonal Activities Table
export const seasonalActivities = pgTable("seasonal_activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  seasonId: text("season_id").notNull(), // References seasons.seasonId
  category: text("category").notNull(),
  locations: json("locations").notNull().$type<string[]>(),
  tips: json("tips").notNull().$type<string[]>(),
  iconClass: text("icon_class").notNull(),
  displayOrder: integer("display_order").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeasonalActivitySchema = createInsertSchema(seasonalActivities).omit({
  id: true,
  updatedAt: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Attraction = typeof attractions.$inferSelect;
export type InsertAttraction = z.infer<typeof insertAttractionSchema>;

export type Cabin = typeof cabins.$inferSelect;
export type InsertCabin = z.infer<typeof insertCabinSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof contactFormSchema>;

export type Season = typeof seasons.$inferSelect;
export type InsertSeason = z.infer<typeof insertSeasonSchema>;

export type SeasonalActivity = typeof seasonalActivities.$inferSelect;
export type InsertSeasonalActivity = z.infer<typeof insertSeasonalActivitySchema>;

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dateSubscribed: timestamp("date_subscribed").defaultNow().notNull(),
  active: boolean("active").default(true),
  interests: text("interests").array(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  dateSubscribed: true,
});

// Schema for public newsletter subscriptions
export const newsletterSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: json("tags").notNull().$type<string[]>(),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
