// Script to seed initial rooms in Supabase
require('dotenv').config({ path: '.env' });

// Use the service role key for server-side operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables for seeding');
  process.exit(1);
}

// Create a Supabase client with service role key for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Define initial rooms
const initialRooms = [
  {
    name: 'Welcome Lounge'
  },
  {
    name: 'AI Brainstorming'
  },
  {
    name: 'Tech Talk'
  },
  {
    name: 'Design Studio'
  },
  {
    name: 'Random Chit Chat'
  }
];

async function seedRooms() {
  try {
    console.log('Seeding initial rooms...');
    
    // Add a small delay to allow schema to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if rooms already exist
    const { data: existingRooms, error: fetchError } = await supabaseAdmin
      .from('rooms')
      .select('id, name');
    
    if (fetchError) {
      // If we get a schema cache error, try again after a longer delay
      if (fetchError.message.includes('schema cache') || fetchError.message.includes('not found') || fetchError.message.includes('does not exist')) {
        console.log('Schema cache not ready or table not found, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from('rooms')
          .select('id, name');
          
        if (retryError) {
          // If retry still fails, try a different approach
          if (retryError.message.includes('schema cache') || retryError.message.includes('not found') || retryError.message.includes('does not exist')) {
            console.log('Still having issues with schema cache. Let\'s try to insert directly...');
            // Try to insert directly without checking first
          } else {
            throw new Error(`Error fetching existing rooms after retry: ${retryError.message}`);
          }
        }
        
        // If retry succeeds, continue with the retry data
        if (retryData && retryData.length > 0) {
          console.log(`Found ${retryData.length} existing rooms. Skipping seeding.`);
          return { success: true, message: 'Rooms already exist, skipping seeding', rooms: retryData };
        }
      } else {
        throw new Error(`Error fetching existing rooms: ${fetchError.message}`);
      }
    }
    
    // If rooms already exist, skip seeding
    if (existingRooms && existingRooms.length > 0) {
      console.log(`Found ${existingRooms.length} existing rooms. Skipping seeding.`);
      return { success: true, message: 'Rooms already exist, skipping seeding', rooms: existingRooms };
    }
    
    // Insert initial rooms
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .insert(initialRooms)
      .select();
    
    if (error) {
      throw new Error(`Error inserting rooms: ${error.message}`);
    }
    
    console.log('Successfully seeded rooms:', data);
    return { success: true, message: 'Successfully seeded initial rooms', rooms: data };
  } catch (error) {
    console.error('Error seeding rooms:', error);
    return { success: false, error: error.message };
  }
}

async function run() {
  console.log('Starting room seeding process...');
  
  try {
    const result = await seedRooms();
    console.log('Seeding result:', result);
    
    if (result.success) {
      console.log('✅ Room seeding completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Room seeding failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error during room seeding:', error);
    process.exit(1);
  }
}

run();