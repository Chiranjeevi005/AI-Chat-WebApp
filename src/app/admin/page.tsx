'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    // Check if user is authenticated and is the admin
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome, {user.email}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-400 mb-4">Manage all users in the system</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
              View Users
            </button>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Room Management</h2>
            <p className="text-gray-400 mb-4">Manage chat rooms and their settings</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
              View Rooms
            </button>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-400 mb-4">Configure application settings</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors">
              Configure
            </button>
          </div>
        </div>

        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Admin Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Details</h3>
              <p className="text-gray-400">Email: {user.email}</p>
              <p className="text-gray-400">User ID: {user.id}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Permissions</h3>
              <p className="text-gray-400">Role: Administrator</p>
              <p className="text-gray-400">Access Level: Full</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}