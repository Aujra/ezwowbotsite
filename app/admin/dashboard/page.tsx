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
import UserDetails from '../users/UserDetails'; // Import User Details view
import UserList from '../users/UserList'; // Import User List view

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('users'); // Default view
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // User ID for User Details view
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
          <ListItem
            component={'button'}
            onClick={() => handleViewChange('users')}
          >
            <ListItemText primary="User Management" />
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
      </Box>
    </Box>
  );
};

export default AdminDashboard;
