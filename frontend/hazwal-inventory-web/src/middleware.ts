import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Route yang require authentication
  const protectedRoutes = [
    '/dashboard',
    '/chemicals',
    '/trucks',
    '/deliveries',
    '/reports',
    '/settings',
  ];

  // Jika akses protected route tapi belum ada token, redirect ke login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Jika sudah login (ada token) dan akses halaman login, redirect ke dashboard
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};