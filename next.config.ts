import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for deployment
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  
  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
