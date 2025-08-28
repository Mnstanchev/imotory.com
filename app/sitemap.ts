import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imotory.com';
  const lastModified = new Date();
  
  // Static pages with proper priorities and frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search-map`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/concierge`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-preferences`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Try to fetch listings from the backend
  let listingRoutes: MetadataRoute.Sitemap = [];
  let agentRoutes: MetadataRoute.Sitemap = [];
  
  try {
    // Try multiple backend URLs in order of preference
    const backendUrls = [
      // Primary backend URL - admin.imotory.com
      'https://admin.imotory.com',
      // Environment variable override
      process.env.NEXT_PUBLIC_BACKEND_URL,
      // Internal network URL (for Docker-to-Docker communication)
      process.env.INTERNAL_BACKEND_URL,
      // Development fallback
      'http://localhost:3000'
    ].filter(Boolean);

    let listings: any[] = [];
    let fetchSuccessful = false;

    for (const backendUrl of backendUrls) {
      try {
        const apiUrl = backendUrl!.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
        
        console.log('Attempting to fetch listings for sitemap from:', `${apiUrl}/listings?limit=10000`);
        
        const response = await fetch(`${apiUrl}/listings?limit=10000`, {
          headers: {
            'User-Agent': 'Imotory-Sitemap-Generator',
            'Accept': 'application/json',
          },
          // Add timeout and SSL handling
          signal: AbortSignal.timeout(8000), // 8 second timeout
          // In development, ignore SSL certificate errors
          ...(process.env.NODE_ENV === 'development' && {
            // @ts-ignore - Node.js specific option
            agent: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          listings = data.data?.listings || data.listings || [];
          
          console.log(`✅ Successfully fetched ${listings.length} listings from ${apiUrl}`);
          fetchSuccessful = true;
          break; // Success! Exit the loop
        } else {
          console.warn(`❌ Failed to fetch from ${apiUrl}: ${response.status} ${response.statusText}`);
        }
      } catch (fetchError) {
        console.warn(`❌ Error fetching from ${backendUrl}:`, fetchError instanceof Error ? fetchError.message : fetchError);
        continue; // Try next URL
      }
    }

    if (fetchSuccessful && listings.length > 0) {
      // Generate listing routes
      listingRoutes = listings.map((listing: any) => ({
        url: `${baseUrl}/listings/${listing.slug}`,
        lastModified: new Date(listing.updatedAt || listing.createdAt || lastModified),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      // Generate unique agent routes
      const uniqueAgents = listings
        .filter((listing: any) => listing.agent?.id)
        .map((listing: any) => listing.agent)
        .filter((agent: any, index: number, self: any[]) => 
          self.findIndex((a: any) => a.id === agent.id) === index
        );

      agentRoutes = uniqueAgents.map((agent: any) => ({
        url: `${baseUrl}/agents/${agent.id}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      
      console.log(`✅ Generated ${listingRoutes.length} listing routes and ${agentRoutes.length} agent routes for sitemap`);
    } else {
      console.warn('⚠️  No listings fetched for sitemap - using static pages only');
    }
  } catch (error) {
    console.error('❌ Critical error in sitemap generation:', error);
  }

  return [...staticRoutes, ...listingRoutes, ...agentRoutes];
}