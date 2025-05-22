import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Season {
  id: string;
  name: string;
  months: string[];
  description: string;
  highlights: string[];
  iconClass: string;
  bgClass: string;
  textClass: string;
}

interface SeasonalFilterProps {
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
}

const seasons: Season[] = [
  {
    id: 'spring',
    name: 'Spring',
    months: ['March', 'April', 'May'],
    description: 'Wildflowers bloom, temperatures range from 60-85°F with occasional rain showers.',
    highlights: ['Bluebonnet festivals', 'Wine trail events', 'Outdoor markets'],
    iconClass: 'fa-seedling',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-600'
  },
  {
    id: 'summer',
    name: 'Summer',
    months: ['June', 'July', 'August'],
    description: 'Hot temperatures (85-100°F) with plenty of sunshine and swimming opportunities.',
    highlights: ['River tubing', 'Music festivals', 'Fourth of July celebrations'],
    iconClass: 'fa-sun',
    bgClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-600'
  },
  {
    id: 'fall',
    name: 'Fall',
    months: ['September', 'October', 'November'],
    description: 'Cooling temperatures (65-85°F) with lower humidity and beautiful foliage.',
    highlights: ['Harvest festivals', 'Oktoberfest celebrations', 'Pumpkin patches'],
    iconClass: 'fa-leaf',
    bgClass: 'bg-orange-50 border-orange-200',
    textClass: 'text-orange-600'
  },
  {
    id: 'winter',
    name: 'Winter',
    months: ['December', 'January', 'February'],
    description: 'Cooler temperatures (40-65°F) with occasional freezes and hill country charm.',
    highlights: ['Holiday light trails', 'Wine & chocolate events', 'Small town celebrations'],
    iconClass: 'fa-snowflake',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-600'
  },
  {
    id: 'all',
    name: 'All Seasons',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    description: 'View events across all seasons of the Hill Country.',
    highlights: [],
    iconClass: 'fa-calendar-alt',
    bgClass: 'bg-gray-50 border-gray-200',
    textClass: 'text-gray-600'
  }
];

export function SeasonalFilter({ selectedSeason, onSeasonChange }: SeasonalFilterProps) {
  // Get current season based on date
  const getCurrentSeason = (): string => {
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };
  
  const activeSeason = selectedSeason || getCurrentSeason();
  const currentSeason = seasons.find(s => s.id === activeSeason) || seasons[4]; // Default to "All Seasons"
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        {seasons.map((season) => (
          <Button
            key={season.id}
            variant={activeSeason === season.id ? "default" : "outline"}
            onClick={() => onSeasonChange(season.id)}
            className={`${activeSeason === season.id ? '' : season.bgClass} transition-all`}
          >
            <i className={`fas ${season.iconClass} mr-2`}></i>
            {season.name}
          </Button>
        ))}
      </div>
      
      <Card className={`${currentSeason.bgClass} border-2 transition-all`}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="flex items-center mb-2">
                <i className={`fas ${currentSeason.iconClass} text-2xl ${currentSeason.textClass} mr-3`}></i>
                <h3 className="text-xl font-semibold">{currentSeason.name} in the Hill Country</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                {currentSeason.description}
              </p>
              
              {currentSeason.id !== 'all' && (
                <div className="mb-1">
                  <span className="text-sm font-medium text-gray-600 mr-2">Months:</span>
                  {currentSeason.months.map((month) => (
                    <Badge key={month} variant="outline" className="mr-1">
                      {month}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {currentSeason.id !== 'all' && currentSeason.highlights.length > 0 && (
              <div className="md:w-1/3 bg-white bg-opacity-60 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-gray-800">Seasonal Highlights</h4>
                <ul className="space-y-1">
                  {currentSeason.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`inline-block mt-1 h-1.5 w-1.5 rounded-full ${currentSeason.textClass.replace('text', 'bg')}`}></span>
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SeasonalFilter;