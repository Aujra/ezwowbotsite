'use client';

import './globals.css';
import { ThemeProvider, CssBaseline, createMuiTheme } from '@mui/material';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const font = "'Poppins', sans-serif";
  const theme = createMuiTheme({
    typography: {
      fontFamily: font,
    },
  });
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
