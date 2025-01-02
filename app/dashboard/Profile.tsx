'use client';

import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useState } from 'react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For handling the loading state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleUpdateProfile = async () => {
    setLoading(true); // Show loading spinner

    const updatedFields: { name?: string; email?: string; password?: string } =
      {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    setLoading(false); // Hide loading spinner after request is finished

    if (res.ok) {
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } else {
      const { message } = await res.json();
      setSnackbar({
        open: true,
        message: message || 'Error updating profile. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        width: '100%', // Full width
        margin: 'auto',
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Update Profile
      </Typography>

      {/* Grid layout for all fields in one row */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleUpdateProfile}
        sx={{ mt: 2 }}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Update Profile'
        )}
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
