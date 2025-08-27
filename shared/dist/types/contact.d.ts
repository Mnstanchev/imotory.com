/**
 * Contact form and newsletter subscription types
 */
/**
 * Supported languages for contact forms and subscriptions
 */
export declare enum ContactLanguage {
    EN = "en",
    BG = "bg",
    RU = "ru"
}
/**
 * Contact form submission interface
 */
export interface ContactForm {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    listingId?: string;
    agentId?: string;
    language: ContactLanguage;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
    isSpam?: boolean;
    createdAt?: Date;
    respondedAt?: Date;
    responseMessage?: string;
}
/**
 * Newsletter subscription interface
 */
export interface NewsletterSubscription {
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    interests?: string[];
    language: ContactLanguage;
    isActive: boolean;
    unsubscribeToken?: string;
    subscribedAt?: Date;
    unsubscribedAt?: Date;
    source?: string;
    ipAddress?: string;
    preferences?: {
        frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
        categories: string[];
    };
}
/**
 * Contact form categories for filtering
 */
export declare enum ContactCategory {
    GENERAL = "general",
    LISTING_INQUIRY = "listing_inquiry",
    AGENT_INQUIRY = "agent_inquiry",
    TECHNICAL_SUPPORT = "technical_support",
    BUSINESS_PARTNERSHIP = "business_partnership",
    MEDIA_INQUIRY = "media_inquiry",
    CAREERS = "careers",
    FEEDBACK = "feedback"
}
/**
 * Extended contact form with category
 */
export interface ExtendedContactForm extends ContactForm {
    category: ContactCategory;
    urgency: 'low' | 'medium' | 'high';
    preferredContactMethod: 'email' | 'phone' | 'both';
    bestTimeToContact?: 'morning' | 'afternoon' | 'evening' | 'any';
    budget?: {
        min: number;
        max: number;
        currency: string;
    };
    timeline?: 'immediate' | 'within_month' | 'within_3_months' | 'within_6_months' | 'flexible';
}
/**
 * Contact form search filters
 */
export interface ContactFormFilters {
    category?: ContactCategory;
    status?: 'pending' | 'responded' | 'spam' | 'closed';
    language?: ContactLanguage;
    dateFrom?: Date;
    dateTo?: Date;
    hasListingId?: boolean;
    hasAgentId?: boolean;
}
/**
 * Subscription search filters
 */
export interface SubscriptionFilters {
    language?: ContactLanguage;
    isActive?: boolean;
    subscribedAfter?: Date;
    subscribedBefore?: Date;
    interests?: string[];
}
//# sourceMappingURL=contact.d.ts.map