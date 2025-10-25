import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

// Only initialize the admin client if we have the required environment variables
if (supabaseUrl && supabaseServiceRoleKey) {
  try {
    // Create a Supabase client with service role key for server-side operations
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-custom-header': 'demo-rooms-api'
        }
      }
    });
  } catch (error) {
    console.error('Error initializing Supabase admin client:', error);
  }
}

export async function GET() {
  // Check if the admin client was initialized successfully
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
  }

  try {
    // Fetch all rooms for demo users
    const { data: rooms, error } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms for demo user:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}