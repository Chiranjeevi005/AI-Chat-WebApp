import { createClient } from '@/lib/auth-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // If there's no code, it means the OAuth flow failed
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }

  try {
    // Create a Supabase client
    const supabase = createClient();
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
    }

    // Redirect to the chat session page on successful login
    return NextResponse.redirect(new URL('/chat-session', request.url));
  } catch (error) {
    console.error('Unexpected error in callback route:', error);
    return NextResponse.redirect(new URL('/auth/login?error=unexpected_error', request.url));
  }
}