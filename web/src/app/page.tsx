'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Play,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@radix-ui/react-tabs';
import { getApiClient } from '@/lib/api';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Browser-only guard (extra safety)
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // ✅ CREATE API CLIENT AT RUNTIME
        const api = getApiClient();

        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Chaishots CMS
            </h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <Badge variant="outline">{user.role}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Programs */}
          <Link href="/programs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Programs
                </CardTitle>
                <CardDescription>
                  Manage educational programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-gray-500 mt-2">
                  Active programs
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2 text-green-500" />
                Terms
              </CardTitle>
              <CardDescription>
                Manage course terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm text-gray-500 mt-2">
                Total terms
              </p>
            </CardContent>
          </Card>

          {/* Lessons */}
          <Link href="/lessons">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-purple-500" />
                  Lessons
                </CardTitle>
                <CardDescription>
                  Manage lesson content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-500 mt-2">
                  Total lessons
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled Lessons
              </TabsTrigger>
              <TabsTrigger value="published">
                Published Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    No recent activity.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}