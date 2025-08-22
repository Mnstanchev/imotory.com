/**
 * Agent validation schemas
 */
import { z } from 'zod';
import { MultilingualTextSchema } from './common';

/**
 * Schema for agent performance metrics
 */
export const AgentMetricsSchema = z.object({
  responseRate: z.number().min(0).max(100, 'Response rate must be between 0-100%'),
  averageResponseTime: z.number().nonnegative('Response time must be non-negative'),
  listingsSold: z.number().int().nonnegative('Listings sold must be non-negative'),
  listingsRented: z.number().int().nonnegative('Listings rented must be non-negative'),
  averageRating: z.number().min(1).max(5, 'Average rating must be between 1-5'),
  reviewCount: z.number().int().nonnegative('Review count must be non-negative'),
  totalListings: z.number().int().nonnegative('Total listings must be non-negative'),
  successfulTransactions: z.number().int().nonnegative('Transactions must be non-negative'),
});

/**
 * Schema for agent social media links
 */
export const SocialMediaSchema = z.object({
  facebook: z.string().url('Invalid Facebook URL').optional(),
  instagram: z.string().url('Invalid Instagram URL').optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
});

/**
 * Schema for Bulgarian phone number validation
 */
const BulgarianPhoneSchema = z.string().regex(
  /^(\+359|0)[0-9]{8,9}$/,
  'Invalid Bulgarian phone number format. Use +359XXXXXXXXX or 0XXXXXXXXX'
);

/**
 * Schema for creating new agent profiles
 */
export const CreateAgentInputSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
  email: z.string().email('Invalid email format'),
  phone: BulgarianPhoneSchema,
  avatar: z.string().url('Invalid avatar URL').optional(),
  biography: MultilingualTextSchema,
  specializations: z.array(z.string().min(1, 'Specialization cannot be empty')).min(1, 'At least one specialization is required'),
  languages: z.array(z.string().min(2, 'Language must be at least 2 characters')).min(1, 'At least one language is required'),
  licenseNumber: z.string().min(3, 'License number must be at least 3 characters').max(20, 'License number too long').optional(),
  experienceYears: z.number().int().min(0, 'Experience years cannot be negative').max(50, 'Experience years too high'),
  socialMedia: SocialMediaSchema.optional(),
});

/**
 * Schema for updating agent profiles
 */
export const UpdateAgentInputSchema = CreateAgentInputSchema.partial();

/**
 * Schema for agent search filters
 */
export const AgentFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  specializations: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  minExperienceYears: z.number().int().min(0).optional(),
  minRating: z.number().min(1).max(5).optional(),
  maxRating: z.number().min(1).max(5).optional(),
}).refine(
  (data) => {
    if (data.minRating !== undefined && data.maxRating !== undefined) {
      return data.minRating <= data.maxRating;
    }
    return true;
  }, {
    message: 'Minimum rating must be less than or equal to maximum rating',
    path: ['minRating'],
  }
);

/**
 * Schema for agent sort options
 */
export const AgentSortOptionSchema = z.enum([
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
export const AgentSchema = z.object({
  id: z.string().uuid('Invalid agent ID format'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: BulgarianPhoneSchema,
  avatar: z.string().url().optional(),
  biography: MultilingualTextSchema,
  specializations: z.array(z.string().min(1)).min(1),
  languages: z.array(z.string().min(2)).min(1),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  licenseNumber: z.string().min(3).max(20).optional(),
  experienceYears: z.number().int().min(0).max(50),
  listingsCount: z.number().int().nonnegative('Listings count must be non-negative'),
  performanceMetrics: AgentMetricsSchema.optional(),
  socialMedia: SocialMediaSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});