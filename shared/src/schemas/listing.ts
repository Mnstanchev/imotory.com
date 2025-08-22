/**
 * Property listing validation schemas
 */
import { z } from 'zod';
import { MultilingualTextSchema, LocationSchema, CurrencySchema, ImageSchema } from './common';

/**
 * Schema for property types
 */
export const PropertyTypeSchema = z.enum([
  'house',
  'apartment', 
  'villa',
  'office',
  'commercial',
  'land'
]);

/**
 * Schema for listing status
 */
export const ListingStatusSchema = z.enum([
  'active',
  'pending',
  'sold',
  'rented',
  'inactive'
]);

/**
 * Schema for property features
 */
export const PropertyFeatureSchema = z.enum([
  'balcony',
  'garden',
  'parking',
  'pool',
  'elevator',
  'air_conditioning',
  'heating',
  'security_system',
  'internet',
  'furnished',
  'pets_allowed'
]);

/**
 * Schema for property specifications
 */
export const PropertySpecsSchema = z.object({
  bedrooms: z.number().int().nonnegative('Bedrooms must be a non-negative integer'),
  bathrooms: z.number().int().nonnegative('Bathrooms must be a non-negative integer'),
  size: z.number().positive('Size must be a positive number'),
  yearBuilt: z.number().int().positive('Year built must be a positive integer').optional(),
  floors: z.number().int().positive('Floors must be a positive integer').optional(),
  floor: z.number().int().positive('Floor must be a positive integer').optional(),
  hasGarage: z.boolean(),
  parkingSpaces: z.number().int().nonnegative('Parking spaces must be a non-negative integer').optional(),
  energyRating: z.string().min(1).max(2).optional(),
  constructionType: z.string().min(1).max(50).optional(),
});

/**
 * Schema for listing filters
 */
export const ListingFiltersSchema = z.object({
  type: PropertyTypeSchema.optional(),
  status: ListingStatusSchema.optional(),
  minPrice: z.number().positive('Minimum price must be positive').optional(),
  maxPrice: z.number().positive('Maximum price must be positive').optional(),
  minSize: z.number().positive('Minimum size must be positive').optional(),
  maxSize: z.number().positive('Maximum size must be positive').optional(),
  minBedrooms: z.number().int().nonnegative('Minimum bedrooms must be non-negative').optional(),
  maxBedrooms: z.number().int().nonnegative('Maximum bedrooms must be non-negative').optional(),
  minBathrooms: z.number().int().nonnegative('Minimum bathrooms must be non-negative').optional(),
  features: z.array(PropertyFeatureSchema).optional(),
  city: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  isFeatured: z.boolean().optional(),
  agentId: z.string().uuid('Invalid agent ID format').optional(),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['minPrice'],
  }
).refine(
  (data) => {
    if (data.minSize !== undefined && data.maxSize !== undefined) {
      return data.minSize <= data.maxSize;
    }
    return true;
  },
  {
    message: 'Minimum size must be less than or equal to maximum size',
    path: ['minSize'],
  }
).refine(
  (data) => {
    if (data.minBedrooms !== undefined && data.maxBedrooms !== undefined) {
      return data.minBedrooms <= data.maxBedrooms;
    }
    return true;
  },
  {
    message: 'Minimum bedrooms must be less than or equal to maximum bedrooms',
    path: ['minBedrooms'],
  }
);

/**
 * Schema for listing sort options
 */
export const ListingSortOptionSchema = z.enum([
  'price_asc',
  'price_desc',
  'date_asc',
  'date_desc',
  'size_asc',
  'size_desc',
  'views_desc',
  'featured_first'
]);

/**
 * Schema for creating new listings
 */
export const CreateListingInputSchema = z.object({
  title: MultilingualTextSchema,
  description: MultilingualTextSchema,
  shortDescription: MultilingualTextSchema,
  price: z.number().positive('Price must be positive'),
  currency: CurrencySchema,
  type: PropertyTypeSchema,
  specifications: PropertySpecsSchema,
  features: z.array(PropertyFeatureSchema).min(1, 'At least one feature is required'),
  location: LocationSchema,
  agentId: z.string().uuid('Invalid agent ID format'),
  images: z.array(ImageSchema).min(1, 'At least one image is required').max(20, 'Maximum 20 images allowed'),
  metaTitle: MultilingualTextSchema.optional(),
  metaDescription: MultilingualTextSchema.optional(),
});

/**
 * Schema for updating existing listings
 */
export const UpdateListingInputSchema = CreateListingInputSchema.partial();

/**
 * Schema for complete listing objects
 */
export const ListingSchema = z.object({
  id: z.string().uuid('Invalid listing ID format'),
  slug: z.string().min(1, 'Slug is required'),
  title: MultilingualTextSchema,
  description: MultilingualTextSchema,
  shortDescription: MultilingualTextSchema,
  price: z.number().positive('Price must be positive'),
  currency: CurrencySchema,
  type: PropertyTypeSchema,
  status: ListingStatusSchema,
  specifications: PropertySpecsSchema,
  features: z.array(PropertyFeatureSchema),
  location: LocationSchema,
  images: z.array(ImageSchema).min(1, 'At least one image is required'),
  agentId: z.string().uuid('Invalid agent ID format'),
  createdAt: z.date(),
  updatedAt: z.date(),
  viewCount: z.number().int().nonnegative('View count must be non-negative'),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  metaTitle: MultilingualTextSchema.optional(),
  metaDescription: MultilingualTextSchema.optional(),
});

