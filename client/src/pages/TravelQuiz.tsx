import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';
import { SEO } from '@/lib/seo';

// Define the quiz questions and options
const quizQuestions = [
  {
    id: 'travelStyle',
    question: 'What\'s your preferred travel style?',
    options: [
      { value: 'adventure', label: 'Adventure & Outdoor Activities' },
      { value: 'relaxation', label: 'Relaxation & Pampering' },
      { value: 'culture', label: 'Cultural Experiences & History' },
      { value: 'food', label: 'Food & Drink Exploration' },
      { value: 'family', label: 'Family-Friendly Activities' }
    ]
  },
  {
    id: 'stayDuration',
    question: 'How long do you plan to stay in the Hill Country?',
    options: [
      { value: 'dayTrip', label: 'Just a day trip' },
      { value: 'weekend', label: 'A weekend getaway' },
      { value: 'extended', label: 'An extended vacation (3-7 days)' },
      { value: 'week+', label: 'Over a week' }
    ]
  },
  {
    id: 'accommodation',
    question: 'What type of accommodation are you interested in?',
    options: [
      { value: 'luxury', label: 'Luxury resort or spa' },
      { value: 'cabin', label: 'Rustic cabin in nature' },
      { value: 'bnb', label: 'Charming bed & breakfast' },
      { value: 'camping', label: 'Camping or glamping' },
      { value: 'vacation', label: 'Vacation rental home' }
    ]
  },
  {
    id: 'activity',
    question: 'Which activity interests you the most?',
    options: [
      { value: 'hiking', label: 'Hiking and nature trails' },
      { value: 'wineries', label: 'Wine tasting and vineyards' },
      { value: 'swimming', label: 'Swimming in natural springs' },
      { value: 'shopping', label: 'Boutique shopping and antiquing' },
      { value: 'events', label: 'Festivals and local events' }
    ]
  },
  {
    id: 'season',
    question: 'When are you planning to visit?',
    options: [
      { value: 'spring', label: 'Spring (March-May)' },
      { value: 'summer', label: 'Summer (June-August)' },
      { value: 'fall', label: 'Fall (September-November)' },
      { value: 'winter', label: 'Winter (December-February)' },
      { value: 'flexible', label: 'I\'m flexible' }
    ]
  }
];

// Define Experience types that will be recommended
interface Experience {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
  matchScore?: number;
}

