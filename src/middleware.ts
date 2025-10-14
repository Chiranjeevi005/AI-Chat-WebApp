import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { authMiddleware } from '@/lib/auth-middleware';

export async function middleware(request: NextRequest) {
  // Apply authentication middleware
  const response = await authMiddleware(request);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|robots.txt).*)',
  ],
};