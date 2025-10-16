require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing and fixing room_members policy...');

// Create clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function testAndFixPolicy() {
  try {
    console.log('\n1. Testing current policy with admin client...');
    
    // Test with admin client (should work)
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('room_members')
      .select('*')
      .limit(5);
    
    if (adminError) {
      console.log('❌ Admin client test failed:', adminError.message);
    } else {
      console.log('✅ Admin client test successful! Found', adminData?.length || 0, 'records');
    }
    
    console.log('\n2. Testing current policy with anon client (simulating frontend)...');
    
    // Test with anon client (this should fail with the current policy)
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('room_members')
      .select('*')
      .limit(5);
    
    if (anonError) {
      console.log('❌ Anon client test failed (expected with current policy):', anonError.message);
    } else {
      console.log('✅ Anon client test successful! Found', anonData?.length || 0, 'records');
    }
    
    console.log('\n3. Testing specific user query...');
    
    // Get a user ID to test with
    const { data: users, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.log('❌ Could not get user ID for testing');
      return;
    }
    
    const userId = users[0].id;
    console.log('   Testing with user ID:', userId);
    
    // Test the specific query that's failing in the frontend
    const { data: userRoomMembers, error: userRoomMembersError } = await supabaseAnon
      .from('room_members')
      .select('room_id')
      .eq('user_id', userId);
    
    if (userRoomMembersError) {
      console.log('❌ User-specific query failed:', userRoomMembersError.message);
      console.log('   This confirms the policy issue');
    } else {
      console.log('✅ User-specific query successful! Found', userRoomMembers?.length || 0, 'records');
    }
    
    console.log('\n4. Solution:');
    console.log('   The issue is in the room_members_select policy.');
    console.log('   Current policy requires users to be members of a room to see memberships for that room.');
    console.log('   This creates a circular dependency.');
    console.log('   ');
    console.log('   Fix: Change the policy to allow users to see their own memberships only.');
    console.log('   ');
    console.log('   SQL to fix:');
    console.log('   DROP POLICY IF EXISTS "room_members_select" ON room_members;');
    console.log('   CREATE POLICY "room_members_select" ON room_members');
    console.log('     FOR SELECT USING (');
    console.log('       auth.role() = \'authenticated\' AND');
    console.log('       user_id = auth.uid()');
    console.log('     );');
    console.log('   ');
    console.log('   You need to run this SQL in your Supabase SQL editor.');
    
  } catch (error) {
    console.error('❌ Error in test and fix process:', error);
  }
}

// Run the test
testAndFixPolicy();