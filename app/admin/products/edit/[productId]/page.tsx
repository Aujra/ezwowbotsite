'use client';

import { TextField, Button, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Use useParams for dynamic route parameters
import { useState, useEffect } from 'react';

const EditProduct = () => {
  const router = useRouter();
  const { productId } = useParams(); // Get productId from URL params
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!productId) return;

    // Fetch product details
    const fetchProduct = async () => {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setName(data.name);
      setPrice(data.price);
      setStock(data.stock);
      setDescription(data.description);
      setImage(data.image);
    };

    fetchProduct();
  }, [productId]);

  const handleSave = async () => {
    const updatedProduct = { name, price, stock, description, image };
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    if (res.ok) {
      alert('Product updated successfully!');
      router.push('/admin/dashboard/products');
    } else {
      alert('Failed to update product');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant="h5">Edit Product</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        fullWidth
        margin="normal"
        type="number"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProduct;
