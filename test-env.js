// Simple script to test if environment variables are loaded
require('dotenv').config();

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

// Check if the URL matches what we expect
const expectedUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
if (process.env.NEXT_PUBLIC_SUPABASE_URL === expectedUrl) {
  console.log('✅ URL matches expected value');
} else {
  console.log('❌ URL does not match expected value');
  console.log('Expected:', expectedUrl);
  console.log('Actual:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}