export async function GET() {
  const baseUrl = 'https://imotory.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Important pages
Allow: /
Allow: /about
Allow: /contact
Allow: /concierge
Allow: /search
Allow: /search-map
Allow: /listings
Allow: /listings/*
Allow: /agents/*

# Legal pages
Allow: /privacy
Allow: /terms
Allow: /cookie-preferences

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}
