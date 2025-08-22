/**
 * Zod schemas for contact form and newsletter validation
 */

import { z } from 'zod';

/**
 * Zod schema for contact language enum
 */
export const ContactLanguageSchema = z.enum(['en', 'bg', 'ru']);

/**
 * Zod schema for contact category enum
 */
export const ContactCategorySchema = z.enum([
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
export const ContactUrgencySchema = z.enum(['low', 'medium', 'high']);

/**
 * Zod schema for contact method preference
 */
export const ContactMethodSchema = z.enum(['email', 'phone', 'both']);

/**
 * Zod schema for best time to contact
 */
export const BestTimeSchema = z.enum(['morning', 'afternoon', 'evening', 'any']);

/**
 * Zod schema for timeline options
 */
export const TimelineSchema = z.enum([
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
export const BudgetSchema = z.object({
  min: z.number().positive().min(0),
  max: z.number().positive().min(0),
  currency: z.string().length(3).default('EUR')
}).refine(data => data.min <= data.max, {
  message: "Minimum budget must be less than or equal to maximum budget"
});

/**
 * Zod schema for basic contact form validation
 */
export const ContactFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(BULGARIAN_PHONE_REGEX, "Invalid Bulgarian phone format").optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
  listingId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  language: ContactLanguageSchema.default('en'),
  source: z.string().max(50).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  isSpam: z.boolean().default(false),
  createdAt: z.date().optional(),
  respondedAt: z.date().optional(),
  responseMessage: z.string().max(2000).optional()
});

/**
 * Zod schema for extended contact form validation
 */
export const ExtendedContactFormSchema = ContactFormSchema.extend({
  category: ContactCategorySchema,
  urgency: ContactUrgencySchema,
  preferredContactMethod: ContactMethodSchema,
  bestTimeToContact: BestTimeSchema.optional(),
  budget: BudgetSchema.optional(),
  timeline: TimelineSchema.optional()
});

/**
 * Zod schema for newsletter subscription validation
 */
export const NewsletterSubscriptionSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long").optional(),
  interests: z.array(z.string().min(1).max(50)).max(20, "Too many interests").optional(),
  language: ContactLanguageSchema.default('en'),
  isActive: z.boolean().default(true),
  unsubscribeToken: z.string().uuid().optional(),
  subscribedAt: z.date().optional(),
  unsubscribedAt: z.date().optional(),
  source: z.string().max(50).optional(),
  ipAddress: z.string().ip().optional(),
  preferences: z.object({
    frequency: z.enum(['immediate', 'daily', 'weekly', 'monthly']).default('weekly'),
    categories: z.array(z.string().min(1).max(50)).max(10, "Too many categories").optional()
  }).optional()
});

/**
 * Zod schema for contact form search filters
 */
export const ContactFormFiltersSchema = z.object({
  category: ContactCategorySchema.optional(),
  status: z.enum(['pending', 'responded', 'spam', 'closed']).optional(),
  language: ContactLanguageSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  hasListingId: z.boolean().optional(),
  hasAgentId: z.boolean().optional()
});

/**
 * Zod schema for subscription search filters
 */
export const SubscriptionFiltersSchema = z.object({
  language: ContactLanguageSchema.optional(),
  isActive: z.boolean().optional(),
  subscribedAfter: z.date().optional(),
  subscribedBefore: z.date().optional(),
  interests: z.array(z.string().min(1).max(50)).max(20).optional()
});

