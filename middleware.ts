import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requestLogger } from './src/lib/middleware/request-logger';
import logger, { logError } from './src/lib/logger';

// Cache configuration based on content type
const cacheConfig = {
  // Static content (categories, locations, property types)
  static: {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
  },
  // Dynamic content (listings, agents)
  dynamic: {
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
  },
  // User-specific content (favorites, bookings)
  private: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  // Admin routes
  admin: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

// CORS configuration
const corsConfig = {
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://imotory.com',
    'https://www.imotory.com',
    'https://admin.imotory.com',
    'https://property-website.vercel.app',
    'https://property-website-backend-only.vercel.app',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Accept-Language'
  ],
  exposedHeaders: ['X-Total-Count'], // Headers we want to expose to the client
  maxAge: 86400 // 24 hours in seconds
};

// Security headers configuration
const securityHeaders = {
  // Prevent browsers from performing MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Protect against clickjacking
  'X-Frame-Options': 'DENY',
  // Enable browser XSS filtering
  'X-XSS-Protection': '1; mode=block',
  // Control browser features and APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Content Security Policy
  'Content-Security-Policy': process.env.NODE_ENV === 'development' 
    ? '' // Disable CSP in development
    : `
    default-src 'self' 'unsafe-inline' 'unsafe-eval';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.app https://*.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.vercel.app https://*.neon.tech https://*.imotory.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.vercel.app https://*.neon.tech https://*.imotory.com https://api.resend.com https://va.vercel-analytics.com ws: wss:;
    frame-src 'self';
    worker-src 'self' blob:;
  `.replace(/\s+/g, ' ').trim().replace(/# .*?;/g, ';')
};

// Route patterns for caching strategies
const staticRoutes = [
  '/api/categories',
  '/api/locations',
  '/api/property-types',
  '/api/listing-types'
];

const dynamicRoutes = [
  '/api/listings',
  '/api/agents'
];

const privateRoutes = [
  '/api/favorites',
  '/api/bookings',
  '/api/user'
];

const protectedRoutes = [
  '/admin',
  '/api/admin',
  '/api/listings',
  '/api/agents',
  '/api/categories',
  '/api/locations'
];

const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error'
];

// Helper function to apply cache headers based on route type
function applyCacheHeaders(request: NextRequest, response: NextResponse): void {
  const { pathname } = request.nextUrl;
  
  // Don't cache non-GET requests
  if (request.method !== 'GET') {
    Object.entries(cacheConfig.private).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return;
  }

  // Apply appropriate cache headers based on route type
  if (staticRoutes.some(route => pathname.startsWith(route))) {
    Object.entries(cacheConfig.static).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  } else if (dynamicRoutes.some(route => pathname.startsWith(route))) {
    Object.entries(cacheConfig.dynamic).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  } else if (privateRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/admin')) {
    Object.entries(cacheConfig.private).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
}

// Helper function to apply CORS headers
function applyCorsHeaders(request: NextRequest, response: NextResponse): void {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin && corsConfig.allowedOrigins.includes(origin);

  // Set CORS headers if origin is allowed or in development
  if (isAllowedOrigin || process.env.NODE_ENV === 'development') {
    // Always echo back the Origin when present (required when credentials are used)
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      // Allow credentials only when an Origin is present
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      // No Origin header (e.g., server-to-server). Wildcard is fine without credentials.
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    // Allowed methods
    response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
    
    // Allowed headers
    response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
    
    // Exposed headers
    response.headers.set('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
    
    // Max age for preflight requests
    response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
  }
}

export async function middleware(req: NextRequest) {
  try {
    const { nextUrl } = req;
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 204 });
      applyCorsHeaders(req, preflightResponse);
      return preflightResponse;
    }
    
    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      nextUrl.pathname.startsWith(route)
    );
    
    const isPublicRoute = publicRoutes.some(route => 
      nextUrl.pathname.startsWith(route)
    );

    // Allow public routes
    if (isPublicRoute) {
      const publicResponse = NextResponse.next();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        publicResponse.headers.set(key, value);
      });
      applyCorsHeaders(req, publicResponse);
      applyCacheHeaders(req, publicResponse);
      await requestLogger(req);
      return publicResponse;
    }

    // Allow API routes that are not protected
    const isApiRoute = nextUrl.pathname.startsWith('/api');
    if (isApiRoute && !isProtectedRoute) {
      const apiResponse = NextResponse.next();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        apiResponse.headers.set(key, value);
      });
      applyCorsHeaders(req, apiResponse);
      applyCacheHeaders(req, apiResponse);
      await requestLogger(req);
      return apiResponse;
    }

    // For now, allow all routes to avoid auth issues during development
    // TODO: Implement proper auth check for middleware
    const defaultResponse = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    defaultResponse.headers.set(key, value);
  });
  
  // Apply CORS and cache headers
  applyCorsHeaders(req, defaultResponse);
  applyCacheHeaders(req, defaultResponse);
  await requestLogger(req);

  return defaultResponse;
  } catch (error) {
    // Log any errors that occur during middleware processing
    logError(error instanceof Error ? error : new Error(String(error)), 'Middleware');
    
    // Return a generic error response
    const errorResponse = NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
    
    // Apply security headers even in error case
    Object.entries(securityHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    
    return errorResponse;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};