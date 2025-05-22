import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarClock, CheckCircle2, Loader2 } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { insertSubscriberSchema } from '@shared/schema';
import { useApiMutation } from '@/lib/queryClient';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Extend the subscriber schema with validation
const newsletterFormSchema = insertSubscriberSchema.extend({
  email: z.string().email({ message: "Please enter a valid email address" }),
  receiveCalendarUpdates: z.boolean().default(true),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms to subscribe"
  })
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'sidebar' | 'footer';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
      receiveCalendarUpdates: true,
      termsAccepted: false
    }
  });
  
  const subscribeMutation = useApiMutation({
    url: '/api/subscribe',
    method: 'POST',
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Subscription successful",
        description: "You've been added to our newsletter list!",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error?.message || "There was an error subscribing you to the newsletter.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: NewsletterFormValues) => {
    subscribeMutation.mutate({
      email: data.email,
      receiveCalendarUpdates: data.receiveCalendarUpdates
    });
  };
  
  // Different layouts based on the variant
  if (variant === 'sidebar') {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Stay Updated</CardTitle>
          <CardDescription>
            Get the latest Hill Country events straight to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Thanks for subscribing!</h3>
              <p className="text-sm text-gray-600">
                You'll receive updates about new events and happenings in the Hill Country.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="receiveCalendarUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Receive Google Calendar updates
                        </FormLabel>
                        <p className="text-sm text-gray-500">
                          Get notified when new events are added to our calendar
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to receive emails
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>Subscribe</>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Footer variant
  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold mb-3">Subscribe to our Newsletter</h3>
        {isSuccess ? (
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Thanks for subscribing!</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={subscribeMutation.isPending || !form.formState.isValid}
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="receiveCalendarUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-1.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0 leading-none">
                        <FormLabel className="text-xs">
                          Receive calendar updates
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-1.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0 leading-none">
                        <FormLabel className="text-xs">
                          I agree to receive emails
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </form>
          </Form>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`bg-primary-50 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 md:p-8 md:flex items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="md:w-2/5">
          <div className="flex items-center mb-3">
            <CalendarClock className="h-7 w-7 text-primary mr-2" />
            <h2 className="text-2xl font-bold text-primary">Stay Connected</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Subscribe to our newsletter and get the latest Hill Country events, attractions, and special offers delivered straight to your inbox.
          </p>
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Google Calendar event updates</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 space-x-2 mt-1">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Seasonal highlights & local tips</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 space-x-2 mt-1">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Special offers from local businesses</span>
          </div>
        </div>
        
        <div className="md:w-3/5 bg-white rounded-lg shadow-sm p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thanks for subscribing!</h3>
              <p className="text-gray-600 mb-4">
                You've been added to our newsletter. We'll keep you updated with all the latest events and attractions in the Texas Hill Country.
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsSuccess(false)}
              >
                Subscribe another email
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="receiveCalendarUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 border rounded-md p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Subscribe to Google Calendar updates
                        </FormLabel>
                        <p className="text-sm text-gray-500">
                          Get notifications when new events are added to our calendar
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to receive email communications from Texas Hill Country Guide
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          You can unsubscribe at any time by clicking the link in the footer of our emails
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>Subscribe to Newsletter</>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;