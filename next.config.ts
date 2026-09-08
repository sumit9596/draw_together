import type { NextConfig } from "next";

// Holds Next.js build and runtime configuration for the application.

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains:['lh3.googleusercontent.com']
  }
  /* config options here */
};

export default nextConfig;
