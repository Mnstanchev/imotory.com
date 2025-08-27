"use strict";
/**
 * Zod schemas for contact form and newsletter validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionFiltersSchema = exports.ContactFormFiltersSchema = exports.NewsletterSubscriptionSchema = exports.ExtendedContactFormSchema = exports.ContactFormSchema = exports.BudgetSchema = exports.TimelineSchema = exports.BestTimeSchema = exports.ContactMethodSchema = exports.ContactUrgencySchema = exports.ContactCategorySchema = exports.ContactLanguageSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for contact language enum
 */
exports.ContactLanguageSchema = zod_1.z.enum(['en', 'bg', 'ru']);
/**
 * Zod schema for contact category enum
 */
exports.ContactCategorySchema = zod_1.z.enum([
    'general',
    'listing_inquiry',
    'agent_inquiry',
    'technical_support',
    'business_partnership',
    'media_inquiry',
    'careers',
    'feedback'
]);
/**
 * Zod schema for contact urgency levels
 */
exports.ContactUrgencySchema = zod_1.z.enum(['low', 'medium', 'high']);
/**
 * Zod schema for contact method preference
 */
exports.ContactMethodSchema = zod_1.z.enum(['email', 'phone', 'both']);
/**
 * Zod schema for best time to contact
 */
exports.BestTimeSchema = zod_1.z.enum(['morning', 'afternoon', 'evening', 'any']);
/**
 * Zod schema for timeline options
 */
exports.TimelineSchema = zod_1.z.enum([
    'immediate',
    'within_month',
    'within_3_months',
    'within_6_months',
    'flexible'
]);
/**
 * Bulgarian phone number regex
 */
const BULGARIAN_PHONE_REGEX = /^(\+359|0)[0-9]{8,9}$/;
/**
 * Zod schema for budget validation
 */
exports.BudgetSchema = zod_1.z.object({
    min: zod_1.z.number().positive().min(0),
    max: zod_1.z.number().positive().min(0),
    currency: zod_1.z.string().length(3).default('EUR')
}).refine(data => data.min <= data.max, {
    message: "Minimum budget must be less than or equal to maximum budget"
});
/**
 * Zod schema for basic contact form validation
 */
exports.ContactFormSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string().regex(BULGARIAN_PHONE_REGEX, "Invalid Bulgarian phone format").optional(),
    subject: zod_1.z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject too long"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
    listingId: zod_1.z.string().uuid().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    language: exports.ContactLanguageSchema.default('en'),
    source: zod_1.z.string().max(50).optional(),
    ipAddress: zod_1.z.string().optional(),
    userAgent: zod_1.z.string().max(500).optional(),
    isSpam: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().optional(),
    respondedAt: zod_1.z.date().optional(),
    responseMessage: zod_1.z.string().max(2000).optional()
});
/**
 * Zod schema for extended contact form validation
 */
exports.ExtendedContactFormSchema = exports.ContactFormSchema.extend({
    category: exports.ContactCategorySchema,
    urgency: exports.ContactUrgencySchema,
    preferredContactMethod: exports.ContactMethodSchema,
    bestTimeToContact: exports.BestTimeSchema.optional(),
    budget: exports.BudgetSchema.optional(),
    timeline: exports.TimelineSchema.optional()
});
/**
 * Zod schema for newsletter subscription validation
 */
exports.NewsletterSubscriptionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    email: zod_1.z.string().email("Invalid email format"),
    firstName: zod_1.z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long").optional(),
    lastName: zod_1.z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long").optional(),
    interests: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(20, "Too many interests").optional(),
    language: exports.ContactLanguageSchema.default('en'),
    isActive: zod_1.z.boolean().default(true),
    unsubscribeToken: zod_1.z.string().uuid().optional(),
    subscribedAt: zod_1.z.date().optional(),
    unsubscribedAt: zod_1.z.date().optional(),
    source: zod_1.z.string().max(50).optional(),
    ipAddress: zod_1.z.string().optional(),
    preferences: zod_1.z.object({
        frequency: zod_1.z.enum(['immediate', 'daily', 'weekly', 'monthly']).default('weekly'),
        categories: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(10, "Too many categories").optional()
    }).optional()
});
/**
 * Zod schema for contact form search filters
 */
exports.ContactFormFiltersSchema = zod_1.z.object({
    category: exports.ContactCategorySchema.optional(),
    status: zod_1.z.enum(['pending', 'responded', 'spam', 'closed']).optional(),
    language: exports.ContactLanguageSchema.optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional(),
    hasListingId: zod_1.z.boolean().optional(),
    hasAgentId: zod_1.z.boolean().optional()
});
/**
 * Zod schema for subscription search filters
 */
exports.SubscriptionFiltersSchema = zod_1.z.object({
    language: exports.ContactLanguageSchema.optional(),
    isActive: zod_1.z.boolean().optional(),
    subscribedAfter: zod_1.z.date().optional(),
    subscribedBefore: zod_1.z.date().optional(),
    interests: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(20).optional()
});
//# sourceMappingURL=contact.js.map