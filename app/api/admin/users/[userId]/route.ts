// /app/api/admin/users/[userId]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Handler for GET request (fetch a user by userId)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params; // Unwrap the Promise to access userId

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }, // Parse userId as integer
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 },
    );
  }
}

// Handler for PUT request (update a user's information)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const updatedData = await req.json(); // Parse incoming JSON request body
  const { userId } = await context.params; // Extract userId from params (unwrap the Promise)

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) }, // Update user by userId
      data: updatedData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 },
    );
  }
}
