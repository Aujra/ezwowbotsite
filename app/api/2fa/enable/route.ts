// /app/api/2fa/enable/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
// Assuming Prisma client is set up

// Handler for enabling 2FA for a user
export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const { userId } = await req.json(); // User ID to enable 2FA for

  // 1. Generate a new TOTP secret for the user
  const secret = speakeasy.generateSecret({ name: 'ezwowbot' });

  // 2. Store the secret in the user's record
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret.base32, // Store the base32 encoded secret
      is2FAEnabled: true, // Mark the user as having 2FA enabled
    },
  });

  // 3. Generate a QR code URL for Google Authenticator
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url ?? '');

  // 4. Return the QR code URL so it can be displayed in the frontend
  return NextResponse.json({ qrCodeUrl });
}
