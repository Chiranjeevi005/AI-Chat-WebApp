import { NextResponse } from 'next/server';

export async function GET() {
  // Simple test to check if environment variables are loaded
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    return NextResponse.json({ 
      success: false, 
      error: 'NEXT_PUBLIC_SUPABASE_URL is not set'
    }, { status: 500 });
  }

  // Check if it matches what we expect
  const expectedUrl = 'https://iyqtfhvuuesdzpsbnxad.supabase.co';
  const matches = supabaseUrl === expectedUrl;

  return NextResponse.json({ 
    success: true,
    message: 'Environment variables loaded successfully',
    supabaseUrl,
    expectedUrl,
    matches
  });
}