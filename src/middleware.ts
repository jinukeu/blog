import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 프로덕션 환경에서 /admin 경로 차단
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
