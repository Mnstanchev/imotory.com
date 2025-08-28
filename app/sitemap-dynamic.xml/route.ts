import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://imotory.com';
  const lastModified = new Date().toISOString();
  
  // For now, we'll create a static sitemap that can be extended later
  const urls = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: '1.0',
    },
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'daily',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/search-map`,
      lastModified,
      changeFrequency: 'daily',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/concierge`,
      lastModified,
      changeFrequency: 'weekly',
      priority: '0.8',
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: '0.8',
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: '0.7',
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: '0.3',
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: '0.3',
    },
    {
      url: `${baseUrl}/cookie-preferences`,
      lastModified,
      changeFrequency: 'yearly',
      priority: '0.2',
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastModified, changeFrequency, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
