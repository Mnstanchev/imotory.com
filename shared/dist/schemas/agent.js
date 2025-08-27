"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSchema = exports.AgentSortOptionSchema = exports.AgentFiltersSchema = exports.UpdateAgentInputSchema = exports.CreateAgentInputSchema = exports.SocialMediaSchema = exports.AgentMetricsSchema = void 0;
/**
 * Agent validation schemas
 */
const zod_1 = require("zod");
const common_1 = require("./common");
/**
 * Schema for agent performance metrics
 */
exports.AgentMetricsSchema = zod_1.z.object({
    responseRate: zod_1.z.number().min(0).max(100, 'Response rate must be between 0-100%'),
    averageResponseTime: zod_1.z.number().nonnegative('Response time must be non-negative'),
    listingsSold: zod_1.z.number().int().nonnegative('Listings sold must be non-negative'),
    listingsRented: zod_1.z.number().int().nonnegative('Listings rented must be non-negative'),
    averageRating: zod_1.z.number().min(1).max(5, 'Average rating must be between 1-5'),
    reviewCount: zod_1.z.number().int().nonnegative('Review count must be non-negative'),
    totalListings: zod_1.z.number().int().nonnegative('Total listings must be non-negative'),
    successfulTransactions: zod_1.z.number().int().nonnegative('Transactions must be non-negative'),
});
/**
 * Schema for agent social media links
 */
exports.SocialMediaSchema = zod_1.z.object({
    facebook: zod_1.z.string().url('Invalid Facebook URL').optional(),
    instagram: zod_1.z.string().url('Invalid Instagram URL').optional(),
    linkedin: zod_1.z.string().url('Invalid LinkedIn URL').optional(),
});
/**
 * Schema for Bulgarian phone number validation
 */
const BulgarianPhoneSchema = zod_1.z.string().regex(/^(\+359|0)[0-9]{8,9}$/, 'Invalid Bulgarian phone number format. Use +359XXXXXXXXX or 0XXXXXXXXX');
/**
 * Schema for creating new agent profiles
 */
exports.CreateAgentInputSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
    email: zod_1.z.string().email('Invalid email format'),
    phone: BulgarianPhoneSchema,
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    biography: common_1.MultilingualTextSchema,
    specializations: zod_1.z.array(zod_1.z.string().min(1, 'Specialization cannot be empty')).min(1, 'At least one specialization is required'),
    languages: zod_1.z.array(zod_1.z.string().min(2, 'Language must be at least 2 characters')).min(1, 'At least one language is required'),
    licenseNumber: zod_1.z.string().min(3, 'License number must be at least 3 characters').max(20, 'License number too long').optional(),
    experienceYears: zod_1.z.number().int().min(0, 'Experience years cannot be negative').max(50, 'Experience years too high'),
    socialMedia: exports.SocialMediaSchema.optional(),
});
/**
 * Schema for updating agent profiles
 */
exports.UpdateAgentInputSchema = exports.CreateAgentInputSchema.partial();
/**
 * Schema for agent search filters
 */
exports.AgentFiltersSchema = zod_1.z.object({
    isActive: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    specializations: zod_1.z.array(zod_1.z.string()).optional(),
    languages: zod_1.z.array(zod_1.z.string()).optional(),
    minExperienceYears: zod_1.z.number().int().min(0).optional(),
    minRating: zod_1.z.number().min(1).max(5).optional(),
    maxRating: zod_1.z.number().min(1).max(5).optional(),
}).refine((data) => {
    if (data.minRating !== undefined && data.maxRating !== undefined) {
        return data.minRating <= data.maxRating;
    }
    return true;
}, {
    message: 'Minimum rating must be less than or equal to maximum rating',
    path: ['minRating'],
});
/**
 * Schema for agent sort options
 */
exports.AgentSortOptionSchema = zod_1.z.enum([
    'name_asc',
    'name_desc',
    'rating_asc',
    'rating_desc',
    'experience_asc',
    'experience_desc',
    'listings_count_asc',
    'listings_count_desc',
]);
/**
 * Schema for complete agent objects
 */
exports.AgentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid agent ID format'),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    phone: BulgarianPhoneSchema,
    avatar: zod_1.z.string().url().optional(),
    biography: common_1.MultilingualTextSchema,
    specializations: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    languages: zod_1.z.array(zod_1.z.string().min(2)).min(1),
    isActive: zod_1.z.boolean(),
    isVerified: zod_1.z.boolean(),
    licenseNumber: zod_1.z.string().min(3).max(20).optional(),
    experienceYears: zod_1.z.number().int().min(0).max(50),
    listingsCount: zod_1.z.number().int().nonnegative('Listings count must be non-negative'),
    performanceMetrics: exports.AgentMetricsSchema.optional(),
    socialMedia: exports.SocialMediaSchema.optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
//# sourceMappingURL=agent.js.map