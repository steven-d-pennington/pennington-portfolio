import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for deployment
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  
  // External packages configuration
  serverExternalPackages: [],
};

export default nextConfig;
