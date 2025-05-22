import { storage } from '../server/storage';

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

    console.log('Sample blog posts created successfully');
  } catch (error) {
    console.error('Error creating sample blog posts:', error);
  }
}

createSampleBlogPosts();