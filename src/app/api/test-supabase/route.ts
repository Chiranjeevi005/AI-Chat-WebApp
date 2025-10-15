import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test Supabase connection by querying the rooms table
    const { data, error, count } = await supabase
      .from('rooms')
      .select('count()', { count: 'exact' });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      count: count
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message
    }, { status: 500 });
  }
}