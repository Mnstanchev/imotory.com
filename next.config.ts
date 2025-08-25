import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable transpilation of shared package
  transpilePackages: ['@property-website/shared'],
  
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
            value: 'public, max-age=3600, s-maxage=3600',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
