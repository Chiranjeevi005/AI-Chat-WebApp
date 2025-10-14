import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

/**
 * Server-side Supabase client creation
 * This function creates a Supabase client for server-side operations
 * with proper cookie handling for session management
 */
export function createClient() {
  const cookieStore: any = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get the current user session
 * This function retrieves the current user session from Supabase
 * and handles any errors that may occur
 */
export async function getSession() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
}

/**
 * Get the current user
 * This function retrieves the current user from Supabase
 * and handles any errors that may occur
 */
export async function getUser() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
}

/**
 * Protected route middleware
 * This function protects API routes by verifying the user's session
 */
export async function protectApiRoute(request: Request) {
  const supabase = createClient();

  try {
    // Get the user's session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return {
        success: false,
        error: 'Unauthorized: No valid session found',
        status: 401
      };
    }

    // Return the user and session for use in the API route
    return {
      success: true,
      user: session.user,
      session: session
    };
  } catch (error) {
    console.error('Error protecting API route:', error);
    return {
      success: false,
      error: 'Internal server error',
      status: 500
    };
  }
}

/**
 * Server-side authentication check
 * This function checks if the user is authenticated and redirects if not
 * It's designed for Server Components and Server Actions
 */
export const checkAuth = cache(async () => {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return { user: session.user, session };
});

/**
 * Server-side authentication check with redirect URL
 * This function checks if the user is authenticated and redirects to a custom URL if not
 */
export const checkAuthWithRedirect = cache(async (redirectUrl: string) => {
  const session = await getSession();
  
  if (!session) {
    redirect(redirectUrl);
  }
  
  return { user: session.user, session };
});

/**
 * Server-side guest check
 * This function checks if the user is NOT authenticated and redirects if they are
 * Useful for pages that should only be accessible to guests (login, signup, etc.)
 */
export const checkGuest = cache(async () => {
  const session = await getSession();
  
  if (session) {
    redirect('/chat-session');
  }
  
  return true;
});