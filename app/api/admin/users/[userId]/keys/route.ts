// /app/api/admin/users/[userId]/keys/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params; // Await the params
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    const keys = await prisma.license.findMany({
      where: { userId: parsedUserId },
    });
    return NextResponse.json(keys);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch keys' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { key, expiresAt } = await req.json(); // Get key and expiration from the request body
  const { userId } = await context.params;
  const parsedUserId = parseInt(userId, 10);

  try {
    // Create a new license key for the user
    const newKey = await prisma.license.create({
      data: {
        key,
        userId: parsedUserId,
        expiresAt: new Date(expiresAt), // Set expiration date
      },
    });

    return NextResponse.json(newKey); // Return the newly created key
  } catch {
    return NextResponse.json(
      { message: 'Failed to create key' },
      { status: 500 },
    );
  }
}
