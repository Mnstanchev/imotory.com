"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseSchema = exports.ApiResponseSchema = exports.DateRangeSchema = exports.PriceRangeSchema = exports.ImageSchema = exports.CurrencySchema = exports.PaginationInfoSchema = exports.ApiErrorSchema = exports.LocationSchema = exports.CoordinatesSchema = exports.MultilingualTextSchema = exports.LanguageSchema = void 0;
/**
 * Common utility schemas for runtime validation
 */
const zod_1 = require("zod");
/**
 * Schema for supported language codes
 */
exports.LanguageSchema = zod_1.z.enum(['en', 'bg', 'ru']);
/**
 * Schema for multilingual text validation
 */
exports.MultilingualTextSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English translation is required'),
    bg: zod_1.z.string().min(1, 'Bulgarian translation is required'),
    ru: zod_1.z.string().min(1, 'Russian translation is required'),
});
/**
 * Schema for geographic coordinates
 */
exports.CoordinatesSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
});
/**
 * Schema for detailed location information
 */
exports.LocationSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, 'Address is required'),
    city: zod_1.z.string().min(1, 'City is required'),
    neighborhood: zod_1.z.string().optional(),
    country: zod_1.z.string().min(1, 'Country is required'),
    coordinates: exports.CoordinatesSchema,
    localizedNames: exports.MultilingualTextSchema,
});
/**
 * Schema for API error structure
 */
exports.ApiErrorSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, 'Error code is required'),
    message: zod_1.z.string().min(1, 'Error message is required'),
    field: zod_1.z.string().optional(),
});
/**
 * Schema for pagination metadata
 */
exports.PaginationInfoSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive('Page must be a positive integer'),
    limit: zod_1.z.number().int().positive('Limit must be a positive integer'),
    total: zod_1.z.number().int().nonnegative('Total must be a non-negative integer'),
    totalPages: zod_1.z.number().int().positive('Total pages must be a positive integer'),
});
/**
 * Schema for supported currency codes
 */
exports.CurrencySchema = zod_1.z.enum(['BGN', 'EUR', 'USD']);
/**
 * Schema for image metadata
 */
exports.ImageSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid image ID format'),
    url: zod_1.z.string().url('Invalid image URL'),
    alt: zod_1.z.string().optional(),
    width: zod_1.z.number().int().positive('Width must be a positive integer'),
    height: zod_1.z.number().int().positive('Height must be a positive integer'),
    order: zod_1.z.number().int().nonnegative('Order must be a non-negative integer'),
});
/**
 * Schema for price range
 */
exports.PriceRangeSchema = zod_1.z.object({
    min: zod_1.z.number().positive('Minimum price must be positive'),
    max: zod_1.z.number().positive('Maximum price must be positive'),
    currency: exports.CurrencySchema,
}).refine((data) => data.min <= data.max, {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['min'],
});
/**
 * Schema for date range
 */
exports.DateRangeSchema = zod_1.z.object({
    start: zod_1.z.date(),
    end: zod_1.z.date(),
}).refine((data) => data.start <= data.end, {
    message: 'Start date must be before or equal to end date',
    path: ['start'],
});
/**
 * Generic schema for API responses
 */
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    data: dataSchema,
    success: zod_1.z.boolean(),
    message: zod_1.z.string().optional(),
    errors: zod_1.z.array(exports.ApiErrorSchema).optional(),
});
exports.ApiResponseSchema = ApiResponseSchema;
/**
 * Generic schema for paginated API responses
 */
const PaginatedResponseSchema = (dataSchema) => zod_1.z.object({
    data: zod_1.z.array(dataSchema),
    success: zod_1.z.boolean(),
    message: zod_1.z.string().optional(),
    pagination: exports.PaginationInfoSchema,
    errors: zod_1.z.array(exports.ApiErrorSchema).optional(),
});
exports.PaginatedResponseSchema = PaginatedResponseSchema;
//# sourceMappingURL=common.js.map