require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
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

// Admin user credentials
const adminEmail = 'chiranjeevi8050@gmail.com';
const adminPassword = 'Password123';

async function createAdminUser() {
  console.log('🔧 Creating admin user...');
  
  try {
    // Check if admin user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('✅ Admin user already exists');
      
      // Update role to admin if needed
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', adminEmail);

      if (updateError) {
        console.error('❌ Error updating admin role:', updateError);
        return;
      }

      console.log('✅ Admin role confirmed');
      return;
    }

    // Create admin user account
    const { data: authUser, error: signUpError } = await supabaseAdmin.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          username: 'admin',
        }
      }
    });

    if (signUpError) {
      console.error('❌ Error creating admin user:', signUpError);
      return;
    }

    console.log('✅ Admin user created successfully');
    
    // Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update user profile to set admin role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authUser.user.id);

    if (updateError) {
      console.error('❌ Error setting admin role:', updateError);
      return;
    }

    console.log('✅ Admin role assigned successfully');
    console.log('🔐 Admin credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('⚠️  Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the setup
createAdminUser();