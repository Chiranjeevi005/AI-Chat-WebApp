'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is the admin
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/admin');
      } else if (user?.email !== 'chiranjeevi8050@gmail.com') {
        // If not the designated admin, redirect to chat session
        router.push('/chat-session');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.email !== 'chiranjeevi8050@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-white text-xl font-bold">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/chat-session" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Chat
              </Link>
              <Link 
                href="/profile" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <span className="text-gray-300 text-sm">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}