import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Use Node.js runtime to access `process`

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: '1d',
  });

  const response = NextResponse.json({ message: 'Login successful' });

  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 60); // Set cookie expiration to 60 minutes (adjust as needed)
  // Set the JWT token in the cookies
  response.cookies.set('auth', token, {
    httpOnly: true, // Ensure the cookie is HttpOnly
    secure: true, // Secure flag only in production
    sameSite: 'none', // Allow cookies to be sent across domains (needed for cross-origin requests)
    path: '/', // Set cookie for the entire domain
    expires: expires, // Set the expiration time
  });

  // Return the response
  return response;
}
