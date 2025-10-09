import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';

export async function GET() {
  console.log('Ping request received');
  
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ status: 'error', message: 'Database connection failed' });
  }
}