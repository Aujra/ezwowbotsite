import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient(); // Initialize Prisma client

// Handler for updating the expiration of a license key
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string; keyId: string }> },
) {
  const { userId, keyId } = await context.params; // Await the params

  // Parse the userId and keyId as integers if needed
  const parsedUserId = parseInt(userId, 10);
  const parsedKeyId = parseInt(keyId, 10);

  // Ensure the values are valid integers
  if (isNaN(parsedUserId) || isNaN(parsedKeyId)) {
    return NextResponse.json(
      { message: 'Invalid userId or keyId' },
      { status: 400 },
    );
  }

  // Parse the request body to get the new expiration date
  const { expiresAt } = await req.json();

  try {
    // Update the expiration date for the key
    const updatedKey = await prisma.license.update({
      where: { id: parsedKeyId },
      data: {
        expiresAt: new Date(expiresAt), // Set expiration date
      },
    });

    return NextResponse.json(updatedKey); // Return the updated key
  } catch (error) {
    console.error('Error updating key expiration:', error);
    return NextResponse.json(
      { message: 'Error updating key expiration' },
      { status: 500 },
    );
  }
}
