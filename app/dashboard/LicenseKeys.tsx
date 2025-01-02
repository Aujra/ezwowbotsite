import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface License {
  key: string;
  expiresAt: string;
}

export default function LicenseKeys() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's license keys
  const fetchLicenses = async () => {
    try {
      const res = await fetch('/api/licenses');
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.licenses);
      } else {
        console.error('Failed to fetch licenses');
      }
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  // Handle the "Add New Key" button click
  const handleAddNewKey = async () => {
    try {
      const res = await fetch('/api/licenses', {
        method: 'POST',
        body: JSON.stringify({
          expiresAt: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ), // Set expiry date for 1 year from now
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('New license key created successfully.');
        fetchLicenses(); // Refresh the license list
      } else {
        alert('Failed to create a new key.');
      }
    } catch (error) {
      console.error('Error creating new key:', error);
      alert('Failed to create a new key.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Your License Keys</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {licenses.map((license) => (
            <ListItem key={license.key}>
              <Typography variant="body1">{license.key}</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                Expiration: {new Date(license.expiresAt).toLocaleDateString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" color="primary" onClick={handleAddNewKey}>
        Add New Key
      </Button>
    </Box>
  );
}
