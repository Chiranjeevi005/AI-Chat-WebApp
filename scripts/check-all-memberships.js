require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for validation');
}

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function checkAllMemberships() {
  try {
    console.log('🔍 Checking all room memberships...');
    
    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('id, email');
    
    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }
    
    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.email || user.id}`);
    });
    
    // Get all rooms
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('id, name');
    
    if (roomsError) {
      throw new Error(`Error fetching rooms: ${roomsError.message}`);
    }
    
    console.log(`\n🏘️  Found ${rooms.length} rooms:`);
    rooms.forEach(room => {
      console.log(`   - ${room.name}`);
    });
    
    // Check memberships for each user
    console.log('\n📋 Checking memberships for each user:');
    for (const user of users) {
      console.log(`\n👤 User: ${user.email || user.id}`);
      
      const { data: memberships, error: membershipsError } = await supabaseAdmin
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id);
      
      if (membershipsError) {
        console.log(`   ❌ Error checking memberships: ${membershipsError.message}`);
      } else {
        console.log(`   ✅ Found ${memberships.length} memberships`);
        
        if (memberships.length > 0) {
          const roomIds = memberships.map(m => m.room_id);
          const { data: userRooms, error: roomsError } = await supabaseAdmin
            .from('rooms')
            .select('name')
            .in('id', roomIds);
          
          if (!roomsError && userRooms) {
            userRooms.forEach(room => {
              console.log(`      - ${room.name}`);
            });
          }
        }
      }
    }
    
    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('room_members')
      .select('*', { count: 'exact' });
    
    if (countError) {
      console.log(`\n❌ Error getting total count: ${countError.message}`);
    } else {
      console.log(`\n📊 Total room memberships in database: ${count}`);
    }
    
    console.log('\n🎉 Membership check completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Membership check failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  checkAllMemberships().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}