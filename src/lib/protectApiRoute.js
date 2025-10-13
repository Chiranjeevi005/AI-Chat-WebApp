import { createServerClient } from '@supabase/ssr';

// Middleware function to protect API routes
export async function protectApiRoute(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

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
}