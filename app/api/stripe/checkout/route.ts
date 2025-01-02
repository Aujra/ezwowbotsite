import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  const { items } = await req.json(); // Get cart items from the request body

  // Check if the cart is empty
  if (!items || items.length === 0) {
    return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
  }

  // Create line items for Stripe
  const lineItems = items.map(
    (item: { type: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.type} License Key`, // Use the type of item (e.g., Basic License Key)
        },
        unit_amount: item.price, // Price in cents
      },
      quantity: item.quantity,
    }),
  );

  // Create a Checkout Session for the cart items
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
