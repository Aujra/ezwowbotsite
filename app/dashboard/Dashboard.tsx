'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cart from './Cart';
import LicenseKeys from './LicenseKeys';
import Profile from './Profile';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDrawerOpen] = useState(true);
  const searchParams = useSearchParams();

  const handleViewChange = (viewIndex: number) => {
    setSelectedTab(viewIndex);
  };

  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'license-keys') {
      setSelectedTab(1);
    }
  }, [searchParams]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#3f51b5',
            color: 'white',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <List>
          <ListItem
            component={'button'}
            sx={{
              backgroundColor: selectedTab === 0 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
            onClick={() => handleViewChange(0)}
          >
            <ListItemText primary="Profile" />
          </ListItem>

          <Divider />

          <ListItem
            component={'button'}
            sx={{
              backgroundColor: selectedTab === 1 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
            onClick={() => handleViewChange(1)}
          >
            <ListItemText primary="License Keys" />
          </ListItem>

          <Divider />

          <ListItem
            component={'button'}
            sx={{
              backgroundColor: selectedTab === 2 ? '#2c387e' : 'transparent',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
            onClick={() => handleViewChange(2)}
          >
            <ListItemText primary="Cart" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        {selectedTab === 0 && <Profile />}
        {selectedTab === 1 && <LicenseKeys />}
        {selectedTab === 2 && <Cart />}
      </Box>
    </Box>
  );
}
