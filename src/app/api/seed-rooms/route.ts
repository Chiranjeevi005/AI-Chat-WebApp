import { NextResponse } from 'next/server';
import { seedRooms } from '@/lib/seedRooms';

export async function POST() {
  try {
    // Allow seeding in both development and production for demo purposes
    // if (process.env.NODE_ENV !== 'development') {
    //   return NextResponse.json({ 
    //     success: false, 
    //     message: 'Room seeding is only allowed in development environment' 
    //   }, { status: 403 });
    // }

    const result = await seedRooms();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed-rooms API route:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Send a POST request to seed initial rooms' 
  });
}