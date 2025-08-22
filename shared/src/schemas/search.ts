/**
 * Zod schemas for search and filtering validation
 */

import { z } from 'zod';
import { PropertyTypeSchema, PropertyFeatureSchema } from './listing';
import { LocationSchema, PriceRangeSchema } from './common';

/**
 * Zod schema for price range validation
 */
export const SearchPriceRangeSchema = z.object({
  min: z.number().positive().min(0),
  max: z.number().positive().min(0)
}).refine(data => data.min <= data.max, {
  message: "Minimum price must be less than or equal to maximum price"
});

/**
 * Zod schema for size range validation
 */
export const SizeRangeSchema = z.object({
  min: z.number().positive().min(0),
  max: z.number().positive().min(0),
  unit: z.enum(['sqm', 'sqft', 'acre'])
}).refine(data => data.min <= data.max, {
  message: "Minimum size must be less than or equal to maximum size"
});

/**
 * Zod schema for year range validation
 */
export const YearRangeSchema = z.object({
  min: z.number().int().min(1800).max(new Date().getFullYear()),
  max: z.number().int().min(1800).max(new Date().getFullYear())
}).refine(data => data.min <= data.max, {
  message: "Minimum year must be less than or equal to maximum year"
});

/**
 * Zod schema for location-based search filters
 */
export const LocationFilterSchema = z.object({
  city: z.string().min(2).optional(),
  neighborhood: z.string().min(2).optional(),
  postalCode: z.string().regex(/^\d{4,6}$/).optional(),
  distance: z.number().positive().optional(), // kilometers
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }).optional()
});

/**
 * Zod schema for room count validation
 */
export const RoomCountSchema = z.object({
  min: z.number().int().min(0),
  max: z.number().int().min(0).optional()
}).refine(data => !data.max || data.min <= data.max, {
  message: "Minimum must be less than or equal to maximum"
});

/**
 * Zod schema for search filters validation
 */
export const SearchFiltersSchema = z.object({
  // Property characteristics
  type: PropertyTypeSchema.optional(),
  priceRange: PriceRangeSchema.optional(),
  sizeRange: SizeRangeSchema.optional(),
  yearRange: YearRangeSchema.optional(),
  bedrooms: RoomCountSchema.optional(),
  bathrooms: RoomCountSchema.optional(),
  
  // Features and amenities
  features: z.array(PropertyFeatureSchema).optional(),
  hasGarage: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  isFurnished: z.boolean().optional(),
  allowsPets: z.boolean().optional(),
  
  // Location
  location: LocationFilterSchema.optional(),
  
  // Listing metadata
  isFeatured: z.boolean().optional(),
  agentId: z.string().uuid().optional(),
  
  // Status
  status: z.enum(['active', 'pending', 'sold', 'rented']).optional()
});

/**
 * Zod schema for search sort options
 */
export const SearchSortOptionSchema = z.enum([
  'price_asc',
  'price_desc',
  'size_asc',
  'size_desc',
  'date_desc',
  'date_asc',
  'distance_asc',
  'featured_first',
  'popularity_desc'
]);

/**
 * Zod schema for pagination parameters
 */
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

/**
 * Zod schema for search query validation
 */
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(200).optional(),
  filters: SearchFiltersSchema,
  sort: SearchSortOptionSchema.default('featured_first'),
  pagination: PaginationParamsSchema
});

/**
 * Zod schema for search result item
 */
export const SearchResultSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  price: z.number().positive(),
  currency: z.string().length(3),
  type: PropertyTypeSchema,
  size: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  location: LocationSchema,
  images: z.array(z.string().url()),
  agentId: z.string().uuid(),
  isFeatured: z.boolean().default(false),
  distance: z.number().positive().optional(),
  relevanceScore: z.number().min(0).max(1).optional()
});

/**
 * Zod schema for search response
 */
export const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
});

/**
 * Zod schema for saved search
 */
export const SavedSearchSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  query: SearchQuerySchema,
  isActive: z.boolean().default(true),
  notificationEnabled: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

/**
 * Zod schema for search suggestions
 */
export const SearchSuggestionSchema = z.object({
  type: z.enum(['city', 'neighborhood', 'agent', 'property']),
  value: z.string().min(1),
  label: z.string().min(1),
  metadata: z.record(z.any()).optional()
});

