import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Get user license keys
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    const userId = decoded.id;

    // Fetch all licenses for the user
    const licenses = await prisma.license.findMany({
      where: { userId },
      select: { key: true, expiresAt: true },
    });

    return NextResponse.json({ licenses });
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// Create a new license key
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;
  const { expiresAt } = await req.json(); // Assuming the expiry date is passed in the request body

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    const userId = decoded.id;

    // Generate a new license key (you can use a UUID or a random string generator)
    const newKey = generateLicenseKey(); // Replace with your logic to generate keys

    // Create a new license record in the database
    const newLicense = await prisma.license.create({
      data: {
        key: newKey,
        userId,
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json({
      message: 'License created successfully',
      license: newLicense,
    });
  } catch {
    return NextResponse.json(
      { message: 'Error creating license' },
      { status: 500 },
    );
  }
}

// Helper function to generate a unique license key
function generateLicenseKey() {
  return 'key-' + Math.random().toString(36).substr(2, 9); // Simple random string generator
}
