import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Subscriber } from '@shared/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Download, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function SubscribersList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch all subscribers
  const { data: subscribers = [], isLoading, refetch } = useQuery<Subscriber[]>({
    queryKey: ['/api/admin/subscribers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      return response.json();
    }
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscribers'] });
      toast({
        title: 'Subscriber removed',
        description: 'The subscriber has been removed from your mailing list.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete subscriber.',
      });
    }
  });

  // Export subscribers as CSV
  const exportSubscribers = () => {
    if (subscribers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'There are no subscribers to export.',
      });
      return;
    }

    // Create CSV content
    const headers = ['Email', 'Date Subscribed', 'Receives Calendar Updates'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(subscriber => [
        subscriber.email,
        subscriber.createdAt ? format(new Date(subscriber.createdAt), 'yyyy-MM-dd') : 'N/A',
        subscriber.receiveCalendarUpdates ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter subscribers by search term
  const filteredSubscribers = searchTerm
    ? subscribers.filter(sub => sub.email.toLowerCase().includes(searchTerm.toLowerCase()))
    : subscribers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Newsletter Subscribers</CardTitle>
        <CardDescription>
          Manage your newsletter subscribers and export their information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportSubscribers}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No subscribers match your search.' : 'No subscribers found.'}
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'} found
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Date Subscribed</TableHead>
                        <TableHead>Receives Updates</TableHead>
                        <TableHead className="w-24 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>
                            {subscriber.createdAt 
                              ? format(new Date(subscriber.createdAt), 'MMM d, yyyy') 
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              subscriber.receiveCalendarUpdates 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.receiveCalendarUpdates ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to remove this subscriber?')) {
                                  deleteSubscriberMutation.mutate(subscriber.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}