import { protectApiRoute } from '@/lib/protectApiRoute';
import { supabaseServer } from '@/lib/supabaseServer';

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

  // Example: Get user profile from database
  const { data: profile, error } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ 
      message: 'This is a protected route',
      user: {
        id: user.id,
        email: user.email,
        profile: profile
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}