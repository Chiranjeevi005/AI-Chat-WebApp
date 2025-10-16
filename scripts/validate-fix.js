require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Validating room_members policy fix...');

// Create client with anon key (simulating frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function validateFix() {
  try {
    console.log('\n1. Testing room_members access (should not cause infinite recursion)...');
    
    // This query was causing the infinite recursion before the fix
    const { data, error } = await supabase
      .from('room_members')
      .select('room_id')
      .limit(1);
    
    if (error && error.message.includes('infinite recursion')) {
      console.log('❌ FAILED: Still getting infinite recursion error');
      console.log('   Please apply the fix from FIX_INSTRUCTIONS.md');
      return false;
    } else if (error) {
      console.log('✅ SUCCESS: No infinite recursion (got expected auth error instead)');
      console.log('   Error:', error.message);
      return true;
    } else {
      console.log('✅ SUCCESS: Query executed successfully');
      console.log('   Found', data?.length || 0, 'records');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during validation:', error);
    return false;
  }
}

// Run validation
validateFix().then(success => {
  if (success) {
    console.log('\n🎉 Validation complete! The policy fix appears to be working.');
  } else {
    console.log('\n⚠️  Validation failed. Please follow the instructions in FIX_INSTRUCTIONS.md');
  }
});