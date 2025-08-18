import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable transpilation of shared package
  transpilePackages: ['@property-website/shared'],
  
  // Experimental features for better monorepo support
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
