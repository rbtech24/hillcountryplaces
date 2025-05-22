import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageManager } from "./ImageManager";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the site areas where images can be managed
const siteAreas = [
  {
    id: "heroImages",
    title: "Hero Images",
    description: "Manage hero images across the website",
    settings: [
      { key: "heroImage", label: "Home Hero Image", description: "The main hero image displayed on the homepage" },
      { key: "destinationsHero", label: "Destinations Hero", description: "Hero image for the destinations page" },
      { key: "attractionsHero", label: "Attractions Hero", description: "Hero image for the attractions page" },
      { key: "eventsHero", label: "Events Hero", description: "Hero image for the events page" },
      { key: "cabinsHero", label: "Cabins Hero", description: "Hero image for the cabins page" },
      { key: "blogHero", label: "Blog Hero", description: "Hero image for the blog page" },
      { key: "calendarMapHero", label: "Calendar & Map Hero", description: "Hero image for the calendar and map page" },
      { key: "contactHero", label: "Contact Hero", description: "Hero image for the contact page" }
    ]
  },
  {
    id: "backgroundImages",
    title: "Background Images",
    description: "Manage background images for various sections of the website",
    settings: [
      { key: "subscribeBackground", label: "Subscribe Section Background", description: "Background image for the newsletter subscription section" },
      { key: "testimonialsBackground", label: "Testimonials Background", description: "Background image for the testimonials section" },
      { key: "aboutSectionBackground", label: "About Section Background", description: "Background image for the about us section" },
      { key: "contactBackground", label: "Contact Form Background", description: "Background image for the contact form section" },
      { key: "seasonalEventsBackground", label: "Seasonal Events Background", description: "Background image for the seasonal events section" },
      { key: "mapSectionBackground", label: "Map Section Background", description: "Background image behind the interactive map" }
    ]
  },
  {
    id: "galleryImages",
    title: "Gallery Images",
    description: "Manage featured gallery images for different sections",
    settings: [
      { key: "homeGallery1", label: "Home Gallery 1", description: "First gallery image on the homepage" },
      { key: "homeGallery2", label: "Home Gallery 2", description: "Second gallery image on the homepage" },
      { key: "homeGallery3", label: "Home Gallery 3", description: "Third gallery image on the homepage" },
      { key: "aboutGallery1", label: "About Gallery 1", description: "First gallery image on the about page" },
      { key: "aboutGallery2", label: "About Gallery 2", description: "Second gallery image on the about page" },
      { key: "aboutGallery3", label: "About Gallery 3", description: "Third gallery image on the about page" }
    ]
  },
  {
    id: "categoryImages",
    title: "Category Images",
    description: "Manage images for different categories across the site",
    settings: [
      { key: "categoryCulturalImage", label: "Cultural Category Image", description: "Image representing the Cultural category" },
      { key: "categoryOutdoorImage", label: "Outdoor Category Image", description: "Image representing the Outdoor category" },
      { key: "categoryWineryImage", label: "Winery Category Image", description: "Image representing the Winery category" },
      { key: "categoryFestivalImage", label: "Festival Category Image", description: "Image representing the Festival category" },
      { key: "categoryFamilyImage", label: "Family Category Image", description: "Image representing the Family category" },
      { key: "categoryLodgingImage", label: "Lodging Category Image", description: "Image representing the Lodging category" }
    ]
  },
  {
    id: "logoAndIcons",
    title: "Logo & Icons",
    description: "Manage your site logo and various icons",
    settings: [
      { key: "siteLogo", label: "Site Logo", description: "Your website's main logo" },
      { key: "footerLogo", label: "Footer Logo", description: "Logo displayed in the website footer" },
      { key: "favicon", label: "Favicon", description: "Icon shown in browser tabs" },
      { key: "logoLight", label: "Light Mode Logo", description: "Logo displayed when the site is in light mode" },
      { key: "logoDark", label: "Dark Mode Logo", description: "Logo displayed when the site is in dark mode" },
      { key: "mobileMenuLogo", label: "Mobile Menu Logo", description: "Logo displayed in the mobile menu" }
    ]
  },
  {
    id: "defaultImages",
    title: "Default Images",
    description: "Manage default placeholder images for your content",
    settings: [
      { key: "defaultDestinationImage", label: "Default Destination Image", description: "Default image for destinations with no custom image" },
      { key: "defaultEventImage", label: "Default Event Image", description: "Default image for events with no custom image" },
      { key: "defaultAttractionImage", label: "Default Attraction Image", description: "Default image for attractions with no custom image" },
      { key: "defaultCabinImage", label: "Default Cabin Image", description: "Default image for cabins with no custom image" },
      { key: "defaultBlogImage", label: "Default Blog Image", description: "Default image for blog posts with no custom image" },
      { key: "defaultTestimonialImage", label: "Default Testimonial Image", description: "Default image for testimonials with no custom image" },
      { key: "defaultAuthorImage", label: "Default Author Image", description: "Default image for blog authors with no custom image" }
    ]
  },
  {
    id: "socialImages",
    title: "Social Images",
    description: "Manage images used for social media and sharing",
    settings: [
      { key: "ogDefaultImage", label: "Default Open Graph Image", description: "Default image used when sharing pages on social media" },
      { key: "ogHomeImage", label: "Home Page OG Image", description: "Image used when sharing the home page" },
      { key: "ogDestinationsImage", label: "Destinations OG Image", description: "Image used when sharing the destinations page" },
      { key: "ogEventsImage", label: "Events OG Image", description: "Image used when sharing the events page" },
      { key: "ogBlogImage", label: "Blog OG Image", description: "Image used when sharing the blog page" }
    ]
  }
];

