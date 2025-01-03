// /app/api/admin/verify-2fa/route.ts

import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose'; // JWT verification library
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib'; // Import otplib for TOTP code verification

const prisma = new PrismaClient(); // Initialize Prisma client

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Your JWT secret

export async function POST(req: NextRequest) {
  const { twoFactorCode } = await req.json();

  if (!twoFactorCode) {
    return NextResponse.json(
      { message: '2FA code is required' },
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

    console.log('Decoded JWT Payload:', payload); // Log the payload to check the available fields

    // Extract the user ID from the JWT token's payload (corrected)
    const userId = payload.id as number; // Use 'id' instead of 'userId'

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found in token' },
        { status: 400 },
      );
    }

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify the 2FA code using the secret stored in the database
    const isValid = authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFactorSecret ?? '', // Retrieve the 2FA secret from the database
    });

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid 2FA code' },
        { status: 401 },
      );
    }

    // Mark the user as having verified 2pnpm prisma migrate statusFA
    await prisma.user.update({
      where: { id: userId },
      data: { is2FAVerified: true }, // Add a field `is2FAVerified` to mark successful verification
    });

    return NextResponse.json({ message: '2FA verified successfully' });
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
