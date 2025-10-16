const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function checkSchema() {
  console.log('🔍 Checking rooms table schema...');
  
  try {
    // Check if the rooms table exists and get its columns
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error querying rooms table:', error);
      return;
    }
    
    console.log('✅ Successfully queried rooms table');
    console.log('Sample data:', data);
    
    // Check the profiles table as well
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.error('❌ Error querying profiles table:', profileError);
      return;
    }
    
    console.log('✅ Successfully queried profiles table');
    console.log('Sample profile data:', profileData);
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

// Run the check
checkSchema();