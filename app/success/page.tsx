'use client';

import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentSuccess = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        'session_id',
      );

      if (!sessionId) {
        setMessage('Session ID not found.');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/stripe/success?session_id=${sessionId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('Payment successful!');
        setLicenseKey(data.licenseKey); // Display the generated license key
        // Redirect to License Keys section of the dashboard
        router.push('/dashboard?section=license-keys');
      } else {
        setError(data.message || 'An error occurred.');
        router.push('/dashboard'); // Redirect back to Dashboard
      }

      setLoading(false);
    };

    fetchPaymentSuccess();
  }, [router]);

  const handleCloseSnackbar = () => {
    setError(''); // Clear the error
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h5">{message}</Typography>
          {licenseKey && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Your License Key:</Typography>
              <Typography variant="body1">{licenseKey}</Typography>
            </Box>
          )}
          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity="error">
                {error}
              </Alert>
            </Snackbar>
          )}
        </>
      )}
    </Box>
  );
}
