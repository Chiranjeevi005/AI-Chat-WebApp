// Test script to check if Supabase client is working
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

// Check if environment variables are properly set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('✅ Supabase client created successfully');

// Test connection by fetching rooms
async function testConnection() {
  try {
    console.log('Testing connection by fetching rooms...');
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching rooms:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('Rooms count:', data?.length || 0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();