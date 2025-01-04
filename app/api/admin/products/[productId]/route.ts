import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        creator: true,
        tags: true,
        badges: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  const { name, description, price, stock, image, tags } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        name,
        description,
        price,
        stock,
        image,
        tags: {
          connect: tags.map((tagId: number) => ({ id: tagId })),
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch {
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 },
    );
  }
}