export function SiteImageManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("heroImages");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<{ key: string, label: string } | null>(null);

  // Query to fetch all site settings
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const response = await fetch('/api/site-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }
      return response.json();
    }
  });

  // Format site settings into a map for easier access
  const settingsMap = new Map();
  
  useEffect(() => {
    if (siteSettings) {
      siteSettings.forEach((setting: any) => {
        settingsMap.set(setting.key, setting.value);
      });
    }
  }, [siteSettings]);

  // Mutation to update a site setting
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update setting: ${key}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({
        title: "Setting Updated",
        description: `${currentSetting?.label} has been updated successfully.`
      });
      setIsImageDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update setting: ${error.message}`
      });
    }
  });

  // Handle image selection from the dialog
  const handleImageSelect = (imageUrl: string) => {
    if (currentSetting) {
      updateSettingMutation.mutate({
        key: currentSetting.key,
        value: imageUrl
      });
    }
  };

  // Open image selection dialog for a specific setting
  const openImageDialog = (setting: { key: string, label: string }) => {
    setCurrentSetting(setting);
    setIsImageDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading site image settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Site Images</h2>
          <p className="text-muted-foreground">
            Manage all images displayed across your website
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
          {siteAreas.map(area => (
            <TabsTrigger key={area.id} value={area.id}>
              {area.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {siteAreas.map(area => (
          <TabsContent key={area.id} value={area.id} className="space-y-4">
            <p className="text-muted-foreground mb-4">{area.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {area.settings.map(setting => {
                const currentValue = settingsMap.get(setting.key);
                
                return (
                  <Card key={setting.key}>
                    <CardHeader>
                      <CardTitle className="text-lg">{setting.label}</CardTitle>
                      <CardDescription>{setting.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentValue ? (
                          <div className="space-y-2">
                            <div className="rounded-md overflow-hidden border bg-muted h-40 relative group">
                              <img 
                                src={currentValue} 
                                alt={setting.label}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2 text-white text-xs truncate">
                                {currentValue.split('/').pop()}
                              </div>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="outline" size="sm" onClick={() => window.open(currentValue, '_blank')} className="text-white border-white hover:bg-white/20 hover:text-white">
                                  View Full Size
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground break-all">
                              <span className="font-semibold">Path:</span> {currentValue}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-md overflow-hidden border border-dashed bg-muted h-40 flex flex-col items-center justify-center">
                            <span className="text-muted-foreground mb-1">No image set</span>
                            <span className="text-xs text-muted-foreground">Click below to select an image</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={() => openImageDialog(setting)}
                        className="w-full"
                        variant={currentValue ? "outline" : "default"}
                      >
                        {currentValue ? "Change Image" : "Set Image"}
                      </Button>
                      {currentValue && (
                        <Button 
                          onClick={() => updateSettingMutation.mutate({
                            key: setting.key,
                            value: ""
                          })} 
                          variant="destructive" 
                          className="w-full sm:w-auto"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Image selection dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentSetting ? `Select Image for ${currentSetting.label}` : "Select Image"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a new image or select an existing one
          </p>
          <ImageManager onSelectImage={handleImageSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
}