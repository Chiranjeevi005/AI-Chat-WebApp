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

async function fixMemberships() {
  try {
    console.log('🔧 Fixing room memberships...');
    
    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('id');
    
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    console.log(`👥 Found ${users.length} users`);
    
    // Get all rooms
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('id');
    
    if (roomsError) {
      throw new Error(`Error fetching rooms: ${roomsError.message}`);
    }
    
    console.log(`🏘️  Found ${rooms.length} rooms`);
    
    // Create room_members entries for all users in all rooms
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      for (const room of rooms) {
        // Check if membership already exists
        const { data: existing, error: checkError } = await supabaseAdmin
          .from('room_members')
          .select('id')
          .eq('user_id', user.id)
          .eq('room_id', room.id)
          .maybeSingle();
        
        if (checkError) {
          console.log(`❌ Error checking membership for user ${user.id} in room ${room.id}: ${checkError.message}`);
          continue;
        }
        
        if (existing) {
          skippedCount++;
          continue;
        }
        
        // Add membership
        const { error: insertError } = await supabaseAdmin
          .from('room_members')
          .insert({
            user_id: user.id,
            room_id: room.id
          });
        
        if (insertError) {
          console.log(`❌ Error adding user ${user.id} to room ${room.id}: ${insertError.message}`);
        } else {
          addedCount++;
        }
      }
    }
    
    console.log(`✅ Successfully added ${addedCount} new memberships, skipped ${skippedCount} existing ones`);
    return { success: true, message: `Added ${addedCount} new memberships` };
  } catch (error) {
    console.error('❌ Error fixing memberships:', error);
    return { success: false, error: error.message };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  fixMemberships().then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  });
}