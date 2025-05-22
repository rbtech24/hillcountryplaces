import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageManager } from "@/components/admin/ImageManager";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface SiteSettingsManagerProps {
  setting: string;
}

export function SiteSettingsManager({ setting }: SiteSettingsManagerProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the specific site setting
  const { data: settingData, isLoading } = useQuery({
    queryKey: [`/api/site-settings/${setting}`],
    queryFn: async () => {
      const response = await fetch(`/api/site-settings/${setting}`);
      if (!response.ok) {
        if (response.status === 404) {
          return { key: setting, value: null };
        }
        throw new Error(`Failed to fetch setting: ${setting}`);
      }
      return response.json();
    }
  });

  // Update values when data loads
  useEffect(() => {
    if (settingData?.value) {
      setCurrentValue(settingData.value);
    }
  }, [settingData]);

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async (value: string) => {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: setting,
          value: value
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update site setting');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries for this setting and any that might use it
      queryClient.invalidateQueries({ queryKey: [`/api/site-settings/${setting}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      toast({
        title: "Setting Updated",
        description: `The ${setting} has been updated successfully.`,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update the site setting.",
      });
    }
  });

  // Handle image selection
  const handleImageSelect = (imageUrl: string) => {
    updateSettingMutation.mutate(imageUrl);
    setCurrentValue(imageUrl);
    setIsImageDialogOpen(false);
  };

  // Upload image dialog
  const ImageUploadDialog = () => (
    <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Choose an image for this setting
        </p>
        <div className="py-4">
          <ImageManager onSelectImage={handleImageSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div>
      <ImageUploadDialog />
      
      <div className="space-y-4">
        {setting === "heroImage" && (
          <div className="relative">
            <div className="aspect-[21/9] rounded-lg overflow-hidden bg-gray-100 border">
              {currentValue ? (
                <img 
                  src={currentValue} 
                  alt="Hero image" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsImageDialogOpen(true)}>
                {currentValue ? "Change Image" : "Select Image"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}