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

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, description } = await request.json();
    
    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Room name is required' },
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

    // Ensure user profile exists, create if it doesn't
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (profileCheckError || !existingProfile) {
      // Create user profile if it doesn't exist
      const { data: newProfile, error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
          role: 'user'
        }])
        .select()
        .single();

      if (createProfileError) {
        console.error('Error creating user profile:', createProfileError);
        return NextResponse.json(
          { success: false, error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    }

    // Prepare room data - only include fields that we know exist
    const roomData: any = {
      name: name.trim()
    };

    // Try to add description if provided
    if (description && description.trim()) {
      roomData.description = description.trim();
    }

    // Try to add created_by - this is critical for the room creation
    roomData.created_by = user.id;

    // Insert the new room
    const { data: roomDataResult, error: roomError } = await supabaseAdmin
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (roomError) {
      console.error('Error creating room:', roomError);
      
      // If the error is about missing columns, try a fallback approach
      if (roomError.code === '42703' || roomError.message.includes('column')) {
        console.log('Trying fallback approach without description and created_by');
        
        // Fallback: try inserting with only the name field
        const fallbackRoomData: any = {
          name: name.trim()
        };
        
        const { data: fallbackRoomDataResult, error: fallbackRoomError } = await supabaseAdmin
          .from('rooms')
          .insert([fallbackRoomData])
          .select()
          .single();
          
        if (fallbackRoomError) {
          console.error('Fallback also failed:', fallbackRoomError);
          return NextResponse.json(
            { success: false, error: 'Failed to create room: ' + fallbackRoomError.message },
            { status: 500 }
          );
        }
        
        // Add the creator as a room member if possible
        try {
          await supabaseAdmin
            .from('room_members')
            .insert([{
              room_id: fallbackRoomDataResult.id,
              user_id: user.id,
              joined_at: new Date().toISOString()
            }]);
        } catch (memberError) {
          console.error('Error adding room member:', memberError);
          // Don't fail the room creation if we can't add the member, just log it
        }
        
        // Return the created room
        return NextResponse.json({ success: true, room: fallbackRoomDataResult });
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to create room: ' + roomError.message },
        { status: 500 }
      );
    }

    // Add the creator as a room member
    const { error: memberError } = await supabaseAdmin
      .from('room_members')
      .insert([{
        room_id: roomDataResult.id,
        user_id: user.id,
        joined_at: new Date().toISOString()
      }]);

    if (memberError) {
      console.error('Error adding room member:', memberError);
      // Don't fail the room creation if we can't add the member, just log it
    }

    // Log the room creation
    console.log('Room created successfully:', roomDataResult);

    // Return the created room
    return NextResponse.json({ success: true, room: roomDataResult });
  } catch (error) {
    console.error('Error in create-room API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}