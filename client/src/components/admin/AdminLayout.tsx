import React, { useEffect, useState } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Image, MapPin, Calendar, Inbox, FileText, Settings, Loader2, SunIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [match] = useRoute('/admin/*');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // First try session-based authentication
        const response = await fetch('/api/admin/session', {
          credentials: 'include'
        });
        const data = await response.json();
        
        // If server session is authenticated, use that
        if (data.authenticated) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // If server session fails, try localStorage backup
        const localAuth = localStorage.getItem('admin_auth');
        if (localAuth) {
          const authData = JSON.parse(localAuth);
          const timestamp = authData.timestamp || 0;
          const now = new Date().getTime();
          const oneDay = 24 * 60 * 60 * 1000;
          
          // Check if the auth is still valid (less than 24 hours old)
          if (authData.authenticated && (now - timestamp) < oneDay) {
            setIsAuthenticated(true);
            return;
          } else {
            // Clear expired local auth
            localStorage.removeItem('admin_auth');
          }
        }
        
        // If both methods fail, user is not authenticated
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        
        // Try localStorage as fallback if server check fails
        try {
          const localAuth = localStorage.getItem('admin_auth');
          if (localAuth) {
            const authData = JSON.parse(localAuth);
            const timestamp = authData.timestamp || 0;
            const now = new Date().getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (authData.authenticated && (now - timestamp) < oneDay) {
              setIsAuthenticated(true);
              return;
            }
          }
          setIsAuthenticated(false);
        } catch (e) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      queryClient.clear();
      navigate('/admin/login');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated && match) {
    navigate('/admin/login');
    return null;
  }
  
  if (!match) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Hill Country Admin</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/admin/dashboard">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/destinations">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <MapPin className="mr-3 h-5 w-5" />
                  Destinations
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/events">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Calendar className="mr-3 h-5 w-5" />
                  Events
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/attractions">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <MapPin className="mr-3 h-5 w-5" />
                  Attractions
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/cabins">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Home className="mr-3 h-5 w-5" />
                  Cabins
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/contact">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Inbox className="mr-3 h-5 w-5" />
                  Contact Messages
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/blog">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <FileText className="mr-3 h-5 w-5" />
                  Blog Posts
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/images">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Image className="mr-3 h-5 w-5" />
                  Image Manager
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/seasonal-content">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <SunIcon className="mr-3 h-5 w-5" />
                  Seasonal Content
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings">
                <a className="flex items-center rounded-md px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Settings className="mr-3 h-5 w-5" />
                  Site Settings
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 mb-8 w-64 px-4">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;