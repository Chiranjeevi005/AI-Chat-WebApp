// Check what tables exist in the database
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTU5MzksImV4cCI6MjA3NTk3MTkzOX0.sxQNeWpjaVIbRHA16zaskb7bl7MnnuN6XZXs9MkzkJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking database tables...');
  
  try {
    // Get list of tables
    console.log('\n1. Getting list of tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Tables error:', tablesError);
      
      // Try a different approach
      console.log('\nTrying alternative approach...');
      
      // Test common table names
      const commonTables = ['rooms', 'messages', 'profiles', 'room_members', 'users'];
      
      for (const tableName of commonTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('count()', { count: 'exact' });
          
          if (error) {
            console.log(`   ❌ ${tableName}: Not accessible (${error.message})`);
          } else {
            console.log(`   ✅ ${tableName}: Accessible (count: ${data?.[0]?.count || 0})`);
          }
        } catch (err) {
          console.log(`   ❌ ${tableName}: Error (${err.message})`);
        }
      }
    } else {
      console.log('✅ Tables query successful');
      console.log('   Tables found:');
      tables.forEach(table => {
        console.log(`     - ${table.table_name}`);
      });
    }
    
    // Check profiles table structure
    console.log('\n2. Checking profiles table structure...');
    const { data: profileColumns, error: profileColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'profiles')
      .order('ordinal_position');
    
    if (profileColumnsError) {
      console.error('❌ Profiles columns error:', profileColumnsError);
      
      // Try to get sample data to infer structure
      console.log('\nTrying to get sample profile data...');
      const { data: sampleProfiles, error: sampleError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('❌ Sample profiles error:', sampleError);
      } else {
        console.log('✅ Sample profiles data:');
        if (sampleProfiles && sampleProfiles.length > 0) {
          const profile = sampleProfiles[0];
          console.log('   Columns:');
          Object.keys(profile).forEach(key => {
            console.log(`     ${key}: ${typeof profile[key]}`);
          });
        } else {
          console.log('   No profile data found');
        }
      }
    } else {
      console.log('✅ Profiles columns query successful');
      console.log('   Columns:');
      profileColumns.forEach(col => {
        console.log(`     ${col.column_name}: ${col.data_type}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkTables();