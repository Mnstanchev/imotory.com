import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Experimental features for better monorepo support
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
