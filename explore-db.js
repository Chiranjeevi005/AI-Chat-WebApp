// Explore database structure
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU5MzksImV4cCI6MjA3NTk3MTkzOX0.sxQNeWpjaVIbRHA16zaskb7bl7MnnuN6XZXs9MkzkJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exploreDB() {
  console.log('Exploring database structure...');
  
  try {
    // Test basic queries on each table to see what exists
    console.log('\n1. Testing basic table access...');
    
    // Test rooms
    try {
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .limit(1);
      
      if (roomsError) {
        console.log('   ❌ rooms:', roomsError.message);
      } else {
        console.log('   ✅ rooms: Accessible');
        if (rooms && rooms.length > 0) {
          console.log('      Sample:', JSON.stringify(rooms[0], null, 2));
        }
      }
    } catch (err) {
      console.log('   ❌ rooms:', err.message);
    }
    
    // Test messages
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .limit(1);
      
      if (messagesError) {
        console.log('   ❌ messages:', messagesError.message);
      } else {
        console.log('   ✅ messages: Accessible');
        if (messages && messages.length > 0) {
          console.log('      Sample:', JSON.stringify(messages[0], null, 2));
        }
      }
    } catch (err) {
      console.log('   ❌ messages:', err.message);
    }
    
    // Test profiles
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profilesError) {
        console.log('   ❌ profiles:', profilesError.message);
      } else {
        console.log('   ✅ profiles: Accessible');
        if (profiles && profiles.length > 0) {
          console.log('      Sample:', JSON.stringify(profiles[0], null, 2));
        }
      }
    } catch (err) {
      console.log('   ❌ profiles:', err.message);
    }
    
    // Test room_members
    try {
      const { data: roomMembers, error: roomMembersError } = await supabase
        .from('room_members')
        .select('*')
        .limit(1);
      
      if (roomMembersError) {
        console.log('   ❌ room_members:', roomMembersError.message);
      } else {
        console.log('   ✅ room_members: Accessible');
        if (roomMembers && roomMembers.length > 0) {
          console.log('      Sample:', JSON.stringify(roomMembers[0], null, 2));
        }
      }
    } catch (err) {
      console.log('   ❌ room_members:', err.message);
    }
    
    // Test users
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (usersError) {
        console.log('   ❌ users:', usersError.message);
      } else {
        console.log('   ✅ users: Accessible');
        if (users && users.length > 0) {
          console.log('      Sample:', JSON.stringify(users[0], null, 2));
        }
      }
    } catch (err) {
      console.log('   ❌ users:', err.message);
    }
    
    // Check what columns exist in profiles
    console.log('\n2. Checking profiles columns...');
    try {
      const { data: profileSample, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profileError) {
        console.log('   ❌ Profile sample error:', profileError.message);
      } else if (profileSample && profileSample.length > 0) {
        const profile = profileSample[0];
        console.log('   ✅ Profile columns:');
        Object.keys(profile).forEach(key => {
          console.log(`      ${key}: ${JSON.stringify(profile[key])}`);
        });
      } else {
        console.log('   No profile data found');
      }
    } catch (err) {
      console.log('   ❌ Profile columns error:', err.message);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

exploreDB();