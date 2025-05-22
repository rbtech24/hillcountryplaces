import { db } from './db';
import { seasons, seasonalActivities, type Season, type SeasonalActivity, type InsertSeason, type InsertSeasonalActivity } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Get all seasons
 * @returns Promise<Season[]> Array of all seasons
 */
export async function getAllSeasons(): Promise<Season[]> {
  try {
    const allSeasons = await db.select().from(seasons).orderBy(seasons.name);
    return allSeasons;
  } catch (error) {
    console.error('Error fetching all seasons:', error);
    return [];
  }
}

/**
 * Get a season by ID
 * @param id The numeric ID of the season
 * @returns Promise<Season | undefined> The season or undefined if not found
 */
export async function getSeasonById(id: number): Promise<Season | undefined> {
  try {
    const [season] = await db.select().from(seasons).where(eq(seasons.id, id));
    return season;
  } catch (error) {
    console.error(`Error fetching season with ID ${id}:`, error);
    return undefined;
  }
}

/**
 * Get a season by its seasonId
 * @param seasonId The string identifier of the season (e.g., 'spring', 'summer')
 * @returns Promise<Season | undefined> The season or undefined if not found
 */
export async function getSeasonBySeasonId(seasonId: string): Promise<Season | undefined> {
  try {
    const [season] = await db.select().from(seasons).where(eq(seasons.seasonId, seasonId));
    return season;
  } catch (error) {
    console.error(`Error fetching season with seasonId ${seasonId}:`, error);
    return undefined;
  }
}

/**
 * Create a new season
 * @param season The season data to create
 * @returns Promise<Season> The created season
 */
export async function createSeason(season: InsertSeason): Promise<Season> {
  try {
    // Insert the season directly without destructuring it first, allowing Drizzle to handle mapping
    const result = await db.insert(seasons).values(season).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating season:', error);
    throw error;
  }
}

/**
 * Update a season
 * @param id The numeric ID of the season to update
 * @param seasonUpdates The partial season data to update
 * @returns Promise<Season | null> The updated season or null if not found
 */
