'use client';

import {
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';

const LicenseKeys = () => {
  const [licenseKeys, setLicenseKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Fetch license keys when the component is mounted
    fetchLicenseKeys();
  }, []);

  const fetchLicenseKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/licenses'); // Fetch license keys from the API
      const data = await res.json();
      if (res.ok) {
        setLicenseKeys(data.licenses);
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Error fetching license keys',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching license keys:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching license keys',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    // Add the new key to the cart (this could be an API call or logic to add it)
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: 'license', quantity: 1 }), // Assuming you're adding a license
      });

      if (res.ok) {
        await res.json();
        setSnackbar({
          open: true,
          message: 'Key added to cart! Proceed to checkout.',
          severity: 'success',
        });

        // Now redirect to the checkout page or open Stripe checkout modal
        window.location.href = '/checkout'; // Assuming you have a checkout route set up
      } else {
        const { message } = await res.json();
        setSnackbar({
          open: true,
          message: message || 'Error adding key to cart',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding key to cart:', error);
      setSnackbar({
        open: true,
        message: 'Error adding key to cart',
        severity: 'error',
      });
    }
  };

  const handleRenewKey = async (keyId: number) => {
    // Add renewal product to cart (sending key ID to know we're renewing an existing key)
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: 'renewal',
          licenseId: keyId,
          quantity: 1,
        }), // Pass the key ID for renewal
      });

      if (res.ok) {
        await res.json();
        setSnackbar({
          open: true,
          message: 'Key renewal added to cart! Proceed to checkout.',
          severity: 'success',
        });

        // Redirect to checkout for payment
        window.location.href = '/checkout'; // Assuming you have a checkout route set up
      } else {
        const { message } = await res.json();
        setSnackbar({
          open: true,
          message: message || 'Error adding renewal to cart',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding renewal to cart:', error);
      setSnackbar({
        open: true,
        message: 'Error adding renewal to cart',
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
        width: '100%',
        margin: 'auto',
        padding: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        License Keys
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        {loading ? (
          <CircularProgress />
        ) : licenseKeys.length === 0 ? (
          <Typography variant="body1" align="center">
            No license keys available
          </Typography>
        ) : (
          licenseKeys.map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key.id}>
              <Card
                sx={{
                  minWidth: 275,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    License Key: {key.key}
                  </Typography>
                  <Typography color="text.secondary">
                    Expires at: {new Date(key.expiresAt).toLocaleString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Status: {key.expiresAt < new Date() ? 'Expired' : 'Active'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleRenewKey(key.id)}
                  >
                    Renew Key
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAddKey}>
          Add New Key
        </Button>
      </Box>

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

export default LicenseKeys;
