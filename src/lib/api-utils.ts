import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function createResponse<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  }, { 
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  })
}

export function createErrorResponse(
  error: string,
  status = 400,
  message?: string
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error,
    message
  }, { 
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  })
}

export function handleValidationError(error: ZodError): NextResponse<ApiResponse> {
  return createErrorResponse(
    'Validation failed',
    400,
    error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  )
}

export function handleDatabaseError(error: Error): NextResponse<ApiResponse> {
  
  
  if (error.message.includes('Unique constraint')) {
    return createErrorResponse('Duplicate entry', 409)
  }
  
  if (error.message.includes('Foreign key constraint')) {
    return createErrorResponse('Invalid reference', 400)
  }
  
  return createErrorResponse('Database operation failed', 500)
}

export function parseQueryParams(searchParams: URLSearchParams) {
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: Math.min(parseInt(searchParams.get('limit') || '10'), 100),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    search: searchParams.get('search') || undefined,
    filters: Object.fromEntries(searchParams.entries())
  }
}

export function buildWhereClause(filters: Record<string, string>) {
  const where: Record<string, any> = {}
  
  if (filters.propertyType) {
    where.propertyType = filters.propertyType
  }
  
  if (filters.listingType) {
    where.listingType = filters.listingType
  }
  
  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }
  
  if (filters.agentId) {
    where.agentId = filters.agentId
  }
  
  if (filters.locationId) {
    where.locationId = filters.locationId
  }
  
  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice)
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice)
  }
  
  if (filters.minBedrooms || filters.maxBedrooms) {
    where.bedrooms = {}
    if (filters.minBedrooms) where.bedrooms.gte = parseInt(filters.minBedrooms)
    if (filters.maxBedrooms) where.bedrooms.lte = parseInt(filters.maxBedrooms)
  }
  
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === 'true'
  }
  
  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured === 'true'
  }
  
  return where
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatMultilingualContent(content: any, language = 'en') {
  if (typeof content === 'object' && content !== null) {
    return content[language] || content['en'] || Object.values(content)[0]
  }
  return content
}

export function handleError(error: unknown): NextResponse<ApiResponse> {
  
  
  if (error instanceof ZodError) {
    return handleValidationError(error)
  }
  
  if (error instanceof Error) {
    // Check for database errors
    if (error.message.includes('prisma') || error.message.includes('database')) {
      return handleDatabaseError(error)
    }
    
    return createErrorResponse(error.message, 500)
  }
  
  return createErrorResponse('An unexpected error occurred', 500)
}