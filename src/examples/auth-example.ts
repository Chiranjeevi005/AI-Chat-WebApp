/**
 * Authentication System Example
 * 
 * This file demonstrates how to use the comprehensive authentication system
 * implemented in the AI Chat application.
 */

// Example 1: Using the Auth Service (Server-side)
import { checkAuth as serverCheckAuth, getSession, getUser } from '@/lib/auth-service';

export async function exampleServerAuth() {
  try {
    // Check if user is authenticated (will redirect if not)
    const { user, session } = await serverCheckAuth();
    
    console.log('Authenticated user:', user.email);
    console.log('Session expires at:', session.expires_at);
    
    // Get session without redirect
    const currentSession = await getSession();
    if (currentSession) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
    
    // Get user without redirect
    const currentUser = await getUser();
    if (currentUser) {
      console.log('Current user:', currentUser.email);
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

// Example 2: Using the Auth Hook (Client-side)
import { useAuth } from '@/hooks/useAuth';

// Note: This is a conceptual example. In a real React component, you would use JSX.
export function exampleAuthComponentUsage() {
  // In a real component, this would be:
  // const { user, session, loading, error, isAuthenticated, signInWithPassword, signInWithOAuth, signOut } = useAuth();
  
  const handleEmailLogin = async (email: string, password: string) => {
    try {
      // In a real component: await signInWithPassword(email, password);
      console.log('Would sign in with email:', email);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      // In a real component: await signInWithOAuth('google');
      console.log('Would redirect to Google OAuth');
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      // In a real component: await signOut();
      console.log('Would log out user');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  console.log('Auth component example functions created');
}

// Example 3: Protecting API Routes
import { protectApiRoute } from '@/lib/auth-service';

export async function exampleProtectedApiRoute(request: Request) {
  // Protect the API route
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ error: authResult.error }),
      { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Access the authenticated user
  const { user } = authResult;
  
  // Perform protected operation
  return new Response(
    JSON.stringify({ 
      message: 'This is a protected API route',
      user: user?.email || 'Unknown'
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

// Example 4: Using Protected Layout
import { checkAuth as layoutCheckAuth } from '@/lib/auth-service';

export async function exampleProtectedPage() {
  try {
    // This will automatically redirect to login if not authenticated
    const { user } = await layoutCheckAuth();
    
    return {
      title: 'Protected Page',
      content: `Welcome, ${user.email}!`
    };
  } catch (error) {
    console.error('Protected page error:', error);
    return {
      title: 'Access Denied',
      content: 'Please log in to view this page'
    };
  }
}

// Example 5: Permission-based Access Control
// import { checkPermission } from '@/lib/auth-middleware';
// Note: This would require NextRequest type, so it's commented out for this example

export async function examplePermissionCheck() {
  console.log('Permission-based access control example');
  // In a real Next.js API route, you would use:
  // const permissionResult = await checkPermission(request, 'admin');
}