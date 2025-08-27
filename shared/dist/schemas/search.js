"use strict";
/**
 * Zod schemas for search and filtering validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSuggestionSchema = exports.SavedSearchSchema = exports.SearchResponseSchema = exports.SearchResultSchema = exports.SearchQuerySchema = exports.PaginationParamsSchema = exports.SearchSortOptionSchema = exports.SearchFiltersSchema = exports.RoomCountSchema = exports.LocationFilterSchema = exports.YearRangeSchema = exports.SizeRangeSchema = exports.SearchPriceRangeSchema = void 0;
const zod_1 = require("zod");
const listing_1 = require("./listing");
const common_1 = require("./common");
/**
 * Zod schema for price range validation
 */
exports.SearchPriceRangeSchema = zod_1.z.object({
    min: zod_1.z.number().positive().min(0),
    max: zod_1.z.number().positive().min(0)
}).refine(data => data.min <= data.max, {
    message: "Minimum price must be less than or equal to maximum price"
});
/**
 * Zod schema for size range validation
 */
exports.SizeRangeSchema = zod_1.z.object({
    min: zod_1.z.number().positive().min(0),
    max: zod_1.z.number().positive().min(0),
    unit: zod_1.z.enum(['sqm', 'sqft', 'acre'])
}).refine(data => data.min <= data.max, {
    message: "Minimum size must be less than or equal to maximum size"
});
/**
 * Zod schema for year range validation
 */
exports.YearRangeSchema = zod_1.z.object({
    min: zod_1.z.number().int().min(1800).max(new Date().getFullYear()),
    max: zod_1.z.number().int().min(1800).max(new Date().getFullYear())
}).refine(data => data.min <= data.max, {
    message: "Minimum year must be less than or equal to maximum year"
});
/**
 * Zod schema for location-based search filters
 */
exports.LocationFilterSchema = zod_1.z.object({
    city: zod_1.z.string().min(2).optional(),
    neighborhood: zod_1.z.string().min(2).optional(),
    postalCode: zod_1.z.string().regex(/^\d{4,6}$/).optional(),
    distance: zod_1.z.number().positive().optional(), // kilometers
    coordinates: zod_1.z.object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180)
    }).optional()
});
/**
 * Zod schema for room count validation
 */
exports.RoomCountSchema = zod_1.z.object({
    min: zod_1.z.number().int().min(0),
    max: zod_1.z.number().int().min(0).optional()
}).refine(data => !data.max || data.min <= data.max, {
    message: "Minimum must be less than or equal to maximum"
});
/**
 * Zod schema for search filters validation
 */
exports.SearchFiltersSchema = zod_1.z.object({
    // Property characteristics
    type: listing_1.PropertyTypeSchema.optional(),
    priceRange: common_1.PriceRangeSchema.optional(),
    sizeRange: exports.SizeRangeSchema.optional(),
    yearRange: exports.YearRangeSchema.optional(),
    bedrooms: exports.RoomCountSchema.optional(),
    bathrooms: exports.RoomCountSchema.optional(),
    // Features and amenities
    features: zod_1.z.array(listing_1.PropertyFeatureSchema).optional(),
    hasGarage: zod_1.z.boolean().optional(),
    hasParking: zod_1.z.boolean().optional(),
    isFurnished: zod_1.z.boolean().optional(),
    allowsPets: zod_1.z.boolean().optional(),
    // Location
    location: exports.LocationFilterSchema.optional(),
    // Listing metadata
    isFeatured: zod_1.z.boolean().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    // Status
    status: zod_1.z.enum(['active', 'pending', 'sold', 'rented']).optional()
});
/**
 * Zod schema for search sort options
 */
exports.SearchSortOptionSchema = zod_1.z.enum([
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
exports.PaginationParamsSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0)
});
/**
 * Zod schema for search query validation
 */
exports.SearchQuerySchema = zod_1.z.object({
    query: zod_1.z.string().min(1).max(200).optional(),
    filters: exports.SearchFiltersSchema,
    sort: exports.SearchSortOptionSchema.default('featured_first'),
    pagination: exports.PaginationParamsSchema
});
/**
 * Zod schema for search result item
 */
exports.SearchResultSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
    price: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    type: listing_1.PropertyTypeSchema,
    size: zod_1.z.number().positive(),
    bedrooms: zod_1.z.number().int().min(0),
    bathrooms: zod_1.z.number().int().min(0),
    location: common_1.LocationSchema,
    images: zod_1.z.array(zod_1.z.string().url()),
    agentId: zod_1.z.string().uuid(),
    isFeatured: zod_1.z.boolean().default(false),
    distance: zod_1.z.number().positive().optional(),
    relevanceScore: zod_1.z.number().min(0).max(1).optional()
});
/**
 * Zod schema for search response
 */
exports.SearchResponseSchema = zod_1.z.object({
    results: zod_1.z.array(exports.SearchResultSchema),
    total: zod_1.z.number().int().min(0),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
    hasNext: zod_1.z.boolean(),
    hasPrev: zod_1.z.boolean()
});
/**
 * Zod schema for saved search
 */
exports.SavedSearchSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(100),
    query: exports.SearchQuerySchema,
    isActive: zod_1.z.boolean().default(true),
    notificationEnabled: zod_1.z.boolean().default(true),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date())
});
/**
 * Zod schema for search suggestions
 */
exports.SearchSuggestionSchema = zod_1.z.object({
    type: zod_1.z.enum(['city', 'neighborhood', 'agent', 'property']),
    value: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional()
});
//# sourceMappingURL=search.js.map