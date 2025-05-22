import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface SeasonalActivity {
  title: string;
  description: string;
  category: string;
  locations: string[];
  tips: string[];
  iconClass: string;
}

interface SeasonalActivitiesProps {
  season: string;
}

// Data for each season's activities
const activitiesBySeason: Record<string, SeasonalActivity[]> = {
  spring: [
    {
      title: 'Wildflower Viewing',
      description: 'Spring in the Hill Country is famous for bluebonnets and other wildflowers that carpet the countryside in vibrant colors.',
      category: 'Outdoor',
      locations: ['Willow City Loop', 'Lady Bird Johnson Wildflower Center', 'Highway 281'],
      tips: [
        'Peak bluebonnet season is typically late March to mid-April',
        'Early morning or late afternoon provides the best lighting for photos',
        'Stay on designated paths and respect private property'
      ],
      iconClass: 'fa-flower'
    },
    {
      title: 'Wine Tasting Tours',
      description: 'Spring wine releases are celebrated throughout the region with special events at wineries.',
      category: 'Food & Drink',
      locations: ['Fredericksburg Wine Road 290', 'Driftwood', 'Marble Falls'],
      tips: [
        'Many wineries offer spring release weekends in March and April',
        'Consider booking a tour or hiring a driver to visit multiple wineries safely',
        'Make reservations in advance for tasting rooms during weekends'
      ],
      iconClass: 'fa-wine-glass-alt'
    },
    {
      title: 'Hiking & Biking',
      description: 'Pleasant temperatures make spring ideal for exploring trails and parks throughout the Hill Country.',
      category: 'Outdoor',
      locations: ['Enchanted Rock', 'Pedernales Falls State Park', 'Lost Maples State Natural Area'],
      tips: [
        'Carry plenty of water and wear sun protection even in mild weather',
        'Check park websites for trail conditions after spring rains',
        'Watch for wildlife that becomes more active in spring'
      ],
      iconClass: 'fa-hiking'
    }
  ],
  summer: [
    {
      title: 'River Activities',
      description: 'Tubing, swimming, and kayaking in the rivers provide refreshing relief from summer heat.',
      category: 'Water',
      locations: ['Guadalupe River', 'Comal River', 'San Marcos River'],
      tips: [
        'Arrive early to secure parking and avoid crowds, especially on weekends',
        'Bring water shoes, sunscreen, and a waterproof bag for valuables',
        'Check river flow conditions before your trip - too low or too high can impact your experience'
      ],
      iconClass: 'fa-water'
    },
    {
      title: 'Cave Tours',
      description: 'Underground caverns maintain cool temperatures year-round, making them perfect summer destinations.',
      category: 'Attraction',
      locations: ['Natural Bridge Caverns', 'Cave Without a Name', 'Inner Space Cavern'],
      tips: [
        'Caves maintain temperatures around 70°F regardless of outside heat',
        'Wear closed-toe shoes with good traction on slippery surfaces',
        'Photography may be challenging due to low light conditions'
      ],
      iconClass: 'fa-mountain'
    },
    {
      title: 'Outdoor Concerts',
      description: 'Summer evenings come alive with music at outdoor venues and dance halls across the region.',
      category: 'Entertainment',
      locations: ['Gruene Hall', 'Whitewater Amphitheater', 'Luckenbach Texas'],
      tips: [
        'Bring lawn chairs or blankets for outdoor venues',
        'Check event schedules as many venues offer free or low-cost concerts during weekdays',
        'Some historic dance halls are not air conditioned - dress accordingly'
      ],
      iconClass: 'fa-music'
    }
  ],
  fall: [
    {
      title: 'Fall Foliage Tours',
      description: 'While more subtle than New England, the Hill Country offers beautiful autumn colors, especially in certain areas.',
      category: 'Scenic',
      locations: ['Lost Maples State Natural Area', 'Garner State Park', 'Medina River'],
      tips: [
        'Peak fall colors usually occur in late October through mid-November',
        'Lost Maples has a fall foliage report on their website during the season',
        'Weekdays offer a more peaceful experience with fewer crowds'
      ],
      iconClass: 'fa-leaf'
    },
    {
      title: 'Harvest Festivals',
      description: 'Fall brings numerous harvest-themed events celebrating wine, food, and local culture.',
      category: 'Festival',
      locations: ['Fredericksburg', 'New Braunfels', 'Kerrville'],
      tips: [
        'Oktoberfest and wine harvest festivals are popular in September and October',
        'Book accommodations well in advance for festival weekends',
        'Many events feature local artisans offering unique holiday gift options'
      ],
      iconClass: 'fa-wheat'
    },
    {
      title: 'Pumpkin Patches',
      description: 'Family-friendly fall activities abound at farms throughout the region.',
      category: 'Family',
      locations: ['Hwy 290 between Johnson City and Fredericksburg', 'Marble Falls area', 'Boerne'],
      tips: [
        'Many farms offer additional activities like hayrides and petting zoos',
        'Weekends often feature special events and food vendors',
        'Check farm websites for operating hours as they vary widely'
      ],
      iconClass: 'fa-pumpkin'
    }
  ],
  winter: [
    {
      title: 'Holiday Light Trails',
      description: 'Towns throughout the Hill Country decorate for the season with spectacular light displays.',
      category: 'Holiday',
      locations: ['Johnson City', 'Marble Falls', 'Fredericksburg'],
      tips: [
        'The Marble Falls Walkway of Lights and Johnson City Lights Spectacular are must-sees',
        'Weeknights generally have lighter crowds than weekends',
        'Some displays remain up through early January'
      ],
      iconClass: 'fa-lights-holiday'
    },
    {
      title: 'Wine & Chocolate Tours',
      description: 'Winter is a cozy time to visit tasting rooms, with many offering special pairings.',
      category: 'Food & Drink',
      locations: ['Fredericksburg Wine Road 290', 'Dripping Springs', 'Comfort'],
      tips: [
        'Many wineries offer special Valentine events in February',
        'Winter is a great time to chat with winemakers as tasting rooms are less crowded',
        'Check winery websites for winter hours as some reduce their schedule'
      ],
      iconClass: 'fa-wine-bottle'
    },
    {
      title: 'Antique Shopping',
      description: 'Explore the many antique shops and boutiques in the comfortable winter weather.',
      category: 'Shopping',
      locations: ['Wimberley', 'Gruene', 'Fredericksburg'],
      tips: [
        'January often features post-holiday sales at many shops',
        'Wimberley Market Days runs year-round on the first Saturday of each month',
        'Combine shopping with cozy coffee shops and cafes for a perfect winter day'
      ],
      iconClass: 'fa-store'
    }
  ],
  all: [
    {
      title: 'Year-Round Activities',
      description: 'The Hill Country offers numerous activities to enjoy regardless of season.',
      category: 'General',
      locations: ['Throughout Hill Country'],
      tips: [
        'Weather can vary significantly - always check forecasts before your visit',
        'Consider weekday visits to avoid crowds at popular attractions',
        'Many small towns have visitor centers with helpful local information'
      ],
      iconClass: 'fa-calendar-alt'
    }
  ]
};

