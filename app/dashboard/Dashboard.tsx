'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './styles.css';
import Cart from './Cart';
import LicenseKeys from './LicenseKeys';
import Profile from './Profile';
import Sidebar from '../components/Sidebar'; // Import Sidebar as a component

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const router = useRouter();

  const handleViewChange = (viewIndex: number) => {
    setSelectedTab(viewIndex);
  };

  const handleGoToAdmin = () => {
    router.push('/admin/dashboard');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        selectedTab={selectedTab}
        handleViewChange={handleViewChange}
        handleGoToAdmin={handleGoToAdmin}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        {/* Render dynamic content based on selected tab */}
        {selectedTab === 0 && (
          <div>
            <Profile />
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <LicenseKeys />
          </div>
        )}
        {selectedTab === 2 && (
          <div>
            <Cart />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
