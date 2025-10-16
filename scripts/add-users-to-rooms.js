require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for seeding');
}

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function addUsersToRooms() {
  try {
    console.log('Adding all users to all rooms...');
    
    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('id');
    
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    console.log(`Found ${users.length} users`);
    
    // Get all rooms
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('id');
    
    if (roomsError) {
      throw new Error(`Error fetching rooms: ${roomsError.message}`);
    }
    
    console.log(`Found ${rooms.length} rooms`);
    
    // Create room_members entries for all users in all rooms
    const roomMembers = [];
    users.forEach(user => {
      rooms.forEach(room => {
        roomMembers.push({
          user_id: user.id,
          room_id: room.id
        });
      });
    });
    
    console.log(`Creating ${roomMembers.length} room memberships...`);
    
    // Insert room members (ignore conflicts)
    let successCount = 0;
    let conflictCount = 0;
    
    // Process in batches to avoid timeouts
    const batchSize = 100;
    for (let i = 0; i < roomMembers.length; i += batchSize) {
      const batch = roomMembers.slice(i, i + batchSize);
      
      const { error: insertError } = await supabaseAdmin
        .from('room_members')
        .insert(batch);
      
      if (insertError) {
        // If there's a conflict error, it's okay - it just means some users are already members
        if (insertError.code === '23505') { // 23505 is the conflict error code
          conflictCount += batch.length;
        } else {
          throw new Error(`Error inserting room members: ${insertError.message}`);
        }
      } else {
        successCount += batch.length;
      }
    }
    
    console.log(`Successfully added ${successCount} new memberships, ${conflictCount} already existed`);
    return { success: true, message: `Successfully added ${successCount} new memberships, ${conflictCount} already existed` };
  } catch (error) {
    console.error('Error adding users to rooms:', error);
    return { success: false, error: error.message };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  addUsersToRooms().then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { addUsersToRooms };