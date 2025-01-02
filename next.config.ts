import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // Ensure the app directory routing is enabled
  },
};

export default nextConfig;
