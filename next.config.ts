import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable transpilation of shared package
  transpilePackages: ['@property-website/shared'],
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Experimental features for better monorepo support
  experimental: {
    externalDir: true,
  },

  // Add metadata for better SEO
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://imotory.com',
  },

  // Redirect to sitemap
  async redirects() {
    return [
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },

  // Headers for sitemap caching
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
          },
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/sitemap-dynamic.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes
          },
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
    ];
  },
  
  // Configure webpack to avoid minification issues
  webpack: (config, { isServer, dev }) => {
    // Completely disable minification to avoid webpack plugin errors
    if (!dev) {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;
