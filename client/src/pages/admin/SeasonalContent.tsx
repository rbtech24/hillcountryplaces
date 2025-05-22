import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface Season {
  id?: number;
  seasonId: string;
  name: string;
  months: string[];
  description: string;
  highlights: string[];
  iconClass: string;
  bgClass: string;
  textClass: string;
}

interface SeasonalActivity {
  id?: number;
  seasonId: string;
  title: string;
  description: string;
  category: string;
  iconClass: string;
  locations: string[];
  tips: string[];
  displayOrder: number;
}

const SeasonalContent: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for season form
  const [seasonForm, setSeasonForm] = useState<Season>({
    seasonId: '',
    name: '',
    months: [],
    description: '',
    highlights: [],
    iconClass: '',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
  });
  
  // State for activity form
  const [activityForm, setActivityForm] = useState<SeasonalActivity>({
    seasonId: '',
    title: '',
    description: '',
    category: 'outdoor',
    iconClass: 'leaf',
    locations: [],
    tips: [],
    displayOrder: 1,
  });
  
  // State for editing
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [editingActivity, setEditingActivity] = useState<SeasonalActivity | null>(null);
  
  // Dialog open states
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [deleteSeasonDialogOpen, setDeleteSeasonDialogOpen] = useState(false);
  const [deleteActivityDialogOpen, setDeleteActivityDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<number | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  
  // Fetch seasons
  const { data: seasons } = useQuery({
    queryKey: ['/api/seasons'],
    queryFn: () => apiRequest('/api/seasons')
  });
  
  // Fetch activities
  const { data: activities } = useQuery({
    queryKey: ['/api/seasonal-activities'],
    queryFn: () => {
      // We'll fetch all activities from all seasons
      return Promise.all(
        seasons ? 
          (seasons as Season[]).map(season => 
            apiRequest(`/api/seasons/${season.seasonId}/activities`)
              .then(activities => activities)
          ) : []
      ).then(results => results.flat());
    },
    enabled: !!seasons && (seasons as Season[]).length > 0
  });
  
  // Create/Update season mutation
  const seasonMutation = useMutation({
    mutationFn: (season: Season) => {
      if (season.id) {
        // Update existing season
        return apiRequest({
          method: 'PUT',
          data: season,
          url: `/api/admin/seasons/${season.id}`
        });
      } else {
        // Create new season
        return apiRequest({
          method: 'POST',
          data: season,
          url: '/api/admin/seasons'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({
        title: editingSeason ? 'Season updated' : 'Season created',
        description: editingSeason 
          ? `The season has been updated successfully.` 
          : `A new season has been created successfully.`,
      });
      setSeasonForm({
        seasonId: '',
        name: '',
        months: [],
        description: '',
        highlights: [],
        iconClass: '',
        bgClass: 'bg-green-100',
        textClass: 'text-green-800',
      });
      setEditingSeason(null);
      setSeasonDialogOpen(false);
    },
    onError: (error) => {
      console.error('Season mutation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the season. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete season mutation
  const deleteSeasonMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        method: 'DELETE',
        url: `/api/admin/seasons/${id}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({
        title: 'Season deleted',
        description: 'The season has been deleted successfully.',
      });
      setDeleteSeasonDialogOpen(false);
    },
    onError: (error) => {
      console.error('Delete season error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the season. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Create/Update activity mutation
  const activityMutation = useMutation({
    mutationFn: (activity: SeasonalActivity) => {
      if (activity.id) {
        // Update existing activity
        return apiRequest({
          method: 'PUT',
          data: activity,
          url: `/api/admin/seasonal-activities/${activity.id}`
        });
      } else {
        // Create new activity
        return apiRequest({
          method: 'POST',
          data: activity,
          url: '/api/admin/seasonal-activities'
        });
      }
    },
    onSuccess: () => {
      // We need to invalidate both the general activities query and the specific season's activities
      queryClient.invalidateQueries({ queryKey: ['/api/seasonal-activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      if (activityForm.seasonId) {
        queryClient.invalidateQueries({ queryKey: [`/api/seasons/${activityForm.seasonId}/activities`] });
      }
      
      toast({
        title: editingActivity ? 'Activity updated' : 'Activity created',
        description: editingActivity 
          ? `The activity has been updated successfully.` 
          : `A new activity has been created successfully.`,
      });
      setActivityForm({
        seasonId: '',
        title: '',
        description: '',
        category: 'outdoor',
        iconClass: 'leaf',
        locations: [],
        tips: [],
        displayOrder: 1,
      });
      setEditingActivity(null);
      setActivityDialogOpen(false);
    },
    onError: (error) => {
      console.error('Activity mutation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the activity. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest({
        method: 'DELETE',
        url: `/api/admin/seasonal-activities/${id}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seasonal-activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      toast({
        title: 'Activity deleted',
        description: 'The activity has been deleted successfully.',
      });
      setDeleteActivityDialogOpen(false);
    },
    onError: (error) => {
      console.error('Delete activity error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the activity. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Handle season form submission
  const handleSeasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    seasonMutation.mutate(seasonForm);
  };
  
  // Handle activity form submission
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    activityMutation.mutate(activityForm);
  };
  
  // Edit season
  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setSeasonForm(season);
    setSeasonDialogOpen(true);
  };
  
  // Edit activity
  const handleEditActivity = (activity: SeasonalActivity) => {
    setEditingActivity(activity);
    setActivityForm(activity);
    setActivityDialogOpen(true);
  };
  
  // Handle delete season
  const handleDeleteSeason = (id: number) => {
    setSeasonToDelete(id);
    setDeleteSeasonDialogOpen(true);
  };
  
  // Confirm delete season
  const confirmDeleteSeason = () => {
    if (seasonToDelete) {
      deleteSeasonMutation.mutate(seasonToDelete);
    }
  };
  
  // Handle delete activity
  const handleDeleteActivity = (id: number) => {
    setActivityToDelete(id);
    setDeleteActivityDialogOpen(true);
  };
  
  // Confirm delete activity
  const confirmDeleteActivity = () => {
    if (activityToDelete) {
      deleteActivityMutation.mutate(activityToDelete);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Seasonal Content Management</h1>
        </div>
        
        <Tabs defaultValue="seasons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
            <TabsTrigger value="activities">Seasonal Activities</TabsTrigger>
          </TabsList>
          
          {/* Seasons Tab */}
          <TabsContent value="seasons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Seasons</h2>
              <Button onClick={() => {
                setEditingSeason(null);
                setSeasonForm({
                  seasonId: '',
                  name: '',
                  months: [],
                  description: '',
                  highlights: [],
                  iconClass: '',
                  bgClass: 'bg-green-100',
                  textClass: 'text-green-800',
                });
                setSeasonDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Season
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Months</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasons && (seasons as Season[]).map((season) => (
                    <TableRow key={season.id}>
                      <TableCell className="font-medium">{season.name}</TableCell>
                      <TableCell>{season.seasonId}</TableCell>
                      <TableCell>{season.months?.join(', ')}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSeason(season)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSeason(season.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!seasons || (seasons as Season[]).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No seasons found. Add your first season to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Season Form Dialog */}
            <Dialog open={seasonDialogOpen} onOpenChange={setSeasonDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingSeason ? 'Edit Season' : 'Create New Season'}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details for the season.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSeasonSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Season Name</Label>
                      <Input
                        id="name"
                        value={seasonForm.name}
                        onChange={(e) => setSeasonForm({ ...seasonForm, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seasonId">Season ID</Label>
                      <Input
                        id="seasonId"
                        value={seasonForm.seasonId}
                        onChange={(e) => setSeasonForm({ ...seasonForm, seasonId: e.target.value })}
                        required
                        placeholder="e.g., spring, summer, fall, winter"
                      />
                      <small className="text-gray-500">Used for URL and internal references</small>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="months">Months (comma-separated)</Label>
                    <Input
                      id="months"
                      value={seasonForm.months.join(', ')}
                      onChange={(e) => setSeasonForm({ 
                        ...seasonForm, 
                        months: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                      })}
                      placeholder="e.g., March, April, May"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={seasonForm.description}
                      onChange={(e) => setSeasonForm({ ...seasonForm, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                    <Textarea
                      id="highlights"
                      value={seasonForm.highlights.join(', ')}
                      onChange={(e) => setSeasonForm({ 
                        ...seasonForm, 
                        highlights: e.target.value.split(',').map(h => h.trim()).filter(Boolean)
                      })}
                      rows={2}
                      placeholder="e.g., Bluebonnet season, Mild temperatures, Wildlife activity"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iconClass">Icon Class</Label>
                      <Input
                        id="iconClass"
                        value={seasonForm.iconClass}
                        onChange={(e) => setSeasonForm({ ...seasonForm, iconClass: e.target.value })}
                        placeholder="e.g., sun, leaf, snowflake"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bgClass">Background Class</Label>
                      <Input
                        id="bgClass"
                        value={seasonForm.bgClass}
                        onChange={(e) => setSeasonForm({ ...seasonForm, bgClass: e.target.value })}
                        placeholder="e.g., bg-green-100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textClass">Text Class</Label>
                      <Input
                        id="textClass"
                        value={seasonForm.textClass}
                        onChange={(e) => setSeasonForm({ ...seasonForm, textClass: e.target.value })}
                        placeholder="e.g., text-green-800"
                        required
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={seasonMutation.isPending}>
                      {seasonMutation.isPending ? 'Saving...' : 'Save Season'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Delete Season Confirmation Dialog */}
            <Dialog open={deleteSeasonDialogOpen} onOpenChange={setDeleteSeasonDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this season? This action cannot be undone,
                    and all activities associated with this season will also be deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteSeasonDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteSeason}
                    disabled={deleteSeasonMutation.isPending}
                  >
                    {deleteSeasonMutation.isPending ? 'Deleting...' : 'Delete Season'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Seasonal Activities</h2>
              <Button onClick={() => {
                setEditingActivity(null);
                setActivityForm({
                  seasonId: '',
                  title: '',
                  description: '',
                  category: 'outdoor',
                  iconClass: 'leaf',
                  locations: [],
                  tips: [],
                  displayOrder: 1,
                });
                setActivityDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities && (activities as SeasonalActivity[]).map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>{activity.seasonId}</TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell>{activity.displayOrder}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditActivity(activity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!activities || (activities as SeasonalActivity[]).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No activities found. Add your first activity to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Activity Form Dialog */}
            <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingActivity ? 'Edit Activity' : 'Create New Activity'}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details for the seasonal activity.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seasonId">Season</Label>
                    <Select
                      value={activityForm.seasonId}
                      onValueChange={(value) => setActivityForm({ ...activityForm, seasonId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a season" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons && (seasons as Season[]).map((season) => (
                          <SelectItem key={season.seasonId} value={season.seasonId}>
                            {season.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={activityForm.title}
                      onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={activityForm.category}
                        onValueChange={(value) => setActivityForm({ ...activityForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                          <SelectItem value="indoor">Indoor</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="culinary">Culinary</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="relaxation">Relaxation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iconClass">Icon Class</Label>
                      <Input
                        id="iconClass"
                        value={activityForm.iconClass}
                        onChange={(e) => setActivityForm({ ...activityForm, iconClass: e.target.value })}
                        placeholder="e.g., hike, swim, dine"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locations">Best Locations (comma-separated)</Label>
                    <Textarea
                      id="locations"
                      value={activityForm.locations.join(', ')}
                      onChange={(e) => setActivityForm({ 
                        ...activityForm, 
                        locations: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
                      })}
                      rows={2}
                      placeholder="e.g., Enchanted Rock, Pedernales Falls, Lost Maples"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tips">Tips (comma-separated)</Label>
                    <Textarea
                      id="tips"
                      value={activityForm.tips.join(', ')}
                      onChange={(e) => setActivityForm({ 
                        ...activityForm, 
                        tips: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      rows={2}
                      placeholder="e.g., Bring sunscreen, Start early to avoid crowds, Book reservations in advance"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      min={1}
                      value={activityForm.displayOrder}
                      onChange={(e) => setActivityForm({ 
                        ...activityForm, 
                        displayOrder: parseInt(e.target.value) || 1
                      })}
                      required
                    />
                    <small className="text-gray-500">Lower numbers display first</small>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={activityMutation.isPending}>
                      {activityMutation.isPending ? 'Saving...' : 'Save Activity'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Delete Activity Confirmation Dialog */}
            <Dialog open={deleteActivityDialogOpen} onOpenChange={setDeleteActivityDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this activity? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteActivityDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteActivity}
                    disabled={deleteActivityMutation.isPending}
                  >
                    {deleteActivityMutation.isPending ? 'Deleting...' : 'Delete Activity'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SeasonalContent;