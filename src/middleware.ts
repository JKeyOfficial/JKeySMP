import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // 1. EXEMPT API ROUTES (Crucial for Stripe Webhooks)
  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. EXEMPT STATIC ASSETS
  const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.css', '.js', '.woff', '.woff2', '.ttf'];
  if (staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)).*)',
  ],
};
