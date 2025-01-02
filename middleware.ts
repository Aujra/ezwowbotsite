import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // Skip middleware for API routes
  if (url.startsWith('/api')) {
    return NextResponse.next();
  }

  // Handle authentication for protected pages
  const token = req.cookies.get('auth')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/', '/protected/:path*'], // Apply to these routes
};
