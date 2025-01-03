// /app/api/admin/get-user/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient(); // Initialize PrismaClient

export async function GET(req: Request) {
  try {
    // Extract userId from query parameters (or from request body if needed)
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    // Retrieve user details from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
