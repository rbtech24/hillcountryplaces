import { storage } from '../server/storage.js';

async function createSampleBlogPosts() {
  try {
    // Sample blog post 1
    await storage.createBlogPost({
      title: "Top 10 Hidden Gems in the Texas Hill Country",
      slug: "top-10-hidden-gems-texas-hill-country",
      content: "<h2>Discover the Secret Spots of the Hill Country</h2><p>The Texas Hill Country is famous for its rolling landscapes, charming towns, and vibrant culture. But beyond the well-known attractions lie hidden treasures waiting to be discovered.</p><p>Here are ten lesser-known spots that locals love but tourists often miss:</p><ol><li><strong>Hamilton Pool Preserve</strong> - This natural pool created when an underground river collapsed is a geological wonder.</li><li><strong>Jacob's Well</strong> - A natural spring and underwater cave system offering crystal clear waters for swimming.</li><li><strong>Old Tunnel State Park</strong> - Watch millions of bats emerge at sunset from this converted railroad tunnel.</li><li><strong>Gorman Falls</strong> - A 70-foot waterfall hidden within Colorado Bend State Park.</li><li><strong>Utopia</strong> - This tiny town lives up to its name with peaceful scenery and the famous Utopia Animal Rescue Ranch.</li><li><strong>Willow City Loop</strong> - A 13-mile scenic drive that's spectacular during wildflower season.</li><li><strong>Castell</strong> - A historic German settlement with great fishing on the Llano River.</li><li><strong>Cave Without a Name</strong> - Stunning underground formations in this natural limestone cavern.</li><li><strong>Krause Springs</strong> - A private property with 32 springs feeding natural and man-made pools.</li><li><strong>The Devil's Backbone</strong> - A winding scenic drive with panoramic views and reportedly haunted history.</li></ol><p>These hidden gems offer authentic Hill Country experiences without the crowds. Pack a picnic, bring your camera, and prepare for adventure!</p>",
      excerpt: "Discover the lesser-known treasures of Texas Hill Country that locals love but tourists often miss. From secret swimming holes to scenic drives, these spots offer authentic experiences away from the crowds.",
      imageUrl: "/images/hill-country-hidden-gems.jpg",
      category: "Destinations",
      author: "Hill Country Team",
      tags: ["hidden gems", "local favorites", "outdoor adventures"],
      featured: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample blog post 2
    await storage.createBlogPost({
      title: "Best Season to Visit the Texas Hill Country",
      slug: "best-season-visit-texas-hill-country",
      content: "<h2>When to Plan Your Hill Country Adventure</h2><p>The Texas Hill Country is beautiful year-round, but each season offers a unique experience.</p><h3>Spring (March-May)</h3><p>Spring is arguably the most spectacular time to visit the Hill Country. The region comes alive with vibrant wildflowers, particularly the iconic bluebonnets that blanket the hillsides. The weather is mild, with daytime temperatures typically ranging from 70-85°F. This is the perfect time for scenic drives, hiking, and outdoor photography.</p><h3>Summer (June-August)</h3><p>Summers are hot in the Hill Country, with temperatures often exceeding 90°F. However, this is also when the region's swimming holes, rivers, and lakes become especially appealing. Tubing down the Guadalupe or Comal Rivers is a favorite summer activity. Morning and evening hikes are still enjoyable, and many indoor attractions offer a cool respite during the heat of the day.</p><h3>Fall (September-November)</h3><p>Fall brings relief from the summer heat, with comfortable temperatures and less humidity. The changing colors of cypress trees add splashes of orange and red to the landscape. This is an excellent time for wine tours, as many vineyards are harvesting their grapes. Fall festivals celebrate the region's German heritage, with Oktoberfest celebrations in several towns.</p><h3>Winter (December-February)</h3><p>Winters are mild compared to northern states, with daytime temperatures usually between 50-65°F. The Hill Country takes on a serene quality, with fewer tourists and a more relaxed pace. This is an ideal time to explore the charming small towns, visit museums, and enjoy the region's culinary offerings without the crowds. The holiday season brings festive lights and celebrations to towns like Fredericksburg and Johnson City.</p><p>No matter when you visit, the Texas Hill Country offers remarkable experiences for every type of traveler. Plan according to your interests, and you're sure to fall in love with this special part of Texas.</p>",
      excerpt: "Discover the ideal time to visit the Texas Hill Country. From spring wildflowers to summer swimming holes, fall festivals, and winter tranquility, each season has its own unique charm and attractions to explore.",
      imageUrl: "/images/hill-country-seasons.jpg",
      category: "Travel Planning",
      author: "Sarah Johnson",
      tags: ["seasonal guide", "travel planning", "weather"],
      featured: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample blog post 3
    await storage.createBlogPost({
      title: "Hill Country Wine Trail: A Tasting Guide",
      slug: "hill-country-wine-trail-tasting-guide",
      content: "<h2>Discover Texas Wine Country</h2><p>The Texas Hill Country has become one of America's premier wine destinations, second only to Napa Valley in wine tourism. With over 50 wineries scattered across the picturesque landscape, there's plenty to explore for wine enthusiasts of all levels.</p><h3>The Texas Wine Story</h3><p>Though you might not immediately associate Texas with wine production, the state actually has a long history of winemaking dating back to the 1650s when Spanish missionaries planted the first vines. Today, the Hill Country's unique terroir—characterized by its limestone soil, elevation, and climate—creates distinctive wines that are gaining international recognition.</p><h3>Notable Wineries to Visit</h3><ul><li><strong>Becker Vineyards</strong> - One of the region's pioneers, known for their award-winning Viognier and lavender fields.</li><li><strong>Duchman Family Winery</strong> - Specializing in Italian varietals in a stunning Tuscan-inspired setting.</li><li><strong>Fall Creek Vineyards</strong> - One of Texas' oldest wineries with excellent Chenin Blanc and Merlot.</li><li><strong>William Chris Vineyards</strong> - Focused on 100% Texas-grown wines with minimal intervention techniques.</li><li><strong>Pedernales Cellars</strong> - Award-winning Tempranillo and beautiful hill-top views.</li></ul><h3>Planning Your Wine Trail Adventure</h3><p>The wine trail stretches from just west of Austin and San Antonio to the Edwards Plateau. Given the distances between wineries, it's best to choose a specific area to focus on for a day trip, or plan a weekend getaway to explore more thoroughly.</p><p>Consider visiting during weekdays or making early reservations for weekend visits, as many tasting rooms become quite busy, especially during peak seasons (spring and fall).</p><h3>Beyond Wine</h3><p>Many wineries offer more than just tastings. Look for those with vineyard tours, food pairings, live music, or special events. Some have beautiful grounds perfect for a picnic lunch between tastings.</p><p>Remember to drink responsibly and consider booking a tour service or designating a driver if you plan to visit multiple wineries in one day.</p><p>The Hill Country wine experience combines Texas hospitality with world-class wines—all set against the backdrop of one of the state's most beautiful regions. Cheers to your tasting adventure!</p>",
      excerpt: "Explore the burgeoning wine scene of the Texas Hill Country with this comprehensive guide. Discover top wineries, tasting tips, and how to plan the perfect wine trail adventure through this beautiful region.",
      imageUrl: "/images/hill-country-wine-trail.jpg",
      category: "Food & Drink",
      author: "Michael Torres",
      tags: ["wine", "vineyards", "tasting", "food"],
      featured: false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Sample blog posts created successfully');
  } catch (error) {
    console.error('Error creating sample blog posts:', error);
  }
}

createSampleBlogPosts();

// Add export to make it a proper ES module
export {};