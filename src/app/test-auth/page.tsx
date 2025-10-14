'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { user, session, loading, error, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const handleTestRedirect = () => {
    if (isAuthenticated) {
      router.push('/chat-session');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Auth State:</h2>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">User Info:</h2>
          {user ? (
            <div>
              <p><strong>ID:</strong> {user.id || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p>No user data</p>
          )}
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Session Info:</h2>
          {session ? (
            <div>
              <p><strong>Expires At:</strong> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}</p>
              <p><strong>Provider:</strong> {session.provider || 'N/A'}</p>
            </div>
          ) : (
            <p>No session data</p>
          )}
        </div>
        
        <button
          onClick={handleTestRedirect}
          className="w-full py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Test Redirect
        </button>
        
        <button
          onClick={() => router.push('/')}
          className="w-full py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors mt-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}