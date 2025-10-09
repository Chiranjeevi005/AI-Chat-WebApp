import { NextResponse } from 'next/server';

// This is a placeholder route for Socket.IO
// Socket.IO handles its own connections, so we just return a simple response
export async function GET() {
  return NextResponse.json({ socket: 'ready' });
}