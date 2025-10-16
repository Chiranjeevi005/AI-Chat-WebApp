import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use the service role key for server-side operations with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for admin operations');
}

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export async function DELETE(request: Request) {
  try {
    // Parse the request body
    const { roomId } = await request.json();
    
    // Validate input
    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Get the user from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify the user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to delete the room
    // User can delete if they are admin or the room creator
    const { data: roomData, error: roomError } = await supabaseAdmin
      .from('rooms')
      .select('created_by')
      .eq('id', roomId)
      .single();

    if (roomError || !roomData) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check user role
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 400 }
      );
    }

    const isRoomCreator = roomData.created_by === user.id;
    const isAdmin = profileData.role === 'admin';

    if (!isRoomCreator && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete the room (cascading will delete messages and room_members)
    const { error: deleteError } = await supabaseAdmin
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (deleteError) {
      console.error('Error deleting room:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete room' },
        { status: 500 }
      );
    }

    // Log the room deletion

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete-room API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}