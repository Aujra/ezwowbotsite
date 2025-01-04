// /app/admin/dashboard/page.tsx

'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useState } from 'react';
import CreateProduct from '../products/CreateProduct'; // Import Create Product view
import ProductList from '../products/ProductList'; // Import Product List view
import UserDetails from '../users/UserDetails'; // Import User Details view
import UserList from '../users/UserList'; // Import User List view

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('users'); // Default view
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // User ID for User Details view
  const [selectedProductView, setSelectedProductView] = useState('list'); // To track if we're viewing list or creating/editing product
  const router = useRouter(); // Use Next.js router for navigation

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setSelectedUserId(null); // Reset user ID when switching views
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId); // Set selected user for viewing details
    setSelectedView('userDetails'); // Switch to the user details view
  };

  const handleBackToUserDashboard = () => {
    router.push('/dashboard'); // Navigate to the user dashboard
  };

  const handleCreateProductClick = () => {
    setSelectedProductView('create'); // Switch to the product creation view
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {/* User Management Link */}
          <ListItem
            component={'button'}
            onClick={() => handleViewChange('users')}
          >
            <ListItemText primary="User Management" />
          </ListItem>

          {/* Product Management Link */}
          <ListItem
            component={'button'}
            onClick={() => handleViewChange('products')}
          >
            <ListItemText primary="Product Management" />
          </ListItem>

          {/* Add a Link to Create Product */}
          <ListItem component={'button'} onClick={handleCreateProductClick}>
            <ListItemText primary="Create Product" />
          </ListItem>

          {/* Add more options here */}

          {/* Back to User Dashboard */}
          <Divider sx={{ my: 2 }} />
          <ListItem component={'button'} onClick={handleBackToUserDashboard}>
            <ListItemText primary="Back to User Dashboard" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', padding: 2 }}
      >
        {selectedView === 'users' && (
          <UserList onUserSelect={handleUserSelect} />
        )}
        {selectedView === 'userDetails' && selectedUserId && (
          <UserDetails userId={selectedUserId} />
        )}
        {selectedView === 'products' && (
          <ProductList /> // Render Product List here
        )}
        {selectedProductView === 'create' && <CreateProduct />}{' '}
        {/* Render Create Product Form */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
