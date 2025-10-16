// Simple test script to check database structure
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU5MzksImV4cCI6MjA3NTk3MTkzOX0.sxQNeWpjaVIbRHA16zaskb7bl7MnnuN6XZXs9MkzkJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleQueries() {
  console.log('Testing simple database queries...');
  
  try {
    // Test rooms table
    console.log('\n1. Testing rooms table...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (roomsError) {
      console.error('❌ Rooms error:', roomsError);
    } else {
      console.log('✅ Rooms query successful');
      console.log('   Sample room:', rooms?.[0] || 'No data');
    }
    
    // Test profiles table
    console.log('\n2. Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles error:', profilesError);
    } else {
      console.log('✅ Profiles query successful');
      console.log('   Sample profile:', profiles?.[0] || 'No data');
    }
    
    // Test messages table
    console.log('\n3. Testing messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (messagesError) {
      console.error('❌ Messages error:', messagesError);
    } else {
      console.log('✅ Messages query successful');
      console.log('   Sample message:', messages?.[0] || 'No data');
    }
    
    // Test room_members table
    console.log('\n4. Testing room_members table...');
    const { data: roomMembers, error: roomMembersError } = await supabase
      .from('room_members')
      .select('*')
      .limit(1);
    
    if (roomMembersError) {
      console.error('❌ Room members error:', roomMembersError);
    } else {
      console.log('✅ Room members query successful');
      console.log('   Sample room member:', roomMembers?.[0] || 'No data');
    }
    
    // Test the specific query that's failing
    console.log('\n5. Testing user role query...');
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      console.log('   Testing with user ID:', userId);
      
      const { data: roleData, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (roleError) {
        console.error('❌ Role query error:', roleError);
      } else {
        console.log('✅ Role query successful');
        console.log('   User role:', roleData?.role || 'No role found');
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testSimpleQueries();