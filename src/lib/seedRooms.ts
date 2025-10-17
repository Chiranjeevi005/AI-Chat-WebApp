import { createClient } from '@supabase/supabase-js';

// Use the service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for seeding');
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
    name: 'General Chat',
    description: 'A place for general discussions and announcements'
  },
  {
    name: 'Tech Talk',
    description: 'Discuss the latest in technology, programming, and innovation'
  },
  {
    name: 'Project Lounge',
    description: 'Collaborate on projects and share progress updates'
  },
  {
    name: 'Design Studio',
    description: 'Share design concepts, get feedback, and collaborate on creative projects'
  },
  {
    name: 'Random Chit Chat',
    description: 'Light-hearted conversations about anything and everything'
  },
  {
    name: 'Help & Support',
    description: 'Get help with technical issues or platform questions'
  },
  {
    name: 'Ideas & Feedback',
    description: 'Share your ideas and provide feedback on the platform'
  },
  {
    name: 'Off Topic',
    description: 'For discussions that don\'t fit in any other category'
  },
  {
    name: 'Welcome Lounge',
    description: 'A friendly space for newcomers to introduce themselves'
  },
  {
    name: 'Creative Brainstorming',
    description: 'Collaborate on creative ideas and problem-solving'
  }
];

export async function seedRooms() {
  try {
    // Check if rooms already exist
    const { data: existingRooms, error: fetchError } = await supabaseAdmin
      .from('rooms')
      .select('id, name');
    
    if (fetchError) {
      throw new Error(`Error fetching existing rooms: ${fetchError.message}`);
    }
    
    // If rooms already exist, skip seeding
    if (existingRooms && existingRooms.length > 0) {
      return { success: true, message: 'Rooms already exist, skipping seeding', rooms: existingRooms };
    }
    
    // Insert initial rooms
    const roomsToInsert = initialRooms.map((room) => ({
      name: room.name,
      description: room.description
      // We'll set created_by to null for now since we don't have a user
      // In a real scenario, you'd want to associate this with an admin user
    }));
    
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .insert(roomsToInsert)
      .select();
    
    if (error) {
      throw new Error(`Error inserting rooms: ${error.message}`);
    }
    
    return { success: true, message: 'Successfully seeded initial rooms', rooms: data };
  } catch (error) {
    console.error('Error seeding rooms:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedRooms().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}