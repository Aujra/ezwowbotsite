// app/dashboard/Profile.tsx
import { Box, Typography, Button } from '@mui/material';

export default function Profile() {
  const handleChangePassword = () => {
    // Logic to handle password change
    alert('Change password functionality');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography variant="body1">
        Update your password and personal details.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleChangePassword}>
          Change Password
        </Button>
      </Box>
    </Box>
  );
}
