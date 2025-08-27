/**
 * Type guard functions for runtime type validation using Zod schemas
 * Provides runtime type checking for all domain objects
 */
import { z } from 'zod';
export declare const isMultilingualText: (value: unknown) => value is {
    en: string;
    bg: string;
    ru: string;
};
export declare const isCurrency: (value: unknown) => value is "BGN" | "EUR" | "USD";
export declare const isLanguage: (value: unknown) => value is "en" | "bg" | "ru";
export declare const isPropertyType: (value: unknown) => value is "house" | "apartment" | "villa" | "office" | "commercial" | "land";
export declare const isListingStatus: (value: unknown) => value is "pending" | "active" | "sold" | "rented" | "inactive";
export declare const isPropertyFeature: (value: unknown) => value is "balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed";
export declare const isListing: (value: unknown) => value is {
    id: string;
    slug: string;
    title: {
        en: string;
        bg: string;
        ru: string;
    };
    description: {
        en: string;
        bg: string;
        ru: string;
    };
    shortDescription: {
        en: string;
        bg: string;
        ru: string;
    };
    price: number;
    currency: "BGN" | "EUR" | "USD";
    type: "house" | "apartment" | "villa" | "office" | "commercial" | "land";
    status: "pending" | "active" | "sold" | "rented" | "inactive";
    specifications: {
        bedrooms: number;
        bathrooms: number;
        size: number;
        hasGarage: boolean;
        yearBuilt?: number | undefined;
        floors?: number | undefined;
        floor?: number | undefined;
        parkingSpaces?: number | undefined;
        energyRating?: string | undefined;
        constructionType?: string | undefined;
    };
    features: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[];
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    images: {
        id: string;
        url: string;
        width: number;
        height: number;
        order: number;
        alt?: string | undefined;
    }[];
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isFeatured: boolean;
    isActive: boolean;
    metaTitle?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    metaDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
};
export declare const isListingFilters: (value: unknown) => value is {
    type?: "house" | "apartment" | "villa" | "office" | "commercial" | "land" | undefined;
    status?: "pending" | "active" | "sold" | "rented" | "inactive" | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
    minBedrooms?: number | undefined;
    maxBedrooms?: number | undefined;
    minBathrooms?: number | undefined;
    features?: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[] | undefined;
    city?: string | undefined;
    neighborhood?: string | undefined;
    isFeatured?: boolean | undefined;
    agentId?: string | undefined;
};
export declare const isListingSortOption: (value: unknown) => value is "price_asc" | "price_desc" | "date_asc" | "date_desc" | "size_asc" | "size_desc" | "views_desc" | "featured_first";
export declare const isCreateListingInput: (value: unknown) => value is {
    title: {
        en: string;
        bg: string;
        ru: string;
    };
    description: {
        en: string;
        bg: string;
        ru: string;
    };
    shortDescription: {
        en: string;
        bg: string;
        ru: string;
    };
    price: number;
    currency: "BGN" | "EUR" | "USD";
    type: "house" | "apartment" | "villa" | "office" | "commercial" | "land";
    specifications: {
        bedrooms: number;
        bathrooms: number;
        size: number;
        hasGarage: boolean;
        yearBuilt?: number | undefined;
        floors?: number | undefined;
        floor?: number | undefined;
        parkingSpaces?: number | undefined;
        energyRating?: string | undefined;
        constructionType?: string | undefined;
    };
    features: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[];
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    agentId: string;
    images: {
        id: string;
        url: string;
        width: number;
        height: number;
        order: number;
        alt?: string | undefined;
    }[];
    metaTitle?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    metaDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
};
export declare const isUpdateListingInput: (value: unknown) => value is {
    title?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    description?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    shortDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    price?: number | undefined;
    currency?: "BGN" | "EUR" | "USD" | undefined;
    type?: "house" | "apartment" | "villa" | "office" | "commercial" | "land" | undefined;
    specifications?: {
        bedrooms: number;
        bathrooms: number;
        size: number;
        hasGarage: boolean;
        yearBuilt?: number | undefined;
        floors?: number | undefined;
        floor?: number | undefined;
        parkingSpaces?: number | undefined;
        energyRating?: string | undefined;
        constructionType?: string | undefined;
    } | undefined;
    features?: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[] | undefined;
    location?: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    } | undefined;
    agentId?: string | undefined;
    images?: {
        id: string;
        url: string;
        width: number;
        height: number;
        order: number;
        alt?: string | undefined;
    }[] | undefined;
    metaTitle?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    metaDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
};
export declare const isAgent: (value: unknown) => value is {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    biography: {
        en: string;
        bg: string;
        ru: string;
    };
    specializations: string[];
    languages: string[];
    isActive: boolean;
    isVerified: boolean;
    experienceYears: number;
    listingsCount: number;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | undefined;
    licenseNumber?: string | undefined;
    performanceMetrics?: {
        responseRate: number;
        averageResponseTime: number;
        listingsSold: number;
        listingsRented: number;
        averageRating: number;
        reviewCount: number;
        totalListings: number;
        successfulTransactions: number;
    } | undefined;
    socialMedia?: {
        facebook?: string | undefined;
        instagram?: string | undefined;
        linkedin?: string | undefined;
    } | undefined;
};
export declare const isCreateAgentInput: (value: unknown) => value is {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    biography: {
        en: string;
        bg: string;
        ru: string;
    };
    specializations: string[];
    languages: string[];
    experienceYears: number;
    avatar?: string | undefined;
    licenseNumber?: string | undefined;
    socialMedia?: {
        facebook?: string | undefined;
        instagram?: string | undefined;
        linkedin?: string | undefined;
    } | undefined;
};
export declare const isUpdateAgentInput: (value: unknown) => value is {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
    biography?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    specializations?: string[] | undefined;
    languages?: string[] | undefined;
    licenseNumber?: string | undefined;
    experienceYears?: number | undefined;
    socialMedia?: {
        facebook?: string | undefined;
        instagram?: string | undefined;
        linkedin?: string | undefined;
    } | undefined;
};
export declare const isAgentFilters: (value: unknown) => value is {
    isActive?: boolean | undefined;
    isVerified?: boolean | undefined;
    specializations?: string[] | undefined;
    languages?: string[] | undefined;
    minExperienceYears?: number | undefined;
    minRating?: number | undefined;
    maxRating?: number | undefined;
};
export declare const isUser: (value: unknown) => value is {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "agent" | "admin" | "superadmin";
    preferences: {
        language: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
        savedSearches: boolean;
        newsletter: boolean;
        marketingEmails: boolean;
    };
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
    avatar?: string | undefined;
    lastLoginAt?: Date | undefined;
};
export declare const isCreateUserInput: (value: unknown) => value is {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: "user" | "agent" | "admin" | "superadmin";
    phone?: string | undefined;
    preferences?: {
        language?: string | undefined;
        currency?: string | undefined;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        } | undefined;
        savedSearches?: boolean | undefined;
        newsletter?: boolean | undefined;
        marketingEmails?: boolean | undefined;
    } | undefined;
};
export declare const isUpdateUserInput: (value: unknown) => value is {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    avatar?: string | undefined;
    preferences?: {
        language?: string | undefined;
        currency?: string | undefined;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        } | undefined;
        savedSearches?: boolean | undefined;
        newsletter?: boolean | undefined;
        marketingEmails?: boolean | undefined;
    } | undefined;
};
export declare const isUserFilters: (value: unknown) => value is {
    role?: "user" | "agent" | "admin" | "superadmin" | undefined;
    isEmailVerified?: boolean | undefined;
    isPhoneVerified?: boolean | undefined;
    isActive?: boolean | undefined;
    createdAfter?: Date | undefined;
    createdBefore?: Date | undefined;
};
export declare const isLoginInput: (value: unknown) => value is {
    email: string;
    password: string;
    rememberMe: boolean;
};
export declare const isRegisterInput: (value: unknown) => value is {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: "user" | "agent" | "admin" | "superadmin";
    phone?: string | undefined;
    preferences?: {
        language?: string | undefined;
        currency?: string | undefined;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        } | undefined;
        savedSearches?: boolean | undefined;
        newsletter?: boolean | undefined;
        marketingEmails?: boolean | undefined;
    } | undefined;
};
export declare const isBooking: (value: unknown) => value is {
    id: string;
    listingId: string;
    agentId: string;
    contactInfo: {
        name: string;
        email: string;
        phone: string;
        preferredLanguage: string;
        notes?: string | undefined;
    };
    visitType: "viewing" | "valuation" | "consultation" | "inspection";
    status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled";
    scheduledAt: Date;
    duration: number;
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    reminderSent: boolean;
    confirmationSent: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId?: string | undefined;
    specialRequests?: string | undefined;
};
export declare const isCreateBookingInput: (value: unknown) => value is {
    listingId: string;
    agentId: string;
    contactInfo: {
        name: string;
        email: string;
        phone: string;
        preferredLanguage: string;
        notes?: string | undefined;
    };
    visitType: "viewing" | "valuation" | "consultation" | "inspection";
    scheduledAt: Date;
    duration: number;
    specialRequests?: string | undefined;
};
export declare const isUpdateBookingInput: (value: unknown) => value is {
    listingId?: string | undefined;
    agentId?: string | undefined;
    contactInfo?: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        preferredLanguage?: string | undefined;
        notes?: string | undefined;
    } | undefined;
    visitType?: "viewing" | "valuation" | "consultation" | "inspection" | undefined;
    scheduledAt?: Date | undefined;
    duration?: number | undefined;
    specialRequests?: string | undefined;
    status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled" | undefined;
};
export declare const isBookingFilters: (value: unknown) => value is {
    listingId?: string | undefined;
    agentId?: string | undefined;
    userId?: string | undefined;
    visitType?: "viewing" | "valuation" | "consultation" | "inspection" | undefined;
    status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled" | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
};
export declare const isVisitType: (value: unknown) => value is "viewing" | "valuation" | "consultation" | "inspection";
export declare const isBookingStatus: (value: unknown) => value is "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled";
export declare const isContactInfo: (value: unknown) => value is {
    name: string;
    email: string;
    phone: string;
    preferredLanguage: string;
    notes?: string | undefined;
};
export declare const isSearchFilters: (value: unknown) => value is {
    type?: "house" | "apartment" | "villa" | "office" | "commercial" | "land" | undefined;
    priceRange?: {
        min: number;
        max: number;
        currency: "BGN" | "EUR" | "USD";
    } | undefined;
    sizeRange?: {
        min: number;
        max: number;
        unit: "sqm" | "sqft" | "acre";
    } | undefined;
    yearRange?: {
        min: number;
        max: number;
    } | undefined;
    bedrooms?: {
        min: number;
        max?: number | undefined;
    } | undefined;
    bathrooms?: {
        min: number;
        max?: number | undefined;
    } | undefined;
    features?: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[] | undefined;
    hasGarage?: boolean | undefined;
    hasParking?: boolean | undefined;
    isFurnished?: boolean | undefined;
    allowsPets?: boolean | undefined;
    location?: {
        city?: string | undefined;
        neighborhood?: string | undefined;
        postalCode?: string | undefined;
        distance?: number | undefined;
        coordinates?: {
            lat: number;
            lng: number;
        } | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    agentId?: string | undefined;
    status?: "pending" | "active" | "sold" | "rented" | undefined;
};
export declare const isSearchResult: (value: unknown) => value is {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    type: "house" | "apartment" | "villa" | "office" | "commercial" | "land";
    size: number;
    bedrooms: number;
    bathrooms: number;
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    images: string[];
    agentId: string;
    isFeatured: boolean;
    distance?: number | undefined;
    relevanceScore?: number | undefined;
};
export declare const isSearchSortOption: (value: unknown) => value is "price_asc" | "price_desc" | "date_asc" | "date_desc" | "size_asc" | "size_desc" | "featured_first" | "distance_asc" | "popularity_desc";
export declare const isPriceRange: (value: unknown) => value is {
    min: number;
    max: number;
};
export declare const isSizeRange: (value: unknown) => value is {
    min: number;
    max: number;
    unit: "sqm" | "sqft" | "acre";
};
export declare const isYearRange: (value: unknown) => value is {
    min: number;
    max: number;
};
export declare const isAlert: (value: unknown) => value is {
    id: string;
    userId: string;
    type: "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing";
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    isRead: boolean;
    isDismissed: boolean;
    createdAt: Date;
    updatedAt: Date;
    relatedEntityId?: string | undefined;
    relatedEntityType?: "user" | "agent" | "system" | "listing" | "booking" | undefined;
    actionUrl?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: Date | undefined;
};
export declare const isCreateAlertInput: (value: unknown) => value is {
    userId: string;
    type: "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing";
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    relatedEntityId?: string | undefined;
    relatedEntityType?: "user" | "agent" | "system" | "listing" | "booking" | undefined;
    actionUrl?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: Date | undefined;
};
export declare const isAlertFilters: (value: unknown) => value is {
    userId?: string | undefined;
    type?: "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing" | undefined;
    priority?: "low" | "medium" | "high" | "critical" | undefined;
    isRead?: boolean | undefined;
    isDismissed?: boolean | undefined;
    createdAfter?: Date | undefined;
    createdBefore?: Date | undefined;
    relatedEntityType?: "user" | "agent" | "system" | "listing" | "booking" | undefined;
};
export declare const isAlertType: (value: unknown) => value is "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing";
export declare const isAlertPriority: (value: unknown) => value is "low" | "medium" | "high" | "critical";
export declare const isNotificationPreferences: (value: unknown) => value is {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
    frequency: "immediate" | "daily" | "weekly";
    types?: Record<"price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing", boolean> | undefined;
};
export declare const isContactForm: (value: unknown) => value is {
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "bg" | "ru";
    isSpam: boolean;
    id?: string | undefined;
    phone?: string | undefined;
    listingId?: string | undefined;
    agentId?: string | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    createdAt?: Date | undefined;
    respondedAt?: Date | undefined;
    responseMessage?: string | undefined;
};
export declare const isExtendedContactForm: (value: unknown) => value is {
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "bg" | "ru";
    isSpam: boolean;
    category: "general" | "listing_inquiry" | "agent_inquiry" | "technical_support" | "business_partnership" | "media_inquiry" | "careers" | "feedback";
    urgency: "low" | "medium" | "high";
    preferredContactMethod: "email" | "phone" | "both";
    id?: string | undefined;
    phone?: string | undefined;
    listingId?: string | undefined;
    agentId?: string | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    createdAt?: Date | undefined;
    respondedAt?: Date | undefined;
    responseMessage?: string | undefined;
    bestTimeToContact?: "morning" | "afternoon" | "evening" | "any" | undefined;
    budget?: {
        min: number;
        max: number;
        currency: string;
    } | undefined;
    timeline?: "immediate" | "within_month" | "within_3_months" | "within_6_months" | "flexible" | undefined;
};
export declare const isNewsletterSubscription: (value: unknown) => value is {
    email: string;
    language: "en" | "bg" | "ru";
    isActive: boolean;
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    interests?: string[] | undefined;
    unsubscribeToken?: string | undefined;
    subscribedAt?: Date | undefined;
    unsubscribedAt?: Date | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    preferences?: {
        frequency: "immediate" | "daily" | "weekly" | "monthly";
        categories?: string[] | undefined;
    } | undefined;
};
export declare const isContactFormFilters: (value: unknown) => value is {
    category?: "general" | "listing_inquiry" | "agent_inquiry" | "technical_support" | "business_partnership" | "media_inquiry" | "careers" | "feedback" | undefined;
    status?: "pending" | "responded" | "spam" | "closed" | undefined;
    language?: "en" | "bg" | "ru" | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    hasListingId?: boolean | undefined;
    hasAgentId?: boolean | undefined;
};
export declare const isSubscriptionFilters: (value: unknown) => value is {
    language?: "en" | "bg" | "ru" | undefined;
    isActive?: boolean | undefined;
    subscribedAfter?: Date | undefined;
    subscribedBefore?: Date | undefined;
    interests?: string[] | undefined;
};
export declare const isContactLanguage: (value: unknown) => value is "en" | "bg" | "ru";
export declare const isContactCategory: (value: unknown) => value is "general" | "listing_inquiry" | "agent_inquiry" | "technical_support" | "business_partnership" | "media_inquiry" | "careers" | "feedback";
export declare const isContactUrgency: (value: unknown) => value is "low" | "medium" | "high";
export declare const isContactMethod: (value: unknown) => value is "email" | "phone" | "both";
export declare const isBestTime: (value: unknown) => value is "morning" | "afternoon" | "evening" | "any";
export declare const isTimeline: (value: unknown) => value is "immediate" | "within_month" | "within_3_months" | "within_6_months" | "flexible";
export declare const isBudget: (value: unknown) => value is {
    min: number;
    max: number;
    currency: string;
};
export declare const validateMultilingualText: (value: unknown) => {
    en: string;
    bg: string;
    ru: string;
};
export declare const validateCurrency: (value: unknown) => "BGN" | "EUR" | "USD";
export declare const validateLanguage: (value: unknown) => "en" | "bg" | "ru";
export declare const validateListing: (value: unknown) => {
    id: string;
    slug: string;
    title: {
        en: string;
        bg: string;
        ru: string;
    };
    description: {
        en: string;
        bg: string;
        ru: string;
    };
    shortDescription: {
        en: string;
        bg: string;
        ru: string;
    };
    price: number;
    currency: "BGN" | "EUR" | "USD";
    type: "house" | "apartment" | "villa" | "office" | "commercial" | "land";
    status: "pending" | "active" | "sold" | "rented" | "inactive";
    specifications: {
        bedrooms: number;
        bathrooms: number;
        size: number;
        hasGarage: boolean;
        yearBuilt?: number | undefined;
        floors?: number | undefined;
        floor?: number | undefined;
        parkingSpaces?: number | undefined;
        energyRating?: string | undefined;
        constructionType?: string | undefined;
    };
    features: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[];
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    images: {
        id: string;
        url: string;
        width: number;
        height: number;
        order: number;
        alt?: string | undefined;
    }[];
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isFeatured: boolean;
    isActive: boolean;
    metaTitle?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    metaDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
};
export declare const validateAgent: (value: unknown) => {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    biography: {
        en: string;
        bg: string;
        ru: string;
    };
    specializations: string[];
    languages: string[];
    isActive: boolean;
    isVerified: boolean;
    experienceYears: number;
    listingsCount: number;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | undefined;
    licenseNumber?: string | undefined;
    performanceMetrics?: {
        responseRate: number;
        averageResponseTime: number;
        listingsSold: number;
        listingsRented: number;
        averageRating: number;
        reviewCount: number;
        totalListings: number;
        successfulTransactions: number;
    } | undefined;
    socialMedia?: {
        facebook?: string | undefined;
        instagram?: string | undefined;
        linkedin?: string | undefined;
    } | undefined;
};
export declare const validateUser: (value: unknown) => {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "agent" | "admin" | "superadmin";
    preferences: {
        language: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
        savedSearches: boolean;
        newsletter: boolean;
        marketingEmails: boolean;
    };
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
    avatar?: string | undefined;
    lastLoginAt?: Date | undefined;
};
export declare const validateBooking: (value: unknown) => {
    id: string;
    listingId: string;
    agentId: string;
    contactInfo: {
        name: string;
        email: string;
        phone: string;
        preferredLanguage: string;
        notes?: string | undefined;
    };
    visitType: "viewing" | "valuation" | "consultation" | "inspection";
    status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled";
    scheduledAt: Date;
    duration: number;
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    reminderSent: boolean;
    confirmationSent: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId?: string | undefined;
    specialRequests?: string | undefined;
};
export declare const validateAlert: (value: unknown) => {
    id: string;
    userId: string;
    type: "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing";
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    isRead: boolean;
    isDismissed: boolean;
    createdAt: Date;
    updatedAt: Date;
    relatedEntityId?: string | undefined;
    relatedEntityType?: "user" | "agent" | "system" | "listing" | "booking" | undefined;
    actionUrl?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: Date | undefined;
};
export declare const validateContactForm: (value: unknown) => {
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "bg" | "ru";
    isSpam: boolean;
    id?: string | undefined;
    phone?: string | undefined;
    listingId?: string | undefined;
    agentId?: string | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    createdAt?: Date | undefined;
    respondedAt?: Date | undefined;
    responseMessage?: string | undefined;
};
export declare const validateNewsletterSubscription: (value: unknown) => {
    email: string;
    language: "en" | "bg" | "ru";
    isActive: boolean;
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    interests?: string[] | undefined;
    unsubscribeToken?: string | undefined;
    subscribedAt?: Date | undefined;
    unsubscribedAt?: Date | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    preferences?: {
        frequency: "immediate" | "daily" | "weekly" | "monthly";
        categories?: string[] | undefined;
    } | undefined;
};
export declare const safeValidateMultilingualText: (value: unknown) => z.ZodSafeParseResult<{
    en: string;
    bg: string;
    ru: string;
}>;
export declare const safeValidateCurrency: (value: unknown) => z.ZodSafeParseResult<"BGN" | "EUR" | "USD">;
export declare const safeValidateLanguage: (value: unknown) => z.ZodSafeParseResult<"en" | "bg" | "ru">;
export declare const safeValidateListing: (value: unknown) => z.ZodSafeParseResult<{
    id: string;
    slug: string;
    title: {
        en: string;
        bg: string;
        ru: string;
    };
    description: {
        en: string;
        bg: string;
        ru: string;
    };
    shortDescription: {
        en: string;
        bg: string;
        ru: string;
    };
    price: number;
    currency: "BGN" | "EUR" | "USD";
    type: "house" | "apartment" | "villa" | "office" | "commercial" | "land";
    status: "pending" | "active" | "sold" | "rented" | "inactive";
    specifications: {
        bedrooms: number;
        bathrooms: number;
        size: number;
        hasGarage: boolean;
        yearBuilt?: number | undefined;
        floors?: number | undefined;
        floor?: number | undefined;
        parkingSpaces?: number | undefined;
        energyRating?: string | undefined;
        constructionType?: string | undefined;
    };
    features: ("balcony" | "garden" | "parking" | "pool" | "elevator" | "air_conditioning" | "heating" | "security_system" | "internet" | "furnished" | "pets_allowed")[];
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    images: {
        id: string;
        url: string;
        width: number;
        height: number;
        order: number;
        alt?: string | undefined;
    }[];
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    isFeatured: boolean;
    isActive: boolean;
    metaTitle?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
    metaDescription?: {
        en: string;
        bg: string;
        ru: string;
    } | undefined;
}>;
export declare const safeValidateAgent: (value: unknown) => z.ZodSafeParseResult<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    biography: {
        en: string;
        bg: string;
        ru: string;
    };
    specializations: string[];
    languages: string[];
    isActive: boolean;
    isVerified: boolean;
    experienceYears: number;
    listingsCount: number;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | undefined;
    licenseNumber?: string | undefined;
    performanceMetrics?: {
        responseRate: number;
        averageResponseTime: number;
        listingsSold: number;
        listingsRented: number;
        averageRating: number;
        reviewCount: number;
        totalListings: number;
        successfulTransactions: number;
    } | undefined;
    socialMedia?: {
        facebook?: string | undefined;
        instagram?: string | undefined;
        linkedin?: string | undefined;
    } | undefined;
}>;
export declare const safeValidateUser: (value: unknown) => z.ZodSafeParseResult<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "agent" | "admin" | "superadmin";
    preferences: {
        language: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
        savedSearches: boolean;
        newsletter: boolean;
        marketingEmails: boolean;
    };
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
    avatar?: string | undefined;
    lastLoginAt?: Date | undefined;
}>;
export declare const safeValidateBooking: (value: unknown) => z.ZodSafeParseResult<{
    id: string;
    listingId: string;
    agentId: string;
    contactInfo: {
        name: string;
        email: string;
        phone: string;
        preferredLanguage: string;
        notes?: string | undefined;
    };
    visitType: "viewing" | "valuation" | "consultation" | "inspection";
    status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "rescheduled";
    scheduledAt: Date;
    duration: number;
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        localizedNames: {
            en: string;
            bg: string;
            ru: string;
        };
        neighborhood?: string | undefined;
    };
    reminderSent: boolean;
    confirmationSent: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId?: string | undefined;
    specialRequests?: string | undefined;
}>;
export declare const safeValidateAlert: (value: unknown) => z.ZodSafeParseResult<{
    id: string;
    userId: string;
    type: "price_change" | "new_listing" | "status_change" | "saved_search" | "booking_update" | "system" | "marketing";
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    isRead: boolean;
    isDismissed: boolean;
    createdAt: Date;
    updatedAt: Date;
    relatedEntityId?: string | undefined;
    relatedEntityType?: "user" | "agent" | "system" | "listing" | "booking" | undefined;
    actionUrl?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: Date | undefined;
}>;
export declare const safeValidateContactForm: (value: unknown) => z.ZodSafeParseResult<{
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "bg" | "ru";
    isSpam: boolean;
    id?: string | undefined;
    phone?: string | undefined;
    listingId?: string | undefined;
    agentId?: string | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    createdAt?: Date | undefined;
    respondedAt?: Date | undefined;
    responseMessage?: string | undefined;
}>;
export declare const safeValidateNewsletterSubscription: (value: unknown) => z.ZodSafeParseResult<{
    email: string;
    language: "en" | "bg" | "ru";
    isActive: boolean;
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    interests?: string[] | undefined;
    unsubscribeToken?: string | undefined;
    subscribedAt?: Date | undefined;
    unsubscribedAt?: Date | undefined;
    source?: string | undefined;
    ipAddress?: string | undefined;
    preferences?: {
        frequency: "immediate" | "daily" | "weekly" | "monthly";
        categories?: string[] | undefined;
    } | undefined;
}>;
/**
 * Utility function to validate array of objects
 * @param items - Array of items to validate
 * @param typeGuard - Type guard function to use for validation
 * @returns Array of validation results
 */
export declare const validateArray: <T>(items: unknown[], typeGuard: (item: unknown) => item is T) => {
    valid: T[];
    invalid: unknown[];
};
/**
 * Utility function to validate object with specific properties
 * @param obj - Object to validate
 * @param requiredProps - Array of required property names
 * @returns true if object has all required properties
 */
export declare const hasRequiredProperties: (obj: unknown, requiredProps: string[]) => obj is Record<string, unknown>;
/**
 * Type guard for partial object validation
 * Validates that an object contains at least the specified properties
 * @param obj - Object to validate
 * @param partialSchema - Zod schema for partial validation
 * @returns true if object matches partial schema
 */
export declare const isPartial: <T>(obj: unknown, partialSchema: z.ZodSchema<Partial<T>>) => obj is Partial<T>;
//# sourceMappingURL=typeGuards.d.ts.map