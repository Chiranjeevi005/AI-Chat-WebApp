require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the anon key for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with anon key for client-side operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserAccess() {
  try {
    console.log('🔍 Testing user access simulation...');
    
    // First, let's sign in with a test user
    console.log('\n🔐 Signing in with test user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (signInError) {
      console.log(`❌ Sign in failed: ${signInError.message}`);
      // Let's try to sign up first
      console.log('\n📝 Creating test user...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (signUpError) {
        console.log(`❌ Sign up failed: ${signUpError.message}`);
        return { success: false, error: signUpError.message };
      } else {
        console.log('✅ Test user created');
        // Try to sign in again
        const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'password123'
        });
        
        if (signInError2) {
          console.log(`❌ Sign in still failed: ${signInError2.message}`);
          return { success: false, error: signInError2.message };
        } else {
          console.log('✅ Signed in successfully');
        }
      }
    } else {
      console.log('✅ Signed in successfully');
    }
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    console.log(`\n🆔 User ID: ${session.user.id}`);
    
    // Test room_members access
    console.log('\n👥 Testing room_members access...');
    const { data: roomMembers, error: roomMembersError } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', session.user.id);
    
    if (roomMembersError) {
      console.log(`❌ Room members query failed: ${roomMembersError.message}`);
      return { success: false, error: roomMembersError.message };
    } else {
      console.log(`✅ Room members query successful: ${roomMembers.length} memberships found`);
    }
    
    // Test rooms access
    console.log('\n💬 Testing rooms access...');
    if (roomMembers.length > 0) {
      const roomIds = roomMembers.map(rm => rm.room_id);
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .in('id', roomIds);
      
      if (roomsError) {
        console.log(`❌ Rooms query failed: ${roomsError.message}`);
        return { success: false, error: roomsError.message };
      } else {
        console.log(`✅ Rooms query successful: ${rooms.length} rooms found`);
        rooms.forEach(room => {
          console.log(`   - ${room.name}`);
        });
      }
    } else {
      console.log('ℹ️  No room memberships found for user');
      
      // Try to get all rooms (admin access)
      console.log('\n👑 Testing admin access to all rooms...');
      const { data: allRooms, error: allRoomsError } = await supabase
        .from('rooms')
        .select('*');
      
      if (allRoomsError) {
        console.log(`❌ All rooms query failed: ${allRoomsError.message}`);
        return { success: false, error: allRoomsError.message };
      } else {
        console.log(`✅ All rooms query successful: ${allRooms.length} rooms found`);
      }
    }
    
    console.log('\n🎉 User access test completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ User access test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the test function if this file is executed directly
if (require.main === module) {
  testUserAccess().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}