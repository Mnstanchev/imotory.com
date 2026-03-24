import { z } from 'zod'
import { createErrorResponse } from './api-utils'

export function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: ReturnType<typeof createErrorResponse> } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: createErrorResponse(
          'Validation failed',
          400,
          error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        )
      }
    }
    return { 
      success: false, 
      error: createErrorResponse('Invalid request data', 400)
    }
  }
}

export const listingQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'price', 'viewCount', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  
  // Filters
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'STUDIO', 'OFFICE', 'COMMERCIAL', 'LAND']).optional(),
  listingType: z.enum(['SALE', 'RENT']).optional(),
  categoryId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minBedrooms: z.coerce.number().int().positive().optional(),
  maxBedrooms: z.coerce.number().int().positive().optional(),
  isActive: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
})

export const createListingSchema = z.object({
  title: z.object({
    en: z.string().min(1).max(200),
    bg: z.string().min(1).max(200).optional(),
    ru: z.string().min(1).max(200).optional(),
  }),
  description: z.object({
    en: z.string().min(1).max(5000),
    bg: z.string().min(1).max(5000).optional(),
    ru: z.string().min(1).max(5000).optional(),
  }),
  price: z.coerce.number().positive(),
  currency: z.string().default('EUR'),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'STUDIO', 'OFFICE', 'COMMERCIAL', 'LAND']),
  listingType: z.enum(['SALE', 'RENT']),
  categoryId: z.string().uuid(),
  agentId: z.string().uuid(),
  locationId: z.string().uuid(),
  bedrooms: z.coerce.number().int().positive().optional(),
  bathrooms: z.coerce.number().int().positive().optional(),
  size: z.coerce.number().int().positive().optional(),
  floor: z.coerce.number().int().positive().optional(),
  totalFloors: z.coerce.number().int().positive().optional(),
  yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
})

export const updateListingSchema = createListingSchema.partial().extend({
  title: z.object({
    en: z.string().min(1).max(200),
    bg: z.string().min(1).max(200).optional(),
    ru: z.string().min(1).max(200).optional(),
  }).optional(),
  description: z.object({
    en: z.string().min(1).max(5000),
    bg: z.string().min(1).max(5000).optional(),
    ru: z.string().min(1).max(5000).optional(),
  }).optional(),
})

// Agents validation schemas
export const createAgentSchema = z.object({
  name: z.object({
    en: z.string().min(1).max(100),
    bg: z.string().min(1).max(100).optional(),
    ru: z.string().min(1).max(100).optional(),
  }),
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  bio: z.object({
    en: z.string().min(1).max(2000),
    bg: z.string().min(1).max(2000).optional(),
    ru: z.string().min(1).max(2000).optional(),
  }).optional(),
  avatar: z.string().refine(
    (val) => !val || val.startsWith('/') || val.startsWith('http'),
    { message: 'Avatar must be a valid URL or relative path starting with /' }
  ).optional(),
  socialLinks: z.object({
    website: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
  isActive: z.boolean().default(true),
})

export const updateAgentSchema = createAgentSchema.partial()

// Categories validation schemas
export const createCategorySchema = z.object({
  name: z.object({
    en: z.string().min(1).max(100),
    bg: z.string().min(1).max(100).optional(),
    ru: z.string().min(1).max(100).optional(),
  }),
  slug: z.string().min(1).max(100),
  description: z.object({
    en: z.string().min(1).max(1000).optional(),
    bg: z.string().min(1).max(1000).optional(),
    ru: z.string().min(1).max(1000).optional(),
  }).optional(),
  icon: z.string().url().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

// Locations validation schemas
export const createLocationSchema = z.object({
  name: z.object({
    en: z.string().min(1).max(100),
    bg: z.string().min(1).max(100).optional(),
    ru: z.string().min(1).max(100).optional(),
  }),
  slug: z.string().min(1).max(100),
  type: z.enum(['COUNTRY', 'REGION', 'CITY', 'NEIGHBORHOOD']),
  parentId: z.string().uuid().optional().nullable(),
})

export const updateLocationSchema = createLocationSchema.partial()

// Query schemas
export const agentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
})

export const categoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
})

export const locationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.enum(['COUNTRY', 'REGION', 'CITY', 'NEIGHBORHOOD']).optional(),
  parentId: z.string().uuid().optional(),
  search: z.string().optional(),
})