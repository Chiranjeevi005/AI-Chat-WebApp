// Test script to check if Supabase client is working with hardcoded values
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU5MzksImV4cCI6MjA3NTk3MTkzOX0.sxQNeWpjaVIbRHA16zaskb7bl7MnnuN6XZXs9MkzkJY';

console.log('Using hardcoded credentials:');
console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client created successfully');

// Test connection by fetching rooms
async function testConnection() {
  try {
    console.log('Testing connection by fetching rooms...');
    const { data, error, count } = await supabase
      .from('rooms')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error fetching rooms:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('Rooms count:', count);
    console.log('First room:', data?.[0] || 'No rooms found');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();