// Database of experiences to recommend
const experiences: Experience[] = [
  {
    title: 'Wine Trail Adventure',
    description: 'Explore the renowned Texas Wine Trail through the scenic hills, visiting award-winning wineries and vineyards with guided tastings.',
    imageUrl: '/images/attractions/wine-trail.jpg',
    link: '/attractions/category/wineries',
    tags: ['food', 'weekend', 'extended', 'luxury', 'bnb', 'wineries', 'fall', 'spring']
  },
  {
    title: 'Enchanted Rock Hiking Expedition',
    description: 'Challenge yourself with a hike up the massive pink granite dome for breathtaking panoramic views of the Hill Country landscape.',
    imageUrl: '/images/attractions/enchanted-rock.jpg',
    link: '/attractions/enchanted-rock',
    tags: ['adventure', 'dayTrip', 'weekend', 'camping', 'hiking', 'spring', 'fall']
  },
  {
    title: 'River Tubing Weekend',
    description: 'Float down the cool, crystal-clear Guadalupe or Comal Rivers on an inner tube - a quintessential Texas Hill Country summer experience.',
    imageUrl: '/images/attractions/river-tubing.jpg',
    link: '/attractions/river-tubing',
    tags: ['adventure', 'family', 'weekend', 'cabin', 'camping', 'swimming', 'summer']
  },
  {
    title: 'Fredericksburg German Heritage Tour',
    description: 'Immerse yourself in the unique German heritage of Fredericksburg with historic sites, authentic cuisine, and cultural attractions.',
    imageUrl: '/images/destinations/fredericksburg.jpg',
    link: '/destinations/fredericksburg',
    tags: ['culture', 'weekend', 'extended', 'bnb', 'shopping', 'flexible', 'fall', 'spring']
  },
  {
    title: 'Bluebonnet Trail Scenic Drive',
    description: 'Experience the breathtaking spring wildflower displays along the scenic routes during bluebonnet season (March-April).',
    imageUrl: '/images/attractions/bluebonnet-trail.jpg',
    link: '/blog/bluebonnet-season-guide',
    tags: ['relaxation', 'family', 'dayTrip', 'weekend', 'flexible', 'hiking', 'spring']
  },
  {
    title: 'Natural Springs Retreat',
    description: 'Cool off in the crystal-clear waters of natural springs like Hamilton Pool, Jacob\'s Well, or Blue Hole.',
    imageUrl: '/images/attractions/natural-springs.jpg',
    link: '/attractions/category/swimming-holes',
    tags: ['adventure', 'family', 'dayTrip', 'weekend', 'camping', 'cabin', 'swimming', 'summer']
  },
  {
    title: 'Luxury Spa Weekend',
    description: 'Indulge in relaxation at one of the Hill Country\'s premium spa resorts with treatments utilizing local ingredients.',
    imageUrl: '/images/cabins/luxury-resort.jpg',
    link: '/cabins/category/spa-resorts',
    tags: ['relaxation', 'weekend', 'extended', 'luxury', 'flexible', 'fall', 'winter', 'spring']
  },
  {
    title: 'Antique Shopping Trail',
    description: 'Hunt for treasures in the charming towns of Wimberley, Gruene, and Fredericksburg, known for their antique stores and boutiques.',
    imageUrl: '/images/attractions/antique-shopping.jpg',
    link: '/blog/antique-shopping-guide',
    tags: ['culture', 'relaxation', 'dayTrip', 'weekend', 'bnb', 'shopping', 'flexible']
  },
  {
    title: 'Hill Country Astronomy Adventure',
    description: 'Experience the dark skies of the Hill Country at night with stargazing events and astronomy programs.',
    imageUrl: '/images/attractions/stargazing.jpg',
    link: '/attractions/stargazing',
    tags: ['adventure', 'family', 'weekend', 'camping', 'cabin', 'flexible', 'summer', 'fall']
  },
  {
    title: 'Family Dude Ranch Experience',
    description: 'Enjoy horseback riding, campfires, and authentic ranch activities perfect for families looking for a unique Texas experience.',
    imageUrl: '/images/attractions/dude-ranch.jpg',
    link: '/attractions/dude-ranches',
    tags: ['adventure', 'family', 'extended', 'week+', 'vacation', 'flexible', 'spring', 'fall']
  },
  {
    title: 'Hill Country BBQ & Brewery Tour',
    description: 'Sample the finest Texas BBQ and craft beers at legendary smokehouses and microbreweries throughout the region.',
    imageUrl: '/images/attractions/bbq-tour.jpg',
    link: '/blog/hill-country-bbq-trail',
    tags: ['food', 'weekend', 'extended', 'cabin', 'vacation', 'flexible', 'summer', 'fall']
  },
  {
    title: 'Peach Season Orchard Tour',
    description: 'Visit the famous peach orchards around Fredericksburg and Stonewall during harvest season (May-August) for the sweetest treats.',
    imageUrl: '/images/attractions/peach-orchards.jpg',
    link: '/events/peach-season',
    tags: ['food', 'family', 'dayTrip', 'weekend', 'events', 'summer']
  },
  {
    title: 'Holiday Lights Trail',
    description: 'Experience the magic of Hill Country towns decorated with millions of lights during the festive season.',
    imageUrl: '/images/events/holiday-lights.jpg',
    link: '/events/holiday-lights-trail',
    tags: ['family', 'culture', 'weekend', 'bnb', 'luxury', 'events', 'winter']
  },
  {
    title: 'Lavender Farm Experience',
    description: 'Visit fragrant lavender farms in bloom (May-July), with tours, products, and photo opportunities in the purple fields.',
    imageUrl: '/images/attractions/lavender-farms.jpg',
    link: '/attractions/lavender-farms',
    tags: ['relaxation', 'family', 'dayTrip', 'weekend', 'shopping', 'spring', 'summer']
  },
  {
    title: 'Historic Dance Hall Tour',
    description: 'Step into Texas tradition at historic dance halls featuring live music, dancing, and authentic culture.',
    imageUrl: '/images/attractions/dance-halls.jpg',
    link: '/attractions/historic-dance-halls',
    tags: ['culture', 'food', 'weekend', 'bnb', 'events', 'flexible']
  }
];

