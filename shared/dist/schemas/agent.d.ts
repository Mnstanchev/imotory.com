/**
 * Agent validation schemas
 */
import { z } from 'zod';
/**
 * Schema for agent performance metrics
 */
export declare const AgentMetricsSchema: z.ZodObject<{
    responseRate: z.ZodNumber;
    averageResponseTime: z.ZodNumber;
    listingsSold: z.ZodNumber;
    listingsRented: z.ZodNumber;
    averageRating: z.ZodNumber;
    reviewCount: z.ZodNumber;
    totalListings: z.ZodNumber;
    successfulTransactions: z.ZodNumber;
}, z.core.$strip>;
/**
 * Schema for agent social media links
 */
export declare const SocialMediaSchema: z.ZodObject<{
    facebook: z.ZodOptional<z.ZodString>;
    instagram: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for creating new agent profiles
 */
export declare const CreateAgentInputSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    biography: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    specializations: z.ZodArray<z.ZodString>;
    languages: z.ZodArray<z.ZodString>;
    licenseNumber: z.ZodOptional<z.ZodString>;
    experienceYears: z.ZodNumber;
    socialMedia: z.ZodOptional<z.ZodObject<{
        facebook: z.ZodOptional<z.ZodString>;
        instagram: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Schema for updating agent profiles
 */
export declare const UpdateAgentInputSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    biography: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    licenseNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    experienceYears: z.ZodOptional<z.ZodNumber>;
    socialMedia: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        facebook: z.ZodOptional<z.ZodString>;
        instagram: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Schema for agent search filters
 */
export declare const AgentFiltersSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    isVerified: z.ZodOptional<z.ZodBoolean>;
    specializations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    minExperienceYears: z.ZodOptional<z.ZodNumber>;
    minRating: z.ZodOptional<z.ZodNumber>;
    maxRating: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Schema for agent sort options
 */
export declare const AgentSortOptionSchema: z.ZodEnum<{
    name_asc: "name_asc";
    name_desc: "name_desc";
    rating_asc: "rating_asc";
    rating_desc: "rating_desc";
    experience_asc: "experience_asc";
    experience_desc: "experience_desc";
    listings_count_asc: "listings_count_asc";
    listings_count_desc: "listings_count_desc";
}>;
/**
 * Schema for complete agent objects
 */
export declare const AgentSchema: z.ZodObject<{
    id: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    biography: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    specializations: z.ZodArray<z.ZodString>;
    languages: z.ZodArray<z.ZodString>;
    isActive: z.ZodBoolean;
    isVerified: z.ZodBoolean;
    licenseNumber: z.ZodOptional<z.ZodString>;
    experienceYears: z.ZodNumber;
    listingsCount: z.ZodNumber;
    performanceMetrics: z.ZodOptional<z.ZodObject<{
        responseRate: z.ZodNumber;
        averageResponseTime: z.ZodNumber;
        listingsSold: z.ZodNumber;
        listingsRented: z.ZodNumber;
        averageRating: z.ZodNumber;
        reviewCount: z.ZodNumber;
        totalListings: z.ZodNumber;
        successfulTransactions: z.ZodNumber;
    }, z.core.$strip>>;
    socialMedia: z.ZodOptional<z.ZodObject<{
        facebook: z.ZodOptional<z.ZodString>;
        instagram: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=agent.d.ts.map