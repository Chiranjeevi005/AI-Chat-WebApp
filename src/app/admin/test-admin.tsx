// Component to verify admin functionality
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminVerification() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        if (currentUser) {
          // Get user profile
          const { data: userProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, []);

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Verification</h1>
      
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
          
          {profile && (
            <div className="mt-4">
              <p>Username: {profile.username}</p>
              <p>Role: {profile.role}</p>
              <p className="mt-2 font-bold">
                Admin Status: {profile.role === 'admin' && user.email === 'chiranjeevi8050@gmail.com' ? '✅ Authorized Admin' : '❌ Not Authorized'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}