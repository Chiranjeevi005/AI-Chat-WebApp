require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the anon key to simulate frontend behavior
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with anon key to simulate frontend
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRLS() {
  try {
    console.log('🔍 Testing RLS policies...');
    
    // First, let's check what users exist
    console.log('\n📋 Checking existing users...');
    // We'll use the service role key to check users
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('email');
    
    if (profilesError) {
      console.log(`❌ Failed to fetch profiles: ${profilesError.message}`);
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email}`);
      });
    }
    
    // Try to sign in with the chiranjeevi user
    console.log('\n🔐 Signing in with chiranjeevi8050@gmail.com...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'chiranjeevi8050@gmail.com',
      password: 'password123' // We'll assume this is the password
    });
    
    if (signInError) {
      console.log(`❌ Sign in failed: ${signInError.message}`);
      console.log('⚠️  Note: You may need to sign in through the web interface first to set a password');
      return { success: false, error: signInError.message };
    } else {
      console.log('✅ Signed in successfully');
    }
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    console.log(`\n🆔 User ID: ${session.user.id}`);
    
    // Test the exact queries that are failing in the frontend
    console.log('\n🧪 Testing room_members query...');
    const { data: roomMembersData, error: roomMembersError } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', session.user.id);
    
    if (roomMembersError) {
      console.log(`❌ room_members query failed: ${roomMembersError.message}`);
      console.log(`   Code: ${roomMembersError.code}`);
      console.log(`   Hint: ${roomMembersError.hint}`);
      console.log(`   Details: ${roomMembersError.details}`);
    } else {
      console.log(`✅ room_members query successful: ${roomMembersData.length} results`);
      if (roomMembersData.length > 0) {
        console.log(`   Sample data:`, roomMembersData.slice(0, 3)); // Show first 3
      }
    }
    
    console.log('\n🧪 Testing rooms query...');
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (roomsError) {
      console.log(`❌ rooms query failed: ${roomsError.message}`);
      console.log(`   Code: ${roomsError.code}`);
      console.log(`   Hint: ${roomsError.hint}`);
      console.log(`   Details: ${roomsError.details}`);
    } else {
      console.log(`✅ rooms query successful: ${roomsData.length} results`);
    }
    
    // Test with a specific room ID if we have any
    if (roomMembersData && roomMembersData.length > 0) {
      console.log('\n🧪 Testing rooms query with specific room IDs...');
      const roomIds = roomMembersData.map(rm => rm.room_id);
      const { data: specificRoomsData, error: specificRoomsError } = await supabase
        .from('rooms')
        .select('*')
        .in('id', roomIds);
      
      if (specificRoomsError) {
        console.log(`❌ Specific rooms query failed: ${specificRoomsError.message}`);
      } else {
        console.log(`✅ Specific rooms query successful: ${specificRoomsData.length} results`);
      }
    }
    
    console.log('\n🎉 RLS testing completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ RLS testing failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the test function if this file is executed directly
if (require.main === module) {
  testRLS().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}