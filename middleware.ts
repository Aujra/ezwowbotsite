import { jwtVerify } from 'jose'; // Import from the jose library
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function middleware(req: NextRequest) {
  // Bypass for login and API calls
  if (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next(); // Allow login and API routes without token verification
  }

  // Access the token from cookies (get the actual string value)
  const token = req.cookies.get('auth')?.value;

  if (!token) {
    // If no token is found, redirect to login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the token using the `jose` library
    await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    // If the token is valid, continue to the requested route
    return NextResponse.next();
  } catch {
    // If the token is invalid or expired, log the error and redirect to login

    // Clear the auth cookie if the token is invalid
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth'); // Delete the invalid token cookie
    return response;
  }
}

// Matcher for all routes
export const config = {
  matcher: ['/((?!_next).*)'], // Match everything except internal Next.js routes
};
