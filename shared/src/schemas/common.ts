/**
 * Common utility schemas for runtime validation
 */
import { z } from 'zod';

/**
 * Schema for supported language codes
 */
export const LanguageSchema = z.enum(['en', 'bg', 'ru']);

/**
 * Schema for multilingual text validation
 */
export const MultilingualTextSchema = z.object({
  en: z.string().min(1, 'English translation is required'),
  bg: z.string().min(1, 'Bulgarian translation is required'),
  ru: z.string().min(1, 'Russian translation is required'),
});

/**
 * Schema for geographic coordinates
 */
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

/**
 * Schema for detailed location information
 */
export const LocationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  neighborhood: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  coordinates: CoordinatesSchema,
  localizedNames: MultilingualTextSchema,
});

/**
 * Schema for API error structure
 */
export const ApiErrorSchema = z.object({
  code: z.string().min(1, 'Error code is required'),
  message: z.string().min(1, 'Error message is required'),
  field: z.string().optional(),
});

/**
 * Schema for pagination metadata
 */
export const PaginationInfoSchema = z.object({
  page: z.number().int().positive('Page must be a positive integer'),
  limit: z.number().int().positive('Limit must be a positive integer'),
  total: z.number().int().nonnegative('Total must be a non-negative integer'),
  totalPages: z.number().int().positive('Total pages must be a positive integer'),
});

/**
 * Schema for supported currency codes
 */
export const CurrencySchema = z.enum(['BGN', 'EUR', 'USD']);

/**
 * Schema for image metadata
 */
export const ImageSchema = z.object({
  id: z.string().uuid('Invalid image ID format'),
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  width: z.number().int().positive('Width must be a positive integer'),
  height: z.number().int().positive('Height must be a positive integer'),
  order: z.number().int().nonnegative('Order must be a non-negative integer'),
});

/**
 * Schema for price range
 */
export const PriceRangeSchema = z.object({
  min: z.number().positive('Minimum price must be positive'),
  max: z.number().positive('Maximum price must be positive'),
  currency: CurrencySchema,
}).refine(
  (data) => data.min <= data.max,
  {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['min'],
  }
);

/**
 * Schema for date range
 */
export const DateRangeSchema = z.object({
  start: z.date(),
  end: z.date(),
}).refine(
  (data) => data.start <= data.end,
  {
    message: 'Start date must be before or equal to end date',
    path: ['start'],
  }
);

/**
 * Generic schema for API responses
 */
export const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    errors: z.array(ApiErrorSchema).optional(),
  });


/**
 * Generic schema for paginated API responses
 */
export const PaginatedResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: z.array(dataSchema),
    success: z.boolean(),
    message: z.string().optional(),
    pagination: PaginationInfoSchema,
    errors: z.array(ApiErrorSchema).optional(),
  });

