import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

type NewsletterSubscriber = {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  dateSubscribed: string;
  active: boolean;
  interests: string[];
};

export function NewsletterSubscriberList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);

  // Fetch subscribers
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['admin', 'newsletter', 'subscribers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/newsletter/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      return response.json() as Promise<NewsletterSubscriber[]>;
    }
  });

  // Filter subscribers based on search and active status
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch && (showActiveOnly ? subscriber.active : true);
  });

  // Update subscriber mutation
  const updateSubscriberMutation = useMutation({
    mutationFn: async (data: { id: number, changes: Partial<NewsletterSubscriber> }) => {
      const response = await apiRequest(`/api/admin/newsletter/subscribers/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data.changes),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Subscriber updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subscriber",
      });
    }
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subscriber",
      });
    }
  });

  // Toggle subscriber active status
  const handleToggleActive = (id: number, currentStatus: boolean) => {
    updateSubscriberMutation.mutate({
      id,
      changes: { active: !currentStatus }
    });
  };

  // Begin edit subscriber
  const handleEditSubscriber = (subscriber: NewsletterSubscriber) => {
    setEditingSubscriber(subscriber);
    setIsEditDialogOpen(true);
  };

  // Begin delete subscriber
  const handleDeleteClick = (id: number) => {
    setSubscriberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Submit edit
  const handleEditSubmit = () => {
    if (!editingSubscriber) return;
    
    updateSubscriberMutation.mutate({
      id: editingSubscriber.id,
      changes: editingSubscriber
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (subscriberToDelete !== null) {
      deleteSubscriberMutation.mutate(subscriberToDelete);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading subscribers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="active-only" 
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
            <Label htmlFor="active-only">Active only</Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: {subscribers.length} subscribers ({subscribers.filter(s => s.active).length} active)
          </div>
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No subscribers found matching your search criteria.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>
                    {subscriber.firstName} {subscriber.lastName}
                  </TableCell>
                  <TableCell>{formatDate(subscriber.dateSubscribed)}</TableCell>
                  <TableCell>
                    <Badge variant={subscriber.active ? "default" : "outline"}>
                      {subscriber.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subscriber.interests && subscriber.interests.length > 0 ? (
                        subscriber.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(subscriber.id, subscriber.active)}
                      >
                        {subscriber.active ? "Unsubscribe" : "Reactivate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSubscriber(subscriber)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteClick(subscriber.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Subscriber Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
          </DialogHeader>
          
          {editingSubscriber && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingSubscriber.email}
                  onChange={(e) => setEditingSubscriber({
                    ...editingSubscriber,
                    email: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editingSubscriber.firstName}
                    onChange={(e) => setEditingSubscriber({
                      ...editingSubscriber,
                      firstName: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editingSubscriber.lastName || ""}
                    onChange={(e) => setEditingSubscriber({
                      ...editingSubscriber,
                      lastName: e.target.value || null
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="subscriberStatus"
                    checked={editingSubscriber.active}
                    onCheckedChange={(checked) => setEditingSubscriber({
                      ...editingSubscriber,
                      active: checked
                    })}
                  />
                  <Label htmlFor="subscriberStatus">
                    {editingSubscriber.active ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Events', 'Attractions', 'Destinations', 'Cabins', 'Seasonal', 'Travel Tips'].map(interest => (
                    <div key={interest} className="flex items-center gap-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={editingSubscriber.interests?.includes(interest) || false}
                        onCheckedChange={(checked) => {
                          const interests = [...(editingSubscriber.interests || [])];
                          if (checked) {
                            if (!interests.includes(interest)) {
                              interests.push(interest);
                            }
                          } else {
                            const index = interests.indexOf(interest);
                            if (index > -1) {
                              interests.splice(index, 1);
                            }
                          }
                          setEditingSubscriber({
                            ...editingSubscriber,
                            interests
                          });
                        }}
                      />
                      <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={updateSubscriberMutation.isPending}
            >
              {updateSubscriberMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscriber and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSubscriberMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}