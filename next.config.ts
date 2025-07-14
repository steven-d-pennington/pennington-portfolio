import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next.js configuration for Cloudflare Pages
  // Let @cloudflare/next-on-pages handle the output transformation
  
  // Ensure proper static file handling
  trailingSlash: false,
  
  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
