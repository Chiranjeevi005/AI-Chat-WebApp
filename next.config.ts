import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  reactStrictMode: true,
  // Enable turbopack in development
  experimental: {
    // Disable reactCompiler due to compatibility issues
    reactCompiler: false,
  },
  // Configure trailing slash
  trailingSlash: false,
  // Configure output for Vercel deployment
  output: 'standalone',
  // Configure environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003',
  },
};

export default nextConfig;
