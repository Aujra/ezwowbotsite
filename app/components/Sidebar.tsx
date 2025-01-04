'use client';

import MenuIcon from '@mui/icons-material/Menu'; // Mobile menu icon
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useState } from 'react';

const Sidebar = ({ selectedTab, handleViewChange, handleGoToAdmin }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Manage drawer state in Sidebar

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen); // Toggle the drawer open/close
  };

  return (
    <Box sx={{ display: 'flex', width: { xs: 0, lg: 240 } }}>
      {/* Hamburger menu button for mobile */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: 'flex', sm: 'none' }, // Visible on mobile only
          zIndex: 9999,
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer (Permanent on Desktop) */}
      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            backgroundColor: '#3f51b5',
            color: 'white',
            width: 240, // Drawer width for desktop
            display: 'flex', // Ensure it stays on mobile too
          },
        }}
        variant="persistent" // Permanent on desktop
        anchor="left"
        open={isDrawerOpen} // Controls visibility on mobile
        onClose={handleDrawerToggle} // Ensure it can be closed on mobile
      >
        <List>
          <ListItem
            key={1}
            component="button"
            onClick={() => handleViewChange(0)}
            sx={{
              backgroundColor: selectedTab === 0 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
          >
            <ListItemText primary="Profile" />
          </ListItem>

          <Divider />

          <ListItem
            key={2}
            component="button"
            onClick={() => handleViewChange(1)}
            sx={{
              backgroundColor: selectedTab === 1 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
          >
            <ListItemText primary="License Keys" />
          </ListItem>

          <Divider />

          <ListItem
            key={3}
            component="button"
            onClick={() => handleViewChange(2)}
            sx={{
              backgroundColor: selectedTab === 2 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
          >
            <ListItemText primary="Cart" />
          </ListItem>

          <ListItem key={4} component="button" onClick={handleGoToAdmin}>
            <ListItemText primary="Go to Admin Dashboard" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
