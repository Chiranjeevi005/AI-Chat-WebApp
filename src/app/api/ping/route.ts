import { NextResponse } from 'next/server';

export async function GET() {
  // Removed verbose logging for security
  
  try {
    // Simple ping response without database connection
    return NextResponse.json({ status: 'ok', message: 'Server is running' });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json({ status: 'error', message: 'Server error' });
  }
}