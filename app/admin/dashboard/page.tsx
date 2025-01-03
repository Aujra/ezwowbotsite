// /app/admin/dashboard/page.tsx (Admin Dashboard)

'use client';

import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch statistics for the dashboard
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/users/count'),
        fetch('/api/admin/orders/count'),
        fetch('/api/admin/products/count'),
      ]);

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setUsersCount(usersData.count);
      setOrdersCount(ordersData.count);
      setProductsCount(productsData.count);
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{usersCount}</Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin/users')}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">{ordersCount}</Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin/orders')}
            >
              Manage Orders
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">{productsCount}</Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin/products')}
            >
              Manage Products
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
