'use client';

import { Button, Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Welcome to MUI
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Container>
  );
}
