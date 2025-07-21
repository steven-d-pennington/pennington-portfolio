import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for deployment
  trailingSlash: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // External packages configuration
  serverExternalPackages: [],
};

export default nextConfig;
