import { google } from 'googleapis';

// Initialize the Google Calendar API client
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_CALENDAR_API_KEY
});

// Using a public Google Calendar for Hill Country events
// For a real implementation, we would need a public calendar ID created specifically for Hill Country events
// For now we'll use the public US holidays calendar which is available without additional authentication
const HILL_COUNTRY_CALENDAR_ID = 'en.usa#holiday@group.v.calendar.google.com';

/**
 * Fetch events from the Hill Country Google Calendar
 */
export async function fetchCalendarEvents(
  startDate: Date = new Date(),
  endDate?: Date,
  maxResults: number = 100
) {
  try {
    // If no end date is provided, set it to 3 months from start date
    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
    }

    // Format dates for Google Calendar API
    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();

    // Fetch events from Google Calendar
    // Make sure we use the correct calendar ID that works with the API key
    const response = await calendar.events.list({
      calendarId: 'en.usa#holiday@group.v.calendar.google.com', // Use US holidays calendar directly
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
}

/**
 * Format Google Calendar events to match our application format
 */
export function formatCalendarEvents(googleEvents: any[]) {
  return googleEvents.map(event => {
    // Handle all-day events vs. events with specific times
    const startDate = event.start.dateTime 
      ? new Date(event.start.dateTime) 
      : new Date(event.start.date);
    
    const endDate = event.end.dateTime 
      ? new Date(event.end.dateTime) 
      : new Date(event.end.date);

    // Check if it's a recurring event
    const isRecurring = !!event.recurrence;
    
    // If recurrence exists, try to parse the pattern
    let recurrencePattern = null;
    if (isRecurring && event.recurrence && event.recurrence.length > 0) {
      const rrule = event.recurrence[0];
      // Simplified parsing of recurrence rule for display purposes
      if (rrule.includes('FREQ=DAILY')) {
        recurrencePattern = 'Daily';
      } else if (rrule.includes('FREQ=WEEKLY')) {
        recurrencePattern = 'Weekly';
      } else if (rrule.includes('FREQ=MONTHLY')) {
        recurrencePattern = 'Monthly';
      } else if (rrule.includes('FREQ=YEARLY')) {
        recurrencePattern = 'Yearly';
      }
    }

    // Format the event to match our application's event format
    return {
      id: event.id,
      name: event.summary,
      description: event.description || '',
      shortDescription: event.description ? event.description.substring(0, 150) + '...' : '',
      location: event.location || 'Texas Hill Country',
      slug: `event-${event.id}`,
      imageUrl: getEventImageUrl(event),
      startDate,
      endDate,
      category: getEventCategory(event),
      isRecurring,
      recurrencePattern,
      destinationId: null,
      featured: false,
      videoUrl: null
    };
  });
}

/**
 * Extract an image URL from event description if available
 */
function getEventImageUrl(event: any): string {
  // Default image if none is found
  const defaultImage = '/images/events/default-event.jpg';
  
  // Try to extract image URL from description
  if (event.description) {
    // Look for image URLs in description (simplified)
    const imgRegex = /<img.*?src=["'](.*?)["']/;
    const match = event.description.match(imgRegex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return defaultImage;
}

/**
 * Determine event category based on event data
 */
function getEventCategory(event: any): string {
  // Default category
  let category = 'General';
  
  // Try to determine category from event details
  const summary = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  
  if (summary.includes('wine') || description.includes('wine') || 
      summary.includes('vineyard') || description.includes('vineyard')) {
    category = 'Wine & Food';
  } else if (summary.includes('music') || description.includes('music') ||
             summary.includes('concert') || description.includes('concert') ||
             summary.includes('festival') || description.includes('festival')) {
    category = 'Music & Arts';
  } else if (summary.includes('hike') || description.includes('hike') ||
             summary.includes('outdoor') || description.includes('outdoor') ||
             summary.includes('nature') || description.includes('nature')) {
    category = 'Outdoor & Recreation';
  }
  
  return category;
}