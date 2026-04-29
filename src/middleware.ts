import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // 1. EXEMPT API ROUTES (Crucial for Stripe Webhooks)
  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Define your domains
  const storeDomain = 'store.jkeysmp.net';
  const webDomain = 'web.jkeysmp.net';
  const rootDomain = 'jkeysmp.net';

  // For local development
  const isLocal = hostname?.includes('localhost');
  
  // 2. Handle Store Subdomain
  if (hostname === storeDomain || (isLocal && url.searchParams.get('subdomain') === 'store')) {
    if (url.pathname.startsWith('/store')) {
       return NextResponse.redirect(new URL(url.pathname.replace('/store', ''), request.url));
    }
    return NextResponse.rewrite(new URL(`/store${url.pathname}`, request.url));
  }

  // 3. Handle Web Subdomain
  if (hostname === webDomain || (isLocal && url.searchParams.get('subdomain') === 'web')) {
    if (url.pathname.startsWith('/web')) {
       return NextResponse.redirect(new URL(url.pathname.replace('/web', ''), request.url));
    }
    return NextResponse.rewrite(new URL(`/web${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
