import { MetadataRoute } from 'next';
import { getListings } from '../lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imotory.com';
  
  try {
    // Fetch all listings from the database
    const listings = await getListings({ limit: 10000 }); // Get all listings
    
    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/concierge`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/search-map`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },

      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/cookie-preferences`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
    ];

    // Dynamic listing pages
    const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
      url: `${baseUrl}/listings/${listing.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Agent pages (if you have agent data)
    const agentRoutes: MetadataRoute.Sitemap = listings
      .filter((listing) => listing.agent?.id)
      .map((listing) => listing.agent!)
      .filter((agent, index, self) => 
        // Remove duplicates
        self.findIndex((a) => a.id === agent.id) === index
      )
      .map((agent) => ({
        url: `${baseUrl}/agents/${agent.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    return [...staticRoutes, ...listingRoutes, ...agentRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with just static pages
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/concierge`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/search-map`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },

      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/cookie-preferences`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
    ];
  }
}
