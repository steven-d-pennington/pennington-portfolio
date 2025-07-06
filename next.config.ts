import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Required for Cloudflare Pages static export
  trailingSlash: true, // Recommended for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
