"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSchema = exports.UpdateListingInputSchema = exports.CreateListingInputSchema = exports.ListingSortOptionSchema = exports.ListingFiltersSchema = exports.PropertySpecsSchema = exports.PropertyFeatureSchema = exports.ListingStatusSchema = exports.PropertyTypeSchema = void 0;
/**
 * Property listing validation schemas
 */
const zod_1 = require("zod");
const common_1 = require("./common");
/**
 * Schema for property types
 */
exports.PropertyTypeSchema = zod_1.z.enum([
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
exports.ListingStatusSchema = zod_1.z.enum([
    'active',
    'pending',
    'sold',
    'rented',
    'inactive'
]);
/**
 * Schema for property features
 */
exports.PropertyFeatureSchema = zod_1.z.enum([
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
exports.PropertySpecsSchema = zod_1.z.object({
    bedrooms: zod_1.z.number().int().nonnegative('Bedrooms must be a non-negative integer'),
    bathrooms: zod_1.z.number().int().nonnegative('Bathrooms must be a non-negative integer'),
    size: zod_1.z.number().positive('Size must be a positive number'),
    yearBuilt: zod_1.z.number().int().positive('Year built must be a positive integer').optional(),
    floors: zod_1.z.number().int().positive('Floors must be a positive integer').optional(),
    floor: zod_1.z.number().int().positive('Floor must be a positive integer').optional(),
    hasGarage: zod_1.z.boolean(),
    parkingSpaces: zod_1.z.number().int().nonnegative('Parking spaces must be a non-negative integer').optional(),
    energyRating: zod_1.z.string().min(1).max(2).optional(),
    constructionType: zod_1.z.string().min(1).max(50).optional(),
});
/**
 * Schema for listing filters
 */
exports.ListingFiltersSchema = zod_1.z.object({
    type: exports.PropertyTypeSchema.optional(),
    status: exports.ListingStatusSchema.optional(),
    minPrice: zod_1.z.number().positive('Minimum price must be positive').optional(),
    maxPrice: zod_1.z.number().positive('Maximum price must be positive').optional(),
    minSize: zod_1.z.number().positive('Minimum size must be positive').optional(),
    maxSize: zod_1.z.number().positive('Maximum size must be positive').optional(),
    minBedrooms: zod_1.z.number().int().nonnegative('Minimum bedrooms must be non-negative').optional(),
    maxBedrooms: zod_1.z.number().int().nonnegative('Maximum bedrooms must be non-negative').optional(),
    minBathrooms: zod_1.z.number().int().nonnegative('Minimum bathrooms must be non-negative').optional(),
    features: zod_1.z.array(exports.PropertyFeatureSchema).optional(),
    city: zod_1.z.string().min(1).optional(),
    neighborhood: zod_1.z.string().min(1).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    agentId: zod_1.z.string().uuid('Invalid agent ID format').optional(),
}).refine((data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
    }
    return true;
}, {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['minPrice'],
}).refine((data) => {
    if (data.minSize !== undefined && data.maxSize !== undefined) {
        return data.minSize <= data.maxSize;
    }
    return true;
}, {
    message: 'Minimum size must be less than or equal to maximum size',
    path: ['minSize'],
}).refine((data) => {
    if (data.minBedrooms !== undefined && data.maxBedrooms !== undefined) {
        return data.minBedrooms <= data.maxBedrooms;
    }
    return true;
}, {
    message: 'Minimum bedrooms must be less than or equal to maximum bedrooms',
    path: ['minBedrooms'],
});
/**
 * Schema for listing sort options
 */
exports.ListingSortOptionSchema = zod_1.z.enum([
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
exports.CreateListingInputSchema = zod_1.z.object({
    title: common_1.MultilingualTextSchema,
    description: common_1.MultilingualTextSchema,
    shortDescription: common_1.MultilingualTextSchema,
    price: zod_1.z.number().positive('Price must be positive'),
    currency: common_1.CurrencySchema,
    type: exports.PropertyTypeSchema,
    specifications: exports.PropertySpecsSchema,
    features: zod_1.z.array(exports.PropertyFeatureSchema).min(1, 'At least one feature is required'),
    location: common_1.LocationSchema,
    agentId: zod_1.z.string().uuid('Invalid agent ID format'),
    images: zod_1.z.array(common_1.ImageSchema).min(1, 'At least one image is required').max(20, 'Maximum 20 images allowed'),
    metaTitle: common_1.MultilingualTextSchema.optional(),
    metaDescription: common_1.MultilingualTextSchema.optional(),
});
/**
 * Schema for updating existing listings
 */
exports.UpdateListingInputSchema = exports.CreateListingInputSchema.partial();
/**
 * Schema for complete listing objects
 */
exports.ListingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid listing ID format'),
    slug: zod_1.z.string().min(1, 'Slug is required'),
    title: common_1.MultilingualTextSchema,
    description: common_1.MultilingualTextSchema,
    shortDescription: common_1.MultilingualTextSchema,
    price: zod_1.z.number().positive('Price must be positive'),
    currency: common_1.CurrencySchema,
    type: exports.PropertyTypeSchema,
    status: exports.ListingStatusSchema,
    specifications: exports.PropertySpecsSchema,
    features: zod_1.z.array(exports.PropertyFeatureSchema),
    location: common_1.LocationSchema,
    images: zod_1.z.array(common_1.ImageSchema).min(1, 'At least one image is required'),
    agentId: zod_1.z.string().uuid('Invalid agent ID format'),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    viewCount: zod_1.z.number().int().nonnegative('View count must be non-negative'),
    isFeatured: zod_1.z.boolean(),
    isActive: zod_1.z.boolean(),
    metaTitle: common_1.MultilingualTextSchema.optional(),
    metaDescription: common_1.MultilingualTextSchema.optional(),
});
//# sourceMappingURL=listing.js.map