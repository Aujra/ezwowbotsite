import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  return new Response(JSON.stringify({ message: 'Login successful', token }), {
    status: 200,
  });
}
