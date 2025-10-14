import { getSession } from '@/lib/auth-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'No session found' 
      });
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      user: session.user,
      message: 'Session found' 
    });
  } catch (error) {
    console.error('Error in test session API:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}