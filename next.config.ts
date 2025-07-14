import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No output specified - let @cloudflare/next-on-pages handle it
  
  // Optional: Configure experimental features if needed
  experimental: {
    // Enable runtime edge functions for better Cloudflare compatibility
    // runtime: 'edge'
  },
};

export default nextConfig;
