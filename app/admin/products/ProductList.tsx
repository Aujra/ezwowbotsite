// /app/admin/products/ProductList.tsx

'use client';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId: number) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    );
    if (confirmDelete) {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        alert('Failed to delete the product.');
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEdit(product.id)}
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  variant="outlined"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
