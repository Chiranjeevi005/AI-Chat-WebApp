import { protectApiRoute } from '@/lib/auth-middleware';
// import { supabaseServer } from '@/lib/supabaseServer'; // Removed as part of cleanup

export async function GET(request) {
  // Protect the route
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ error: authResult.error }),
      { status: authResult.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Access the user information
  const { user } = authResult;

  // Example: Return user information without database access
  return new Response(
    JSON.stringify({ 
      message: 'This is a protected route',
      user: {
        id: user.id,
        email: user.email
        // profile: profile // Removed database access
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}