import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully' }),
      {
        status: 201,
      },
    );
  } catch {
    return new Response('Error creating user', { status: 500 });
  }
}
