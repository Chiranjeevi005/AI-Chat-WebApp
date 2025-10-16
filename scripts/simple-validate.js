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

async function simpleValidate() {
  try {
    console.log('🔍 Simple database validation...');
    
    // Check if we can access rooms
    console.log('\n💬 Checking rooms access...');
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (roomsError) {
      console.log(`❌ Rooms access failed: ${roomsError.message}`);
      return { success: false, error: roomsError.message };
    } else {
      console.log(`✅ Rooms access successful`);
    }
    
    // Check if we can access room_members
    console.log('\n👥 Checking room members access...');
    const { data: members, error: membersError } = await supabaseAdmin
      .from('room_members')
      .select('*')
      .limit(1);
    
    if (membersError) {
      console.log(`❌ Room members access failed: ${membersError.message}`);
      return { success: false, error: membersError.message };
    } else {
      console.log(`✅ Room members access successful`);
    }
    
    // Check if we can access profiles
    console.log('\n👤 Checking profiles access...');
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.log(`❌ Profiles access failed: ${profilesError.message}`);
      return { success: false, error: profilesError.message };
    } else {
      console.log(`✅ Profiles access successful`);
      console.log(`📋 Found ${profiles.length} profiles:`);
      profiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}`);
        console.log(`     Email: ${profile.email || 'null'}`);
        console.log(`     Username: ${profile.username || 'null'}`);
        console.log(`     Role: ${profile.role || 'user'}`);
        console.log(`     Created: ${profile.created_at || 'null'}`);
        console.log(`     ---`);
      });
    }
    
    // Check room memberships
    console.log('\n🏘️  Checking room memberships...');
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from('room_members')
      .select('*');
    
    if (membershipsError) {
      console.log(`❌ Room memberships query failed: ${membershipsError.message}`);
      return { success: false, error: membershipsError.message };
    } else {
      console.log(`✅ Room memberships query successful`);
      console.log(`📋 Found ${memberships.length} total memberships:`);
      
      // Get user emails for the memberships
      const userIds = [...new Set(memberships.map(m => m.user_id))];
      const { data: users, error: usersError } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
      
      const userMap = {};
      if (!usersError && users) {
        users.forEach(user => {
          userMap[user.id] = user.email;
        });
      }
      
      // Get room names for the memberships
      const roomIds = [...new Set(memberships.map(m => m.room_id))];
      const { data: roomsData, error: roomsError } = await supabaseAdmin
        .from('rooms')
        .select('id, name')
        .in('id', roomIds);
      
      const roomMap = {};
      if (!roomsError && roomsData) {
        roomsData.forEach(room => {
          roomMap[room.id] = room.name;
        });
      }
      
      // Count memberships per user
      const userMembershipCount = {};
      memberships.forEach(membership => {
        userMembershipCount[membership.user_id] = (userMembershipCount[membership.user_id] || 0) + 1;
        if (memberships.length <= 20) { // Only show details if not too many
          const userEmail = userMap[membership.user_id] || membership.user_id;
          const roomName = roomMap[membership.room_id] || membership.room_id;
          console.log(`   - User ${userEmail} -> Room "${roomName}"`);
        }
      });
      
      // Show summary per user
      console.log('\n📊 Membership summary:');
      Object.keys(userMembershipCount).forEach(userId => {
        const userEmail = userMap[userId] || userId;
        console.log(`   - ${userEmail}: ${userMembershipCount[userId]} rooms`);
      });
    }
    
    console.log('\n🎉 All database access checks passed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the validation function if this file is executed directly
if (require.main === module) {
  simpleValidate().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}