export async function updateSeason(id: number, seasonUpdates: Partial<Season>): Promise<Season | null> {
  try {
    const [updatedSeason] = await db
      .update(seasons)
      .set(seasonUpdates)
      .where(eq(seasons.id, id))
      .returning();
    
    return updatedSeason || null;
  } catch (error) {
    console.error(`Error updating season with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a season
 * @param id The numeric ID of the season to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export async function deleteSeason(id: number): Promise<boolean> {
  try {
    // First delete associated activities
    await db
      .delete(seasonalActivities)
      .where(
        eq(seasonalActivities.seasonId, 
          db.select({ seasonId: seasons.seasonId })
            .from(seasons)
            .where(eq(seasons.id, id))
            .limit(1)
        )
      );
    
    // Then delete the season
    const result = await db
      .delete(seasons)
      .where(eq(seasons.id, id))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting season with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get all seasonal activities
 * @returns Promise<SeasonalActivity[]> Array of all seasonal activities
 */
export async function getAllSeasonalActivities(): Promise<SeasonalActivity[]> {
  try {
    const allActivities = await db
      .select()
      .from(seasonalActivities)
      .orderBy(seasonalActivities.displayOrder);
    
    return allActivities;
  } catch (error) {
    console.error('Error fetching all seasonal activities:', error);
    return [];
  }
}

/**
 * Get a seasonal activity by ID
 * @param id The numeric ID of the activity
 * @returns Promise<SeasonalActivity | undefined> The activity or undefined if not found
 */
export async function getSeasonalActivityById(id: number): Promise<SeasonalActivity | undefined> {
  try {
    const [activity] = await db
      .select()
      .from(seasonalActivities)
      .where(eq(seasonalActivities.id, id));
    
    return activity;
  } catch (error) {
    console.error(`Error fetching seasonal activity with ID ${id}:`, error);
    return undefined;
  }
}

/**
 * Get all seasonal activities for a specific season
 * @param seasonId The string identifier of the season
 * @returns Promise<SeasonalActivity[]> Array of seasonal activities for the season
 */
export async function getSeasonalActivitiesBySeasonId(seasonId: string): Promise<SeasonalActivity[]> {
  try {
    const activities = await db
      .select()
      .from(seasonalActivities)
      .where(eq(seasonalActivities.seasonId, seasonId))
      .orderBy(seasonalActivities.displayOrder);
    
    return activities;
  } catch (error) {
    console.error(`Error fetching seasonal activities for season ${seasonId}:`, error);
    return [];
  }
}

/**
 * Create a new seasonal activity
 * @param activity The activity data to create
 * @returns Promise<SeasonalActivity> The created activity
 */
export async function createSeasonalActivity(activity: InsertSeasonalActivity): Promise<SeasonalActivity> {
  try {
    // Insert the activity directly without destructuring it first, allowing Drizzle to handle mapping
    const result = await db
      .insert(seasonalActivities)
      .values(activity)
      .returning();
    
    return result[0];
  } catch (error) {
    console.error('Error creating seasonal activity:', error);
    throw error;
  }
}

/**
 * Update a seasonal activity
 * @param id The numeric ID of the activity to update
 * @param activityUpdates The partial activity data to update
 * @returns Promise<SeasonalActivity | null> The updated activity or null if not found
 */
export async function updateSeasonalActivity(id: number, activityUpdates: Partial<SeasonalActivity>): Promise<SeasonalActivity | null> {
  try {
    const [updatedActivity] = await db
      .update(seasonalActivities)
      .set(activityUpdates)
      .where(eq(seasonalActivities.id, id))
      .returning();
    
    return updatedActivity || null;
  } catch (error) {
    console.error(`Error updating seasonal activity with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a seasonal activity
 * @param id The numeric ID of the activity to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export async function deleteSeasonalActivity(id: number): Promise<boolean> {
  try {
    const result = await db
      .delete(seasonalActivities)
      .where(eq(seasonalActivities.id, id))
      .returning();
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting seasonal activity with ID ${id}:`, error);
    return false;
  }
}

/**
 * Initialize seasonal data with default values if no data exists
 */
export async function initializeSeasonalData() {
  try {
    // Check if there are any seasons
    const existingSeasons = await db.select().from(seasons).limit(1);
    
    if (existingSeasons.length === 0) {
      console.log('No seasonal data found, initializing with default values...');
      
      // Define default seasons
      const defaultSeasons = [
        {
          name: 'Spring',
          seasonId: 'spring',
          months: ['March', 'April', 'May'],
          description: 'Experience the beauty of Hill Country wildflowers in full bloom. Spring offers mild temperatures, vibrant landscapes, and outdoor festivals.',
          highlights: ['Bluebonnet season', 'Wine tours', 'Mild weather'],
          iconClass: 'flower',
          bgClass: 'bg-green-100',
          textClass: 'text-green-800'
        },
        {
          name: 'Summer',
          seasonId: 'summer',
          months: ['June', 'July', 'August'],
          description: 'Summer in the Hill Country means tubing down rivers, swimming in natural springs, and enjoying outdoor concerts under the stars.',
          highlights: ['River activities', 'Swimming holes', 'Evening events'],
          iconClass: 'sun',
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-800'
        },
        {
          name: 'Fall',
          seasonId: 'fall',
          months: ['September', 'October', 'November'],
          description: 'Fall brings cooler temperatures and changing colors to the Hill Country, along with harvest festivals and perfect hiking weather.',
          highlights: ['Fall foliage', 'Harvest festivals', 'Perfect temperatures'],
          iconClass: 'leaf',
          bgClass: 'bg-orange-100',
          textClass: 'text-orange-800'
        },
        {
          name: 'Winter',
          seasonId: 'winter',
          months: ['December', 'January', 'February'],
          description: 'Winter in the Hill Country offers a unique beauty with holiday lights, wine tours, and cozy cabin stays with scenic views.',
          highlights: ['Holiday lights', 'Less crowded', 'Wine tasting'],
          iconClass: 'snowflake',
          bgClass: 'bg-blue-100',
          textClass: 'text-blue-800'
        }
      ];
      
      // Insert all seasons individually
      for (const season of defaultSeasons) {
        try {
          await db.insert(seasons).values(season);
          console.log(`Successfully created ${season.name} season`);
        } catch (err) {
          console.error(`Error creating ${season.name} season:`, err);
        }
      }
      
      // Create default activities for each season
      const springActivities = [
        {
          seasonId: 'spring',
          title: 'Wildflower Viewing',
          description: 'Visit the best spots to see bluebonnets and other wildflowers in bloom throughout the Hill Country.',
          category: 'outdoor',
          iconClass: 'flower',
          locations: ['Willow City Loop', 'Lady Bird Johnson Wildflower Center', 'Muleshoe Bend'],
          tips: ['Best in late March to early April', 'Go on weekdays to avoid crowds', 'Bring a camera'],
          displayOrder: 1
        },
        {
          seasonId: 'spring',
          title: 'Wine Tasting Tours',
          description: 'Spring is the perfect time to tour the Hill Country wine trail with pleasant temperatures and beautiful vineyard views.',
          category: 'culinary',
          iconClass: 'wine-glass',
          locations: ['Fredericksburg Wine Road 290', 'Driftwood Wineries', 'Dripping Springs'],
          tips: ['Book tasting appointments in advance', 'Consider a designated driver or tour service', 'Try local varietals'],
          displayOrder: 2
        }
      ];
      
      const summerActivities = [
        {
          seasonId: 'summer',
          title: 'River Tubing',
          description: 'Float down the Guadalupe, Comal, or San Marcos rivers on inner tubes - a classic Hill Country summer activity.',
          category: 'outdoor',
          iconClass: 'water',
          locations: ['New Braunfels', 'San Marcos', 'Wimberley'],
          tips: ['Bring sunscreen and water', 'Use a waterproof container for valuables', 'Go early to avoid crowds'],
          displayOrder: 1
        },
        {
          seasonId: 'summer',
          title: 'Swimming Holes',
          description: 'Cool off in the Hill Country\'s famous natural swimming spots, from spring-fed pools to hidden creek swimming holes.',
          category: 'outdoor',
          iconClass: 'swim',
          locations: ['Hamilton Pool', 'Krause Springs', 'Blue Hole', 'Barton Springs'],
          tips: ['Check reservation requirements', 'Arrive early for popular spots', 'Bring water shoes'],
          displayOrder: 2
        }
      ];
      
      const fallActivities = [
        {
          seasonId: 'fall',
          title: 'Fall Foliage Hikes',
          description: 'Explore the changing colors of the Hill Country on scenic hiking trails with moderate temperatures.',
          category: 'outdoor',
          iconClass: 'hiking',
          locations: ['Lost Maples State Natural Area', 'Garner State Park', 'Pedernales Falls'],
          tips: ['Visit in late October to early November for best colors', 'Make camping reservations well in advance', 'Bring plenty of water'],
          displayOrder: 1
        },
        {
          seasonId: 'fall',
          title: 'Harvest Festivals',
          description: 'Celebrate the season at fall festivals featuring pumpkin patches, corn mazes, and local food and drink.',
          category: 'cultural',
          iconClass: 'festival',
          locations: ['Fredericksburg', 'Boerne', 'Kerrville'],
          tips: ['Check event calendars for dates', 'Bring cash for vendors', 'Plan for family-friendly activities'],
          displayOrder: 2
        }
      ];
      
      const winterActivities = [
        {
          seasonId: 'winter',
          title: 'Holiday Light Displays',
          description: 'Experience magical holiday light shows and decorated towns throughout the Hill Country.',
          category: 'cultural',
          iconClass: 'sparkles',
          locations: ['Johnson City', 'Marble Falls', 'Fredericksburg'],
          tips: ['Visit on weeknights to avoid crowds', 'Check hours of operation', 'Bring warm clothes'],
          displayOrder: 1
        },
        {
          seasonId: 'winter',
          title: 'Cabin Getaways',
          description: 'Enjoy a cozy winter retreat in a Hill Country cabin, complete with fireplace and scenic views.',
          category: 'relaxation',
          iconClass: 'home',
          locations: ['Wimberley', 'Fredericksburg', 'Bandera'],
          tips: ['Book well in advance', 'Look for cabins with hot tubs or fireplaces', 'Pack for variable weather'],
          displayOrder: 2
        }
      ];
      
      // Combine all activities
      const allActivities = [
        ...springActivities,
        ...summerActivities,
        ...fallActivities,
        ...winterActivities
      ];
      
      // Insert all activities individually
      for (const activity of allActivities) {
        try {
          await db.insert(seasonalActivities).values(activity);
          console.log(`Successfully created activity: ${activity.title}`);
        } catch (err) {
          console.error(`Error creating activity ${activity.title}:`, err);
        }
      }
      
      console.log('Successfully initialized seasonal data with default values');
    } else {
      console.log('Seasonal data already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing seasonal data:', error);
  }
}