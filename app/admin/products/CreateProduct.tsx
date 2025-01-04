// /app/admin/products/CreateProduct.tsx

import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<number[]>([]); // Array to hold selected tagIds
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateProduct = async () => {
    setLoading(true);
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image,
      tags, // Sending tags as an array of tag IDs
    };

    console.log('Submitting product data:', productData); // Log the data to check if it's correct

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData), // No creatorId needed here
    });

    if (res.ok) {
      alert('Product created successfully!');
      router.push('/admin/dashboard/products');
    } else {
      alert('Failed to create product.');
    }

    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Product
      </Typography>

      <TextField
        label="Product Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        label="Price"
        fullWidth
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        margin="normal"
        type="number"
      />
      <TextField
        label="Stock"
        fullWidth
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        margin="normal"
        type="number"
      />
      <TextField
        label="Image URL"
        fullWidth
        value={image}
        onChange={(e) => setImage(e.target.value)}
        margin="normal"
      />

      {/* FormControl for Tags (allow user to select multiple tags) */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={tags}
          onChange={(e) => setTags(e.target.value as number[])} // Handle multiple selection
          label="Tags"
        >
          {/* Example static tags, replace with dynamic tag list */}
          <MenuItem value={1}>License</MenuItem>
          <MenuItem value={2}>Rotation</MenuItem>
          <MenuItem value={3}>Combat</MenuItem>
          {/* Add more options as needed */}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateProduct}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Creating Product...' : 'Create Product'}
      </Button>
    </Box>
  );
};

export default CreateProduct;