// Category styling
const categoryColors: Record<string, string> = {
  'Outdoor': 'bg-green-100 text-green-800',
  'Water': 'bg-blue-100 text-blue-800',
  'Food & Drink': 'bg-purple-100 text-purple-800',
  'Entertainment': 'bg-indigo-100 text-indigo-800',
  'Scenic': 'bg-amber-100 text-amber-800',
  'Festival': 'bg-pink-100 text-pink-800',
  'Family': 'bg-teal-100 text-teal-800',
  'Holiday': 'bg-red-100 text-red-800',
  'Attraction': 'bg-cyan-100 text-cyan-800',
  'Shopping': 'bg-yellow-100 text-yellow-800',
  'General': 'bg-gray-100 text-gray-800'
};

const SeasonalActivities = ({ season }: SeasonalActivitiesProps) => {
  const activities = activitiesBySeason[season] || activitiesBySeason.all;
  
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No seasonal activities available.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Popular Activities</h3>
      
      <Tabs defaultValue={activities[0].title.toLowerCase().replace(/\s+/g, '-')}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
          {activities.map((activity) => (
            <TabsTrigger 
              key={activity.title} 
              value={activity.title.toLowerCase().replace(/\s+/g, '-')}
              className="text-sm md:text-base"
            >
              <i className={`fas ${activity.iconClass} mr-2`}></i>
              {activity.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {activities.map((activity) => (
          <TabsContent 
            key={activity.title} 
            value={activity.title.toLowerCase().replace(/\s+/g, '-')}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{activity.title}</CardTitle>
                  <Badge className={categoryColors[activity.category] || 'bg-gray-100 text-gray-800'}>
                    {activity.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{activity.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2">Best Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.locations.map((location) => (
                      <Badge key={location} variant="outline">{location}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Visitor Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {activity.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-sm text-gray-600 italic">
                <p>Best enjoyed during {season === 'all' ? 'any season' : season}.</p>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SeasonalActivities;