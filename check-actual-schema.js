// Script to check the actual database schema
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Hardcoded Supabase credentials
const supabaseUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cXRmaHZ1dWVzZHpwc2JueGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM5NTkzOSwiZXhwIjoyMDc1OTcxOTM5fQ.r1wNapfGljWL38vdogmsl4ogstFsSKG0JVJllFbdD2M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Checking actual database schema...\n');
  
  try {
    // Check rooms table structure
    console.log('1. Rooms table structure:');
    const { data: roomsInfo, error: roomsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'rooms')
      .order('ordinal_position');
    
    if (roomsError) {
      console.error('Error fetching rooms info:', roomsError);
    } else {
      console.log('   Columns:');
      roomsInfo.forEach(col => {
        console.log(`     ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    }
    
    // Check messages table structure
    console.log('\n2. Messages table structure:');
    const { data: messagesInfo, error: messagesError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'messages')
      .order('ordinal_position');
    
    if (messagesError) {
      console.error('Error fetching messages info:', messagesError);
    } else {
      console.log('   Columns:');
      messagesInfo.forEach(col => {
        console.log(`     ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    }
    
    // Check profiles table structure
    console.log('\n3. Profiles table structure:');
    const { data: profilesInfo, error: profilesError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'profiles')
      .order('ordinal_position');
    
    if (profilesError) {
      console.error('Error fetching profiles info:', profilesError);
    } else {
      console.log('   Columns:');
      profilesInfo.forEach(col => {
        console.log(`     ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    }
    
    // Check foreign key constraints
    console.log('\n4. Foreign key constraints:');
    const { data: fkInfo, error: fkError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name, table_name, constraint_type')
      .in('table_name', ['rooms', 'messages', 'profiles'])
      .eq('constraint_type', 'FOREIGN KEY');
    
    if (fkError) {
      console.error('Error fetching foreign key info:', fkError);
    } else {
      if (fkInfo.length === 0) {
        console.log('   No foreign key constraints found');
      } else {
        fkInfo.forEach(constraint => {
          console.log(`   ${constraint.constraint_name}: ${constraint.table_name}`);
        });
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkSchema();