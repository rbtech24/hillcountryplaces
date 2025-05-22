import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@tinymce/tinymce-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ImageManager } from "@/components/admin/ImageManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { SiteImageManager } from "@/components/admin/SiteImageManager";
import { apiRequest } from "@/lib/queryClient";

type AdminSession = {
  authenticated: boolean;
  adminId?: number;
  username?: string;
};

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState("settings");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isAddNewDialogOpen, setIsAddNewDialogOpen] = useState(false);
  const [newItemData, setNewItemData] = useState<Record<string, any>>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    imageUrl: "",
    location: ""
  });

  // Check if user is logged in
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['adminSession'],
    queryFn: async () => {
      const response = await fetch('/api/admin/session');
      return response.json() as Promise<AdminSession>;
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && session && !session.authenticated) {
      setLocation('/admin/login');
    }
  }, [session, sessionLoading, setLocation]);

  // Fetch data based on current tab
  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['admin', currentTab],
    queryFn: async () => {
      // Skip API call for settings and images tabs
      if (currentTab === "settings" || currentTab === "images") {
        return null;
      }
      
      const response = await fetch(`/api/admin/${currentTab}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${currentTab}`);
      }
      return response.json();
    },
    enabled: !!session?.authenticated && currentTab !== "settings" && currentTab !== "images"
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setLocation('/admin/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred during logout."
      });
    }
  };

  // Handle adding new item
  const handleAddNewItem = (contentType: string) => {
    if (contentType === "blog") {
      setNewItemData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        category: "Tips & Guides",
        author: "Hill Country Team",
        tags: []
      });
    } else {
      setNewItemData({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        imageUrl: "",
        location: contentType === "cabins" || contentType === "events" ? "Wimberley, TX" : ""
      });
    }
    setIsAddNewDialogOpen(true);
  };

  // Handle item selection
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setEditContent(currentTab === "blog" ? item.content || "" : item.description || "");
  };

  // Add new item mutation
  const addItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/admin/${currentTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', currentTab] });
      setIsAddNewDialogOpen(false);
      toast({
        title: "Success",
        description: `New ${currentTab.slice(0, -1)} has been created.`
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create new ${currentTab.slice(0, -1)}.`
      });
    }
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/admin/${currentTab}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', currentTab] });
      toast({
        title: "Saved",
        description: "Content updated successfully."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save content changes."
      });
    }
  });

  // Handle adding a new item
  const handleCreateNewItem = () => {
    // Prepare the data based on content type
    let itemData: any = {
      ...newItemData,
      featured: false
    };
    
    if (currentTab === "blog") {
      // Create a slug from the title if not provided
      const slug = newItemData.slug || 
        newItemData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      itemData = {
        ...itemData,
        slug,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        tags: Array.isArray(newItemData.tags) ? newItemData.tags : []
      };
    } else {
      // Create a slug from the name if not provided
      const slug = newItemData.slug || 
        newItemData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      itemData.slug = slug;
      
      // Add specific fields based on content type
      if (currentTab === "attractions") {
        itemData.category = "Outdoor Adventures";
        itemData.rating = 45;
        itemData.reviewCount = 10;
      } else if (currentTab === "events") {
        itemData.startDate = new Date();
        itemData.endDate = new Date(Date.now() + 86400000); // One day later
        itemData.category = "Festival";
      } else if (currentTab === "cabins") {
        itemData.rating = 50;
        itemData.reviewCount = 5;
        itemData.imageUrls = [itemData.imageUrl];
        itemData.amenities = ["WiFi", "Kitchen", "Air conditioning"];
        itemData.maxGuests = 4;
        itemData.bedrooms = 2;
        itemData.bathrooms = 1;
        itemData.pricePerNight = 150;
      }
    }
    
    addItemMutation.mutate(itemData);
  };

  // Handle image upload
  const handleImageSelect = (url: string) => {
    if (selectedItem) {
      // Update the item with the new image URL
      updateItemMutation.mutate({
        ...selectedItem,
        imageUrl: url
      });
      
      // Update local state
      setSelectedItem({
        ...selectedItem,
        imageUrl: url
      });
    }
    setIsImageDialogOpen(false);
  };

  // Handle content save
  const handleSaveContent = async () => {
    if (!selectedItem) return;

    if (currentTab === "blog") {
      updateItemMutation.mutate({
        ...selectedItem,
        content: editContent
      });
    } else {
      updateItemMutation.mutate({
        ...selectedItem,
        description: editContent
      });
    }
  };

  if (sessionLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Upload image dialog
  const ImageUploadDialog = () => (
    <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Images</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Upload, select or delete images for your content
        </p>
        <div className="py-4">
          <ImageManager onSelectImage={handleImageSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add new item dialog
  const AddNewItemDialog = () => (
    <Dialog open={isAddNewDialogOpen} onOpenChange={setIsAddNewDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New {currentTab === "blog" ? "Blog Post" : currentTab.slice(0, -1)}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Create a new {currentTab === "blog" ? "blog post" : "item"} for your website
        </p>
        <div className="grid gap-4 py-4">
          {currentTab === "blog" ? (
            <>
              {/* Blog post specific fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Post Title"
                    onChange={(e) => setNewItemData({...newItemData, title: e.target.value})}
                    value={newItemData.title || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL Path)</Label>
                  <Input
                    id="slug"
                    placeholder="Generated from title if empty"
                    onChange={(e) => setNewItemData({...newItemData, slug: e.target.value})}
                    value={newItemData.slug || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Brief summary of the blog post"
                  onChange={(e) => setNewItemData({...newItemData, excerpt: e.target.value})}
                  value={newItemData.excerpt || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Category"
                    onChange={(e) => setNewItemData({...newItemData, category: e.target.value})}
                    value={newItemData.category || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    onChange={(e) => setNewItemData({...newItemData, author: e.target.value})}
                    value={newItemData.author || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setNewItemData({...newItemData, imageUrl: e.target.value})}
                  value={newItemData.imageUrl || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Editor
                  apiKey="vsxa0jsn0xhmac00xmj4sz81e021qjrnz4a23iyvyberhu2q"
                  value={newItemData.content || ""}
                  onEditorChange={(content) => setNewItemData({...newItemData, content: content})}
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic underline | forecolor backcolor | ' +
                      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | image media link | code fullscreen help',
                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }'
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateNewItem} 
                  disabled={!newItemData.title || !newItemData.imageUrl || !newItemData.excerpt || !newItemData.content}
                >
                  Create Blog Post
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Regular content fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                    value={newItemData.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL Path)</Label>
                  <Input
                    id="slug"
                    placeholder="Generated from name if empty"
                    onChange={(e) => setNewItemData({...newItemData, slug: e.target.value})}
                    value={newItemData.slug || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  placeholder="Brief description"
                  onChange={(e) => setNewItemData({...newItemData, shortDescription: e.target.value})}
                  value={newItemData.shortDescription || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setNewItemData({...newItemData, imageUrl: e.target.value})}
                  value={newItemData.imageUrl || ""}
                />
              </div>
              {(currentTab === "cabins" || currentTab === "events") && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Location"
                    onChange={(e) => setNewItemData({...newItemData, location: e.target.value})}
                    value={newItemData.location || ""}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Editor
                  apiKey="vsxa0jsn0xhmac00xmj4sz81e021qjrnz4a23iyvyberhu2q"
                  value={newItemData.description || ""}
                  onEditorChange={(content) => setNewItemData({...newItemData, description: content})}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic | bullist numlist | help',
                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }'
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateNewItem} 
                  disabled={!newItemData.name || !newItemData.imageUrl || !newItemData.shortDescription}
                >
                  Create {currentTab.slice(0, -1)}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!session?.authenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Texas Hill Country Admin</h1>
            <p className="text-sm text-gray-600">Welcome, {session.username}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation('/')}>
              View Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Image Upload Dialog */}
      <ImageUploadDialog />
      
      {/* Add New Item Dialog */}
      <AddNewItemDialog />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="settings" onValueChange={setCurrentTab}>
            <div className="px-4 py-3 border-b">
              <TabsList className="grid grid-cols-7">
                <TabsTrigger value="settings">Site Settings</TabsTrigger>
                <TabsTrigger value="siteImages">Site Images</TabsTrigger>
                <TabsTrigger value="destinations">Destinations</TabsTrigger>
                <TabsTrigger value="attractions">Attractions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="cabins">Cabins</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
              </TabsList>
            </div>

            {/* Site Settings Tab */}
            <TabsContent value="settings" className="p-4">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                    <CardDescription>
                      Update the main hero image displayed on the homepage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SiteSettingsManager setting="heroImage" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Site Images Tab */}
            <TabsContent value="siteImages" className="p-4">
              <SiteImageManager />
            </TabsContent>
            
            {/* Content for each tab */}
            {["destinations", "attractions", "events", "cabins", "blog"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left sidebar with list of items */}
                  <div className="col-span-1 border rounded-lg h-[calc(100vh-240px)] overflow-y-auto">
                    <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                      <h3 className="font-medium">Select {tabValue}</h3>
                      <Button onClick={() => handleAddNewItem(tabValue)} size="sm" variant="outline">
                        <span className="mr-1">+</span> Add New
                      </Button>
                    </div>
                    
                    {itemsLoading ? (
                      <div className="p-8 text-center">Loading...</div>
                    ) : items && items.length > 0 ? (
                      <div className="divide-y">
                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            className={`p-3 hover:bg-slate-50 cursor-pointer ${
                              selectedItem?.id === item.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleSelectItem(item)}
                          >
                            <h4 className="font-medium text-sm">
                              {currentTab === "blog" ? item.title : item.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {currentTab === "blog" 
                                ? item.excerpt || "No excerpt" 
                                : item.shortDescription || "No description"
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No items found
                      </div>
                    )}
                  </div>

                  {/* Right content editor */}
                  <div className="col-span-2 border rounded-lg">
                    {selectedItem ? (
                      <div className="h-full flex flex-col">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                          <h3 className="font-medium">Edit: {selectedItem.name}</h3>
                          <Button onClick={handleSaveContent} size="sm">Save Changes</Button>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto">
                          <Card className="mb-4">
                            <CardHeader>
                              <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm font-medium mb-1">Name:</p>
                                  <p className="text-sm">{selectedItem.name}</p>
                                </div>
                                {selectedItem.location && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Location:</p>
                                    <p className="text-sm">{selectedItem.location}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-medium">Featured Image:</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setNewItemData({...newItemData, imageUrl: selectedItem.imageUrl});
                                  setIsImageDialogOpen(true);
                                }}
                              >
                                Change Image
                              </Button>
                            </div>
                            <div className="border rounded p-2 bg-gray-50">
                              <img 
                                src={selectedItem.imageUrl} 
                                alt={selectedItem.name} 
                                className="max-h-40 mx-auto object-cover"
                              />
                            </div>
                          </div>

                          <Separator className="my-4" />
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-medium">Content:</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  // Open image gallery dialog when inserting images in the editor
                                  setIsImageDialogOpen(true);
                                }}
                              >
                                Add Image
                              </Button>
                            </div>
                            <Editor
                              apiKey="vsxa0jsn0xhmac00xmj4sz81e021qjrnz4a23iyvyberhu2q"
                              value={editContent}
                              onEditorChange={(content) => setEditContent(content)}
                              init={{
                                height: 400,
                                menubar: true,
                                plugins: [
                                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar:
                                  'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                                  'alignright alignjustify | bullist numlist outdent indent | ' +
                                  'removeformat | help',
                                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                        <div>
                          <p className="mb-2">Select an item to edit</p>
                          <p className="text-sm">Choose an item from the list to edit its content</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}