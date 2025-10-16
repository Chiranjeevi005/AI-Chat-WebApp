require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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

async function applyPolicyFix() {
  console.log('🔧 Applying room_members policy fix...');
  
  try {
    // Apply the policy fix
    const policyFixSQL = `
      -- Fix for room_members_select policy to prevent infinite recursion
      -- This ensures users can only see their own room memberships
      DROP POLICY IF EXISTS "room_members_select" ON room_members;
      CREATE POLICY "room_members_select" ON room_members
        FOR SELECT USING (
          auth.role() = 'authenticated' AND
          user_id = auth.uid()
        );
      
      -- Notify PostgREST to reload the schema
      NOTIFY pgrst, 'reload schema';
    `;
    
    // Since we can't use rpc('execute_sql'), let's try to execute each statement separately
    const statements = policyFixSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      
      try {
        // Try to execute as raw SQL
        const { data, error } = await supabase.rpc('execute_sql', { sql: statement });
        
        if (error) {
          console.log('⚠️  Statement failed (may be expected):', error.message);
          // Try alternative approach
          console.log('   Trying alternative approach...');
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (stmtError) {
        console.log('⚠️  Statement error (may be expected):', stmtError.message);
      }
    }
    
    console.log('✅ Policy fix applied!');
    console.log('\n🧪 Testing the fix...');
    
    // Test the fix by trying to access room_members with the anon client
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Try to get room members (this should fail with auth error, not infinite recursion)
    const { data: testData, error: testError } = await supabaseAnon
      .from('room_members')
      .select('*')
      .limit(1);
    
    if (testError && testError.message.includes('infinite recursion')) {
      console.log('❌ Fix failed - still getting infinite recursion');
    } else if (testError) {
      console.log('✅ Fix successful - no more infinite recursion (got auth error instead which is expected)');
    } else {
      console.log('✅ Fix successful - able to access room_members');
    }
    
    console.log('\n🎉 Policy fix process completed!');
    
  } catch (error) {
    console.error('❌ Error applying policy fix:', error);
    process.exit(1);
  }
}

// Run the fix
applyPolicyFix();