import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address') || 
                       request.cookies.get('wallet-address')?.value;

  const publicPaths = ['/', '/api/auth', '/connect-wallet'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!walletAddress && request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Wallet not connected' },
      { status: 401 }
    );
  }

  if (walletAddress) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-wallet-address', walletAddress);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
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