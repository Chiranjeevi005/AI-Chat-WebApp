/**
 * Vercel Setup Script
 * This script is designed to run on Vercel deployments to ensure
 * the database is properly set up with the required schema and initial data.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your Vercel environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

async function setupDatabase() {
  console.log('🔧 Setting up database for Vercel deployment...');
  
  try {
    // Check if profiles table exists
    const { data: profilesTable, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError && profilesError.message.includes('does not exist')) {
      console.log('❌ Database tables not found. Please run the setup-database script first.');
      console.log('You can do this locally or using a Supabase migration.');
      return;
    }

    console.log('✅ Database tables found');
    
    // Check if rooms exist, if not seed them
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('rooms')
      .select('id')
      .limit(1);

    if (roomsError) {
      console.error('❌ Error checking rooms:', roomsError);
      return;
    }

    if (!rooms || rooms.length === 0) {
      console.log('🌱 Seeding initial rooms...');
      
      // Import and run seedRooms
      const { seedRooms } = require('./seed-rooms');
      const result = await seedRooms();
      
      if (result.success) {
        console.log('✅ Rooms seeded successfully');
      } else {
        console.error('❌ Error seeding rooms:', result.error);
      }
    } else {
      console.log('✅ Rooms already exist');
    }

    console.log('✅ Database setup completed for Vercel deployment');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };