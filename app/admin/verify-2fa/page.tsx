'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';

export default function Verify2FA() {
  const [code, setCode] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle 2FA code verification
  const verify2FACode = async () => {
    if (!code) {
      setSnackbar({
        open: true,
        message: 'Please enter the 2FA code',
        severity: 'error',
      });
      return;
    }

    // Call the API to verify the 2FA code
    const res = await fetch('/api/admin/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twoFactorCode: code }),
    });

    if (res.ok) {
      setSnackbar({
        open: true,
        message: '2FA verified successfully!',
        severity: 'success',
      });
      window.location.href = '/admin'; // Redirect to the admin page after successful verification
    } else {
      const { message } = await res.json();
      setSnackbar({
        open: true,
        message: message || 'Invalid 2FA code. Please try again.',
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
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Verify 2FA
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Enter the code from your 2FA app (e.g., Google Authenticator).
      </Typography>

      <TextField
        label="Enter 2FA Code"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ marginTop: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={verify2FACode}
        sx={{ marginTop: 2 }}
      >
        Verify 2FA Code
      </Button>

      {/* Snackbar for Feedback */}
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
}
