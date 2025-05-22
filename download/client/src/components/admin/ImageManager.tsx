import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Image = {
  id: number;
  url: string;
  alt: string;
  createdAt: string;
  category?: string;
};

// Define image categories for better organization
const imageCategories = [
  { id: "all", name: "All Images" },
  { id: "hero", name: "Hero Images" },
  { id: "background", name: "Backgrounds" },
  { id: "gallery", name: "Gallery" },
  { id: "icon", name: "Icons & Logos" },
  { id: "category", name: "Category Images" },
  { id: "default", name: "Default Images" },
  { id: "other", name: "Other" }
];

export function ImageManager({ onSelectImage }: { onSelectImage: (url: string) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCategory, setImageCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setImageAlt(file.name.split('.')[0]); // Use filename as default alt text
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  // Fetch all images
  const { data: images, isLoading } = useQuery({
    queryKey: ["admin", "images"],
    queryFn: async () => {
      const response = await fetch("/api/admin/images");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      return response.json();
    },
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", imageAlt || file.name);
      formData.append("category", imageCategory !== "all" ? imageCategory : "other");
      
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      setIsUploading(false);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "images"] });
      setUploadedFile(null);
      setImageAlt("");
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: () => {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
    },
  });

  // Add new image mutation (for URL-based images)
  const addImageMutation = useMutation({
    mutationFn: async (data: { url: string; alt: string; category?: string }) => {
      const response = await fetch("/api/admin/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add image");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "images"] });
      setImageUrl("");
      setImageAlt("");
      toast({
        title: "Success",
        description: "Image added successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add image",
      });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "images"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      });
    },
  });

  const handleAddImage = () => {
    if (!imageUrl) return;
    
    addImageMutation.mutate({
      url: imageUrl,
      alt: imageAlt || "Image description",
      category: imageCategory !== "all" ? imageCategory : "other"
    });
  };
  
  const handleUploadFile = () => {
    if (!uploadedFile) return;
    uploadFileMutation.mutate(uploadedFile);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image from your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'}
                `}
              >
                <input {...getInputProps()} />
                {uploadedFile ? (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <div className="w-full max-h-32 overflow-hidden rounded-md">
                      <img 
                        src={URL.createObjectURL(uploadedFile)} 
                        alt="Preview" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <p className="text-sm">
                      {isDragActive ? 
                        "Drop image here..." : 
                        "Drag & drop an image here, or click to select"
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {uploadedFile && (
                <div className="space-y-2">
                  <Label htmlFor="uploadImageAlt">Image Description</Label>
                  <Input
                    id="uploadImageAlt"
                    placeholder="Description of the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUploadFile} 
              disabled={!uploadedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* URL Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add Image URL</CardTitle>
            <CardDescription>Add a new image URL to your library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageAlt">Image Description</Label>
                <Input
                  id="imageAlt"
                  placeholder="Description of the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageCategory">Image Category</Label>
                <select 
                  id="imageCategory"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                >
                  {imageCategories.filter(category => category.id !== "all").map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddImage} disabled={!imageUrl}>Add Image</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search images by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={imageCategory}
              onChange={(e) => setImageCategory(e.target.value)}
            >
              {imageCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Image Library</h3>
          <div className="text-sm text-muted-foreground">
            {images ? `${images.length} images total` : 'Loading...'}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading images...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images && images.length > 0 ? (
            images
              .filter((image: Image) => {
                // Apply all filters (search and category)
                let shouldInclude = true;
                
                // Filter by search query
                if (searchQuery) {
                  const query = searchQuery.toLowerCase();
                  shouldInclude = shouldInclude && (
                    image.url.toLowerCase().includes(query) ||
                    image.alt.toLowerCase().includes(query)
                  );
                }
                
                // Filter by category
                if (imageCategory !== "all" && (image as any).category) {
                  shouldInclude = shouldInclude && (image as any).category === imageCategory;
                }
                
                return shouldInclude;
              })
              .map((image: Image) => (
                <div key={image.id} className="relative group border rounded-md overflow-hidden bg-muted">
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 py-1 px-2 text-white text-xs truncate">
                      {image.url.split('/').pop()}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col gap-2 w-full px-4">
                      <Button
                        size="sm"
                        onClick={() => onSelectImage(image.url)}
                        variant="secondary"
                        className="w-full"
                      >
                        Select
                      </Button>
                      <div className="flex gap-2 w-full">
                        <Button
                          size="sm"
                          onClick={() => window.open(image.url, '_blank')}
                          variant="outline"
                          className="flex-1"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImageMutation.mutate(image.id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-xs text-muted-foreground truncate">
                      {image.alt || "No description"}
                    </div>
                    {image.category && (
                      <div className="text-xs flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                        <span className="capitalize">{image.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground mb-2">No images found.</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                    size="sm"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
        </div>
      )}
      
      {images && images.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Select an image to use it in your content or click "View" to see the full-size version.
          </p>
        </div>
      )}
    </div>
  );
}