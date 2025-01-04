'use client';

import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique key

const UserDetails = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<any>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      setUser(data);

      // Fetch the user's keys
      const keysRes = await fetch(`/api/admin/users/${userId}/keys`);
      const keysData = await keysRes.json();
      setKeys(keysData);

      setLoading(false); // Set loading to false once data is fetched
    };

    fetchUser();
  }, [userId]);

  const handleCreateKey = async () => {
    const newKey = uuidv4(); // Generate a unique key using UUID
    const expirationDate = new Date(); // Set default expiration to current date

    const res = await fetch(`/api/admin/users/${userId}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: newKey, expiresAt: expirationDate }),
    });

    const createdKey = await res.json();
    setKeys((prevKeys) => [...prevKeys, createdKey]); // Add the newly created key to the list of keys
  };

  const handleUpdateKeyExpiration = async (
    keyId: number,
    newExpiration: Date,
  ) => {
    const res = await fetch(`/api/admin/users/${userId}/keys/${keyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresAt: newExpiration }),
    });

    const updatedKey = await res.json();
    setKeys((prevKeys) =>
      prevKeys.map((key) =>
        key.id === keyId ? { ...key, expiresAt: updatedKey.expiresAt } : key,
      ),
    );
  };

  const handleExpirationChange = (keyId: number, newExpiration: Date) => {
    setKeys((prevKeys) =>
      prevKeys.map((key) =>
        key.id === keyId
          ? { ...key, newExpiration } // Update only the selected key's expiration date
          : key,
      ),
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>; // Handle case where user data is missing
  }

  return (
    <Box>
      <h2>User Details</h2>
      <TextField
        label="Email"
        value={user.email || ''} // Handle undefined values
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        fullWidth
        margin="normal"
      />

      <Typography variant="h6" gutterBottom>
        License Keys
      </Typography>
      {keys.length === 0 ? (
        <Typography>No keys assigned</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {keys.map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key.id}>
              {' '}
              {/* Responsive grid items */}
              <Box
                sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Key:</strong> {key.key}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Expires At:</strong>{' '}
                  {new Date(key.expiresAt).toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Update expiration */}
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    label="New Expiration Date"
                    type="datetime-local"
                    value={key.newExpiration?.toISOString().slice(0, 16) || ''}
                    onChange={(e) =>
                      handleExpirationChange(key.id, new Date(e.target.value))
                    }
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleUpdateKeyExpiration(key.id, key.newExpiration)
                    }
                    sx={{ width: '100%' }}
                  >
                    Update Expiration
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Key */}
      <Box sx={{ mt: 3 }}>
        <Button
          onClick={handleCreateKey}
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
        >
          Create New Key for User
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
