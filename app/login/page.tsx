'use client';

import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const router = useRouter();

  // Handle login
  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setSnackbar({
        open: true,
        message: 'Email and password are required',
        severity: 'error',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setSnackbar({
        open: true,
        message: 'Invalid email format',
        severity: 'error',
      });
      return;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      // Redirect to the dashboard after successful login
      router.push('/dashboard');
    } else {
      setSnackbar({
        open: true,
        message: 'Invalid credentials. Please try again.',
        severity: 'error',
      });
    }
  };

  // Handle signup
  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{3,}$/; // Password must be at least 3 characters long

    if (!emailRegex.test(email)) {
      setSnackbar({
        open: true,
        message: 'Invalid email format',
        severity: 'error',
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 3 characters long',
        severity: 'error',
      });
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      setSnackbar({
        open: true,
        message: 'Account created successfully!',
        severity: 'success',
      });
      setIsLogin(true);
    } else {
      const { message } = await res.json();
      setSnackbar({
        open: true,
        message: message || 'Error creating account. Please try again.',
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '90%',
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          {isLogin ? 'Login' : 'Create Account'}
        </Typography>
        {!isLogin && (
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={isLogin ? handleLogin : handleSignup}
          sx={{ mt: 2 }}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link
                  href="#"
                  onClick={() => setIsLogin(false)}
                  sx={{ cursor: 'pointer' }}
                >
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  href="#"
                  onClick={() => setIsLogin(true)}
                  sx={{ cursor: 'pointer' }}
                >
                  Log in
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Box>

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
