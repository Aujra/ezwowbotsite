'use client';

import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]); // Store cart items (license keys and quantities)
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  // Add a new item to the cart (with type and quantity)
  const handleAddToCart = (itemType: string, price: number) => {
    // Check if the item already exists in the cart
    const existingItem = cartItems.find((item) => item.type === itemType);

    if (existingItem) {
      // If item already exists, increase the quantity
      const updatedCart = cartItems.map((item) =>
        item.type === itemType
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCartItems(updatedCart);
    } else {
      // If the item doesn't exist, add it to the cart
      setCartItems([...cartItems, { type: itemType, price, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemType: string) => {
    setCartItems(cartItems.filter((item) => item.type !== itemType));
  };

  // Handle the "Checkout" button click
  const handleCheckout = async () => {
    setLoading(true);

    // Send the cart items to the backend to create a checkout session
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: cartItems }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const { url } = await res.json();
    setUrl(url);
    window.location.href = url; // Redirect to Stripe Checkout page
  };

  useEffect(() => {
    if (url) {
      window.location.href = url; // Redirect to the Stripe Checkout page
    }
  }, [url]); // Run the redirect when `url` is set

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Your Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <List>
          {cartItems.map((item, index) => (
            <ListItem key={index}>
              <Typography variant="body1">{item.type}</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                Price: ${(item.price / 100).toFixed(2)} | Quantity:{' '}
                {item.quantity}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveFromCart(item.type)}
                sx={{ ml: 2 }}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 2 }} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddToCart('Basic License Key', 1000)} // Adding Basic License Key with $10 price
      >
        Add Basic License Key ($10)
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddToCart('Premium License Key', 2000)} // Adding Premium License Key with $20 price
        sx={{ ml: 2 }}
      >
        Add Premium License Key ($20)
      </Button>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || loading}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </Box>
    </Box>
  );
}
