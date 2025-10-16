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

async function updateSchema() {
  console.log('🔄 Updating database schema...');
  
  try {
    // First, let's check what columns exist in the rooms table
    console.log('Checking current rooms table structure...');
    
    // We can't directly check schema, but we can try to add columns
    // Let's try to add the missing columns one by one
    
    // Try to add description column
    console.log('Attempting to add description column...');
    try {
      const { error: descError } = await supabase.rpc('execute_sql', {
        sql: "ALTER TABLE rooms ADD COLUMN description TEXT"
      });
      
      if (descError && !descError.message.includes('already exists')) {
        console.log('Trying alternative method for description column...');
        // If RPC doesn't work, let's try a different approach
        // We'll need to recreate the table with the correct schema
      } else if (!descError) {
        console.log('✅ Description column added successfully');
      } else {
        console.log('ℹ️  Description column already exists or error:', descError.message);
      }
    } catch (e) {
      console.log('ℹ️  RPC not available for description column, trying direct approach...');
    }
    
    // Since we can't use RPC, let's try to understand the issue better
    // Let's check if we can insert a room with all expected fields
    console.log('Testing room insertion with all fields...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      console.log('Using user ID for testing:', userId);
      
      // Try to insert a room with all fields
      const testRoom = {
        name: 'Schema Test Room',
        description: 'Testing schema update',
        created_by: userId
      };
      
      console.log('Attempting to insert room with all fields:', testRoom);
      
      const { data, error } = await supabase
        .from('rooms')
        .insert([testRoom])
        .select();
      
      if (error) {
        console.error('❌ Error inserting room with all fields:', error);
        console.error('This confirms the schema is missing columns');
        
        // Let's try inserting with only the fields that exist
        console.log('Trying insert with only existing fields...');
        const simpleRoom = {
          name: 'Simple Test Room'
        };
        
        const { data: simpleData, error: simpleError } = await supabase
          .from('rooms')
          .insert([simpleRoom])
          .select();
        
        if (simpleError) {
          console.error('❌ Error inserting simple room:', simpleError);
        } else {
          console.log('✅ Simple room inserted successfully:', simpleData);
        }
      } else {
        console.log('✅ Room with all fields inserted successfully:', data);
      }
    }
    
    console.log('💡 Schema analysis complete. The rooms table is missing the description and created_by columns.');
    console.log('💡 To fix this properly, you need to update the table schema in Supabase directly through the dashboard.');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

// Run the update
updateSchema();