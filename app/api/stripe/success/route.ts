import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id'); // Get session_id from the URL

  if (!sessionId) {
    return NextResponse.json(
      { message: 'Session ID is required' },
      { status: 400 },
    );
  }

  // Extract token from cookies or headers   (depending on where you store it)
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Authorization token is missing' },
      { status: 401 },
    );
  }

  try {
    // Verify and decode the token to extract the user ID
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    // Retrieve the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      // Generate a new license key for the user (you can customize this logic)
      const licenseKey = 'key-' + Math.random().toString(36).substr(2, 9);

      // Store the license in the database
      await prisma.license.create({
        data: {
          key: licenseKey,
          userId, // Use the extracted userId
          expiresAt: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ), // Set expiry date for 1 year
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        licenseKey,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Payment failed or was canceled' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error verifying payment or decoding token.' },
      { status: 500 },
    );
  }
}
