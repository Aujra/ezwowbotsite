'use client';

import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { authenticator } from 'otplib'; // Import otplib for generating 2FA secrets
import { QRCodeSVG } from 'qrcode.react'; // QR Code generator
import { useState, useEffect } from 'react';

export default function Enable2FA() {
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Function to generate TOTP secret and QR code
  const generate2FASecret = () => {
    const generatedSecret = authenticator.generateSecret();
    setSecret(generatedSecret);

    // Assume we fetch the user email from the session or JWT
    const userEmail = 'user@example.com'; // Replace with real email from session or JWT
    setUserEmail(userEmail);
  };

  // Function to verify the 2FA code entered by the user
  const verify2FACode = () => {
    if (!secret || !authenticator.verify({ token: code, secret })) {
      setSnackbar({
        open: true,
        message: 'Invalid 2FA code',
        severity: 'error',
      });
    } else {
      // If valid, proceed to save the secret for the user (store it in the database)
      save2FASecret(secret);
    }
  };

  // Function to save the 2FA secret in the database
  const save2FASecret = async (generatedSecret: string) => {
    const res = await fetch('/api/admin/save-2fa-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twoFactorSecret: generatedSecret }),
    });

    if (res.ok) {
      setSnackbar({
        open: true,
        message: '2FA setup successful!',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error saving 2FA secret. Please try again.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    generate2FASecret(); // Generate the 2FA secret when the page loads
  }, []);

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
        Enable 2FA
      </Typography>

      {!userEmail || !secret ? (
        <Typography variant="body1" align="center">
          Generating QR code...
        </Typography>
      ) : (
        <>
          <Typography variant="body1" align="center" gutterBottom>
            Scan the QR code below using your 2FA app (e.g., Google
            Authenticator), then enter the generated code to complete the setup.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <QRCodeSVG
              value={`otpauth://totp/ezwowbot:${userEmail}?secret=${secret}&issuer=ezwowbot`}
              size={256}
            />
          </Box>

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
        </>
      )}

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
