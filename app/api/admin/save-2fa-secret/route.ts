// /app/api/admin/save-2fa-secret/route.ts

import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose'; // JWT verification library
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient(); // Initialize Prisma client

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Your JWT secret

export async function POST(req: NextRequest) {
  const { twoFactorSecret } = await req.json();

  if (!twoFactorSecret) {
    return NextResponse.json(
      { message: 'Missing 2FA secret' },
      { status: 400 },
    );
  }

  try {
    // Extract the token from the request cookies
    const token = req.cookies.get('auth')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication token missing' },
        { status: 401 },
      );
    }

    // Verify the JWT token and extract the payload
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY),
    );

    // Extract the user ID from the JWT token's payload
    const userId = payload.id as number;

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found in token' },
        { status: 400 },
      );
    }

    // Save the 2FA secret to the user's record in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret,
        is2FAEnabled: true,
      },
    });

    return NextResponse.json({
      message: '2FA secret saved successfully',
      user,
    });
  } catch (error) {
    console.error('Error saving 2FA secret:', error);
    return NextResponse.json(
      { message: 'Error saving 2FA secret' },
      { status: 500 },
    );
  }
}
