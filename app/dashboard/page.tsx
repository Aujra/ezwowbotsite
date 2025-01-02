'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Button,
} from '@mui/material';
import { useState } from 'react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0); // Track the selected view (0: Profile, 1: License Keys)
  const [isDrawerOpen] = useState(true); // Manage drawer open/close state

  // Handle switching between tabs
  const handleViewChange = (viewIndex: number) => {
    setSelectedTab(viewIndex);
  };

  // Render Profile content
  const renderProfile = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography variant="body1">
        Update your password and personal details.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => alert('Change password functionality')}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );

  // Render License Keys content
  const renderLicenseKeys = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">License Keys</Typography>
      <Typography variant="body1">
        View and manage your license keys here.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => alert('View your license keys')}
        >
          View Keys
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar (Drawer) */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#3f51b5', // Sidebar color
            color: 'white',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <List>
          {/* Profile Button */}
          <ListItem
            component={'button'}
            sx={{
              backgroundColor: selectedTab === 0 ? '#2c387e' : 'transparent', // Active state color
              '&:hover': { backgroundColor: '#2c387e' }, // Hover effect
            }}
            onClick={() => handleViewChange(0)}
          >
            <ListItemText primary="Profile" />
          </ListItem>

          <Divider />

          {/* License Keys Button */}
          <ListItem
            component={'button'}
            sx={{
              backgroundColor: selectedTab === 1 ? '#2c387e' : 'transparent', // Active state color
              '&:hover': { backgroundColor: '#2c387e' }, // Hover effect
            }}
            onClick={() => handleViewChange(1)}
          >
            <ListItemText primary="License Keys" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        {/* Render content based on selected tab */}
        {selectedTab === 0 && renderProfile()}
        {selectedTab === 1 && renderLicenseKeys()}
      </Box>
    </Box>
  );
}
