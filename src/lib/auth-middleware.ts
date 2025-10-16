import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

/**
 * Update session middleware
 * This middleware handles session updates and cookie management
 * for server-side rendered pages
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return response;
}

/**
 * Authentication middleware
 * This middleware protects routes based on authentication status
 * and handles redirects for protected pages
 */
export async function authMiddleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedPaths = ['/profile', '/settings', '/dashboard'];
  
  // Admin-only paths
  const adminPaths = ['/admin'];
  
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Check if the current path is admin-only
  const isAdminPath = adminPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!session && (isProtectedPath || isAdminPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If accessing admin paths, check if user is the designated admin
  if (session && isAdminPath) {
    // Only allow chiranjeevi8050@gmail.com as admin
    if (session.user.email !== 'chiranjeevi8050@gmail.com') {
      const url = request.nextUrl.clone();
      url.pathname = '/chat-session';
      return NextResponse.redirect(url);
    }
  }

  // Auth pages that should not be accessible to logged-in users
  const authPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If the user is logged in and trying to access auth pages, redirect appropriately
  if (session && isAuthPath) {
    const url = request.nextUrl.clone();
    // Check for redirect parameter first
    const redirect = request.nextUrl.searchParams.get('redirect');
    
    if (redirect) {
      // If there's a redirect parameter, use it
      url.pathname = redirect;
      return NextResponse.redirect(url);
    } else {
      // No redirect parameter, check if user is admin
      if (session.user.email === 'chiranjeevi8050@gmail.com') {
        // Admin user goes to admin panel
        url.pathname = '/admin';
      } else {
        // Regular user goes to chat session
        url.pathname = '/chat-session';
      }
      return NextResponse.redirect(url);
    }
  }

  return response;
}

/**
 * API route protection middleware
 * This middleware protects API routes and provides user context
 */
export async function protectApiRoute(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

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
 * Permission-based access control middleware
 * This middleware checks if the user has specific permissions
 */
export async function checkPermission(request: NextRequest, requiredPermission: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

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

    // Special check for admin access - only chiranjeevi8050@gmail.com can be admin
    if (requiredPermission === 'admin') {
      if (session.user.email !== 'chiranjeevi8050@gmail.com') {
        return {
          success: false,
          error: 'Forbidden: Insufficient permissions',
          status: 403
        };
      }
      return {
        success: true,
        user: session.user,
        session: session
      };
    }

    // Check user permissions (this would typically involve checking a permissions table)
    // For demonstration, we'll check if the user has admin role
    const userRole = session.user.app_metadata?.role || 'user';
    
    if (userRole !== 'admin' && requiredPermission === 'admin') {
      return {
        success: false,
        error: 'Forbidden: Insufficient permissions',
        status: 403
      };
    }

    // Return the user and session for use in the API route
    return {
      success: true,
      user: session.user,
      session: session
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      success: false,
      error: 'Internal server error',
      status: 500
    };
  }
}