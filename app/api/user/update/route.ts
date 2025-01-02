import { PrismaClient } from '@prisma/client'; // Directly import PrismaClient from @prisma/client
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Instantiate Prisma client directly here
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Extract token from cookies
    const token = req.cookies.get('auth')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 },
      );
    }

    // Decode the token
    const decoded = jwt.verify(token, SECRET_KEY) as any;

    // Check if the decoded token contains user ID
    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 },
      );
    }

    // Prepare the updated data object
    const updatedData: any = {};

    if (password) {
      // If password is provided, hash it before updating
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (name) {
      updatedData.name = name;
    }

    if (email) {
      updatedData.email = email;
    }

    // Update the user in the database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Use userId to find the user
      data: updatedData, // Only update the fields that were provided
    });

    // Return success response
    return NextResponse.json(
      { message: 'Profile updated successfully', user: updatedUser },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: 'Error updating profile. Please try again later.' },
      { status: 500 },
    );
  }
}