// Calculate match scores between user answers and experiences
function calculateMatches(answers: any): Experience[] {
  // Extract user answers into an array
  const userTags = Object.values(answers);
  
  // Check if the user selected a stay longer than a day
  const stayDuration = answers.stayDuration;
  const isLongerStay = stayDuration && ['weekend', 'extended', 'week+'].includes(stayDuration);
  
  // Calculate a match score for each experience
  const scoredExperiences = experiences.map(experience => {
    // Count how many tags match between the user's answers and the experience
    const matchCount = experience.tags.filter(tag => userTags.includes(tag)).length;
    // Calculate a match percentage
    const matchScore = (matchCount / userTags.length) * 100;
    
    return {
      ...experience,
      matchScore
    };
  });
  
  // Sort experiences by match score (highest first) and slice the top matched experiences
  const topExperiences = scoredExperiences
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, isLongerStay ? 3 : 4);
    
  // Create cabin recommendations for longer stays
  if (isLongerStay) {
    let cabinType = "cabin"; // Default cabin type
    
    // Determine best cabin type based on accommodation preference
    if (answers.accommodation === 'luxury') {
      cabinType = "luxury";
    } else if (answers.accommodation === 'vacation') {
      cabinType = "vacation";
    }
    
    // Create a cabin recommendation based on user preferences
    const cabinRec: Experience = {
      title: "Perfect Cabin for Your Stay",
      description: `Find the ideal ${cabinType} accommodation for your Hill Country adventure. We have options perfect for ${stayDuration === 'weekend' ? 'weekend getaways' : 'extended stays'}.`,
      imageUrl: `/images/cabins/${cabinType}-cabin.jpg`,
      link: "/cabins",
      tags: [stayDuration, answers.accommodation || "cabin"],
      matchScore: 100 // High priority for cabin recommendation
    };
    
    // Add the cabin recommendation to the top experiences
    return [...topExperiences, cabinRec];
  }
  
  return topExperiences;
}

export default function TravelQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Experience[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const { register, handleSubmit } = useForm();
  
  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  
  // Handle next question or finish quiz
  const handleNext = () => {
    const questionId = quizQuestions[currentQuestion].id;
    const currentAnswer = answers[questionId];
    
    if (!currentAnswer) return; // Don't proceed if no answer selected
    
    if (currentQuestion < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz is complete, calculate recommendations
      const matches = calculateMatches(answers);
      setRecommendations(matches);
      setQuizComplete(true);
    }
  };
  
  // Handle going back to previous question
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  // Restart the quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setQuizComplete(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <SEO
        title="Hill Country Experience Quiz | Find Your Perfect Texas Adventure"
        description="Take our quick quiz to discover personalized Texas Hill Country experiences based on your travel style, interests, and preferences."
        canonical="/quiz"
        type="website"
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hill Country Experience Finder</h1>
          <p className="text-lg text-gray-600">
            Discover your perfect Texas Hill Country adventure with our quick personalized quiz
          </p>
        </div>
        
        {!quizComplete ? (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
                  <CardDescription>Tell us about your travel preferences</CardDescription>
                </div>
                <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            
            <CardContent>
              <form>
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium mb-4">
                    {quizQuestions[currentQuestion].question}
                  </legend>
                  
                  {/* Simple radio buttons to avoid the infinite loop error */}
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map(option => (
                      <div 
                        key={option.value}
                        className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          const updatedAnswers = {
                            ...answers,
                            [quizQuestions[currentQuestion].id]: option.value
                          };
                          setAnswers(updatedAnswers);
                        }}
                      >
                        <input 
                          type="radio" 
                          id={option.value} 
                          name={quizQuestions[currentQuestion].id}
                          value={option.value}
                          checked={answers[quizQuestions[currentQuestion].id] === option.value}
                          onChange={() => {}} // Required to avoid uncontrolled component warning
                          className="h-4 w-4 text-primary cursor-pointer"
                        />
                        <label htmlFor={option.value} className="flex-grow cursor-pointer font-medium ml-2">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[quizQuestions[currentQuestion].id]}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Your Personalized Recommendations</CardTitle>
                <CardDescription className="text-center">
                  Based on your preferences, here are your perfect Hill Country experiences
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {recommendations.map((exp, index) => (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${exp.imageUrl}')` }}
                  ></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      {exp.title}
                      {exp.title.includes("Cabin") && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Accommodation</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600">{exp.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button asChild variant="outline">
                      <Link href={exp.link}>Learn More</Link>
                    </Button>
                    
                    <div className="flex items-center">
                      <div className="text-xs text-green-700 bg-green-100 rounded-full px-2 py-1">
                        {Math.round(exp.matchScore || 0)}% Match
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col gap-4 items-center mt-8">
              <Button onClick={handleRestart} variant="outline">
                Take Quiz Again
              </Button>
              
              <div className="text-center text-sm text-gray-500 max-w-lg">
                <p>
                  Need more personalized recommendations? 
                  Try our <Link href="/travel-assistant" className="text-primary underline">AI Travel Assistant</Link> for 
                  even more customized suggestions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}