import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add alias for shared folder
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../shared'),
    };

    // Ensure shared folder is treated as external module for proper resolution
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/.next'],
    };

    return config;
  },
  
  // Enable transpilation of shared folder
  transpilePackages: [],
  
  // Experimental features for better monorepo support
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
