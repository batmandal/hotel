import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.get('ubhotel_auth')?.value === '1';
  const role = request.cookies.get('ubhotel_role')?.value;

  if (pathname.startsWith('/admin')) {
    if (!isAuth) return redirectToLogin(request);
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/staff')) {
    if (!isAuth) return redirectToLogin(request);
    if (role !== 'STAFF' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  if (pathname.startsWith('/my-bookings') || pathname.startsWith('/profile')) {
    if (!isAuth) return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/staff/:path*', '/my-bookings/:path*', '/profile/:path*'],
};
