import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  // This route is for testing Supabase authentication
  
  return NextResponse.json({ 
    auth: 'success', 
    provider: 'Supabase',
    message: 'Authentication endpoint ready' 
  });
}