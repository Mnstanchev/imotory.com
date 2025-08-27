/**
 * Zod schemas for contact form and newsletter validation
 */
import { z } from 'zod';
/**
 * Zod schema for contact language enum
 */
export declare const ContactLanguageSchema: z.ZodEnum<{
    en: "en";
    bg: "bg";
    ru: "ru";
}>;
/**
 * Zod schema for contact category enum
 */
export declare const ContactCategorySchema: z.ZodEnum<{
    general: "general";
    listing_inquiry: "listing_inquiry";
    agent_inquiry: "agent_inquiry";
    technical_support: "technical_support";
    business_partnership: "business_partnership";
    media_inquiry: "media_inquiry";
    careers: "careers";
    feedback: "feedback";
}>;
/**
 * Zod schema for contact urgency levels
 */
export declare const ContactUrgencySchema: z.ZodEnum<{
    low: "low";
    medium: "medium";
    high: "high";
}>;
/**
 * Zod schema for contact method preference
 */
export declare const ContactMethodSchema: z.ZodEnum<{
    email: "email";
    phone: "phone";
    both: "both";
}>;
/**
 * Zod schema for best time to contact
 */
export declare const BestTimeSchema: z.ZodEnum<{
    morning: "morning";
    afternoon: "afternoon";
    evening: "evening";
    any: "any";
}>;
/**
 * Zod schema for timeline options
 */
export declare const TimelineSchema: z.ZodEnum<{
    immediate: "immediate";
    within_month: "within_month";
    within_3_months: "within_3_months";
    within_6_months: "within_6_months";
    flexible: "flexible";
}>;
/**
 * Zod schema for budget validation
 */
export declare const BudgetSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
/**
 * Zod schema for basic contact form validation
 */
export declare const ContactFormSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    subject: z.ZodString;
    message: z.ZodString;
    listingId: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<{
        en: "en";
        bg: "bg";
        ru: "ru";
    }>>;
    source: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    isSpam: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    respondedAt: z.ZodOptional<z.ZodDate>;
    responseMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Zod schema for extended contact form validation
 */
export declare const ExtendedContactFormSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    subject: z.ZodString;
    message: z.ZodString;
    listingId: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<{
        en: "en";
        bg: "bg";
        ru: "ru";
    }>>;
    source: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    isSpam: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodDate>;
    respondedAt: z.ZodOptional<z.ZodDate>;
    responseMessage: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<{
        general: "general";
        listing_inquiry: "listing_inquiry";
        agent_inquiry: "agent_inquiry";
        technical_support: "technical_support";
        business_partnership: "business_partnership";
        media_inquiry: "media_inquiry";
        careers: "careers";
        feedback: "feedback";
    }>;
    urgency: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>;
    preferredContactMethod: z.ZodEnum<{
        email: "email";
        phone: "phone";
        both: "both";
    }>;
    bestTimeToContact: z.ZodOptional<z.ZodEnum<{
        morning: "morning";
        afternoon: "afternoon";
        evening: "evening";
        any: "any";
    }>>;
    budget: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        currency: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
    timeline: z.ZodOptional<z.ZodEnum<{
        immediate: "immediate";
        within_month: "within_month";
        within_3_months: "within_3_months";
        within_6_months: "within_6_months";
        flexible: "flexible";
    }>>;
}, z.core.$strip>;
/**
 * Zod schema for newsletter subscription validation
 */
export declare const NewsletterSubscriptionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString>>;
    language: z.ZodDefault<z.ZodEnum<{
        en: "en";
        bg: "bg";
        ru: "ru";
    }>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    unsubscribeToken: z.ZodOptional<z.ZodString>;
    subscribedAt: z.ZodOptional<z.ZodDate>;
    unsubscribedAt: z.ZodOptional<z.ZodDate>;
    source: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    preferences: z.ZodOptional<z.ZodObject<{
        frequency: z.ZodDefault<z.ZodEnum<{
            immediate: "immediate";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Zod schema for contact form search filters
 */
export declare const ContactFormFiltersSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<{
        general: "general";
        listing_inquiry: "listing_inquiry";
        agent_inquiry: "agent_inquiry";
        technical_support: "technical_support";
        business_partnership: "business_partnership";
        media_inquiry: "media_inquiry";
        careers: "careers";
        feedback: "feedback";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        responded: "responded";
        spam: "spam";
        closed: "closed";
    }>>;
    language: z.ZodOptional<z.ZodEnum<{
        en: "en";
        bg: "bg";
        ru: "ru";
    }>>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
    hasListingId: z.ZodOptional<z.ZodBoolean>;
    hasAgentId: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Zod schema for subscription search filters
 */
export declare const SubscriptionFiltersSchema: z.ZodObject<{
    language: z.ZodOptional<z.ZodEnum<{
        en: "en";
        bg: "bg";
        ru: "ru";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    subscribedAfter: z.ZodOptional<z.ZodDate>;
    subscribedBefore: z.ZodOptional<z.ZodDate>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=contact.d.ts.map