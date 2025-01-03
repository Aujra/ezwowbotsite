import { jwtVerify } from 'jose'; // JWT token verification library
import { NextRequest, NextResponse } from 'next/server';
import { totp } from 'otplib'; // Importing otplib for TOTP code verification

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function middleware(req: NextRequest) {
  // If the request is for login or API routes, bypass the middleware
  if (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup') ||
    req.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next(); // Allow login and API routes without token verification
  }

  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Admin-specific logic
    return await handleAdminMiddleware(req);
  }

  // General logic for other requests
  return await handleGeneralMiddleware(req);
}

// Handle general (non-admin) middleware for authentication
async function handleGeneralMiddleware(req: NextRequest) {
  if (!req.cookies.get('auth')?.value) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect if no token
  }

  try {
    const token = req.cookies.get('auth')?.value ?? '';
    await jwtVerify(token, new TextEncoder().encode(SECRET_KEY)); // Verify the JWT token

    return NextResponse.next(); // Allow the request to proceed if token is valid
  } catch (error) {
    console.error('Error in general middleware:', error);
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth'); // Delete the invalid token cookie
    return response;
  }
}

// Handle admin-specific middleware for authentication and 2FA verification
export async function handleAdminMiddleware(req: NextRequest) {
  // Bypass middleware for login, API routes, and 2FA setup page
  if (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/admin/enable-2fa') ||
    req.nextUrl.pathname.startsWith('/admin/verify-2fa')
  ) {
    return NextResponse.next(); // Allow these routes without token verification
  }

  if (!req.cookies.get('auth')?.value) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect if no token
  }

  try {
    const token = req.cookies.get('auth')?.value ?? '';
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY),
    ); // Verify JWT token

    // Check if the user is an admin
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if not admin
    }

    const apiUrl = `${req.nextUrl.origin}/api/admin/get-user?userId=${payload.id}`;

    // Call the API route to check if the user has valid 2FA
    const res = await fetch(apiUrl, {
      method: 'GET',
    });

    const user = await res.json();
    console.log('User details from API:', user);

    if (res.status !== 200) {
      return NextResponse.redirect(new URL('/login', req.url)); // Redirect if user not found or error
    }

    // Check if 2FA is enabled
    if (!user.is2FAEnabled) {
      // If 2FA is not enabled, redirect to 2FA setup page
      return NextResponse.redirect(new URL('/admin/enable-2fa', req.url)); // Redirect to 2FA setup page
    }

    // Check if 2FA has already been verified
    if (user.is2FAVerified) {
      // Skip 2FA verification and proceed
      return NextResponse.next();
    }

    // Validate the 2FA code from the headers
    const twoFactorCode = req.headers.get('x-2fa-code');
    if (!twoFactorCode) {
      return NextResponse.redirect(new URL('/admin/verify-2fa', req.url)); // Redirect to 2FA verification page
    }

    const isValid = totp.verify({
      token: twoFactorCode,
      secret: user.twoFactorSecret, // Retrieve the 2FA secret from the database
    });

    if (!isValid) {
      return NextResponse.redirect(new URL('/dashboard', req.url)); // Redirect to normal dashboard if 2FA fails
    }

    // Mark the user as having verified 2FA
    await fetch(`${req.nextUrl.origin}/api/admin/verify-2fa`, {
      method: 'POST',
      body: JSON.stringify({ userId: payload.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Store the is2FAVerified flag in the session or cookies (can be done via cookies)
    const response = NextResponse.next();
    response.cookies.set('is2FAVerified', 'true'); // Store the 2FA verification status

    return response;
  } catch (error) {
    console.error('Error in admin middleware:', error);
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth'); // Delete the invalid token cookie
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next).*)'], // Match everything except internal Next.js routes
};
