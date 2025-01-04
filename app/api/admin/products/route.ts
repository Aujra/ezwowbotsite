// /app/api/admin/products/route.ts

import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose'; // JWT verification library
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Your JWT secret

export async function GET() {
  try {
    // Fetch all products, including related creator (user), tags, and badges
    const products = await prisma.product.findMany({
      include: {
        creator: true, // Include the creator (user) who made the product
        tags: true, // Include related tags
        badges: true, // Include related badges
      },
    });

    // Return the products as a JSON response
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const {
    name,
    description,
    price,
    stock,
    image,
    tags, // No need for creatorId in the request body
  } = await req.json();

  // Get the user ID from the JWT token (creator of the product)
  const token = req.cookies.get('auth')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY),
    );
    const creatorId = payload.id as number; // Get the creator's ID from the token payload

    console.log('Product ', {
      name,
      description,
      price,
      stock,
      image,
      tags,
      creatorId,
    });

    // Create a new product and associate the creator (user) by creatorId
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
        creator: { connect: { id: creatorId } }, // Automatically use the creator's ID
        tags:
          tags && tags.length > 0
            ? { connect: tags.map((tagId: number) => ({ id: tagId })) } // Only connect if tags are provided
            : { connect: [] }, // If no tags, just pass an empty array
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 },
    );
  }
}
