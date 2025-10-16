// Test script to check database schema
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU5MzksImV4cCI6MjA3NTk3MTkzOX0.sxQNeWpjaVIbRHA16zaskb7bl7MnnuN6XZXs9MkzkJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSchema() {
  console.log('Testing database schema...');
  
  try {
    // Check if rooms table exists and has data
    console.log('\n1. Checking rooms table...');
    const { data: roomsData, error: roomsError, count: roomsCount } = await supabase
      .from('rooms')
      .select('*', { count: 'exact' });
    
    if (roomsError) {
      console.error('❌ Error fetching rooms:', roomsError);
    } else {
      console.log('✅ Rooms table accessible');
      console.log('   Count:', roomsCount);
      console.log('   Sample room:', roomsData?.[0] || 'No data');
    }
    
    // Check if messages table exists
    console.log('\n2. Checking messages table...');
    const { data: messagesData, error: messagesError, count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (messagesError) {
      console.error('❌ Error fetching messages:', messagesError);
    } else {
      console.log('✅ Messages table accessible');
      console.log('   Count:', messagesCount);
      console.log('   Sample message:', messagesData?.[0] || 'No data');
    }
    
    // Check if profiles table exists
    console.log('\n3. Checking profiles table...');
    const { data: profilesData, error: profilesError, count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('   Count:', profilesCount);
      console.log('   Sample profile:', profilesData?.[0] || 'No data');
    }
    
    // Test a specific query that's failing in the app
    console.log('\n4. Testing specific query from chat session...');
    if (roomsData && roomsData.length > 0) {
      const roomId = roomsData[0].id;
      console.log('   Testing with room ID:', roomId);
      
      const { data: specificData, error: specificError } = await supabase
        .from('messages')
        .select('*, profiles(username, display_name)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      
      if (specificError) {
        console.error('❌ Error in specific query:', specificError);
      } else {
        console.log('✅ Specific query successful');
        console.log('   Messages count:', specificData?.length || 0);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testSchema();