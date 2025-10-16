require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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

async function fixProfiles() {
  try {
    console.log('🔧 Fixing user profiles...');
    
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }
    
    console.log(`👥 Found ${profiles.length} profiles`);
    
    let fixedCount = 0;
    
    for (const profile of profiles) {
      console.log(`\n👤 Processing profile: ${profile.id}`);
      console.log(`   Current email: ${profile.email || 'null'}`);
      console.log(`   Current username: ${profile.username || 'null'}`);
      
      // Fix profiles with null emails
      if (!profile.email) {
        // Generate a placeholder email based on the user ID
        const placeholderEmail = `user-${profile.id.substring(0, 8)}@example.com`;
        
        console.log(`   Setting email to: ${placeholderEmail}`);
        
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ 
            email: placeholderEmail,
            username: profile.username || `user-${profile.id.substring(0, 8)}`
          })
          .eq('id', profile.id);
        
        if (updateError) {
          console.log(`   ❌ Failed to update profile: ${updateError.message}`);
        } else {
          console.log(`   ✅ Profile updated successfully`);
          fixedCount++;
        }
      } else {
        console.log(`   ✅ Profile already has email, no changes needed`);
      }
    }
    
    console.log(`\n✅ Successfully fixed ${fixedCount} profiles`);
    return { success: true, message: `Fixed ${fixedCount} profiles` };
  } catch (error) {
    console.error('❌ Error fixing profiles:', error);
    return { success: false, error: error.message };
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  fixProfiles().then(result => {
    console.log(result);
    process.exit(result.success ? 0 : 1);
  });
}