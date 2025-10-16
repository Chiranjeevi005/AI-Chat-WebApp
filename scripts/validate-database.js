require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for validation');
}

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function validateDatabase() {
  try {
    console.log('🔍 Validating database setup...');
    
    // Check if tables exist
    console.log('\n📋 Checking tables...');
    const tablesToCheck = ['profiles', 'rooms', 'messages', 'room_members'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('count()', { count: 'exact' });
        
        if (error) {
          console.log(`❌ ${tableName}: Error - ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Exists (${data.length} rows)`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Error - ${err.message}`);
      }
    }
    
    // Check RLS status
    console.log('\n🛡️  Checking Row Level Security...');
    const { data: rlsData, error: rlsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        SELECT tablename, relrowsecurity 
        FROM pg_class c 
        JOIN pg_namespace n ON c.relnamespace = n.oid 
        WHERE n.nspname = 'public' 
        AND tablename IN ('profiles', 'rooms', 'messages', 'room_members')
      `
    });
    
    if (rlsError) {
      console.log(`⚠️  RLS check failed: ${rlsError.message}`);
    } else {
      console.log('✅ RLS status check completed');
    }
    
    // Check if rooms exist
    console.log('\n💬 Checking rooms...');
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('*');
    
    if (roomsError) {
      console.log(`❌ Rooms query failed: ${roomsError.message}`);
    } else {
      console.log(`✅ Found ${rooms.length} rooms`);
      rooms.forEach(room => {
        console.log(`   - ${room.name}`);
      });
    }
    
    // Check if room members exist
    console.log('\n👥 Checking room members...');
    const { data: members, error: membersError } = await supabaseAdmin
      .from('room_members')
      .select('*');
    
    if (membersError) {
      console.log(`❌ Room members query failed: ${membersError.message}`);
    } else {
      console.log(`✅ Found ${members.length} room memberships`);
    }
    
    console.log('\n✨ Database validation completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the validation function if this file is executed directly
if (require.main === module) {
  validateDatabase().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { validateDatabase };