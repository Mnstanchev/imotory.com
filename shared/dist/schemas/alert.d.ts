/**
 * Zod schemas for alert and notification validation
 */
import { z } from 'zod';
/**
 * Zod schema for alert type enum
 */
export declare const AlertTypeSchema: z.ZodEnum<{
    price_change: "price_change";
    new_listing: "new_listing";
    status_change: "status_change";
    saved_search: "saved_search";
    booking_update: "booking_update";
    system: "system";
    marketing: "marketing";
}>;
/**
 * Zod schema for alert priority enum
 */
export declare const AlertPrioritySchema: z.ZodEnum<{
    low: "low";
    medium: "medium";
    high: "high";
    critical: "critical";
}>;
/**
 * Zod schema for notification preferences
 */
export declare const NotificationPreferencesSchema: z.ZodObject<{
    email: z.ZodDefault<z.ZodBoolean>;
    sms: z.ZodDefault<z.ZodBoolean>;
    push: z.ZodDefault<z.ZodBoolean>;
    inApp: z.ZodDefault<z.ZodBoolean>;
    frequency: z.ZodDefault<z.ZodEnum<{
        immediate: "immediate";
        daily: "daily";
        weekly: "weekly";
    }>>;
    types: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        price_change: "price_change";
        new_listing: "new_listing";
        status_change: "status_change";
        saved_search: "saved_search";
        booking_update: "booking_update";
        system: "system";
        marketing: "marketing";
    }>, z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Zod schema for alert validation
 */
export declare const AlertSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<{
        price_change: "price_change";
        new_listing: "new_listing";
        status_change: "status_change";
        saved_search: "saved_search";
        booking_update: "booking_update";
        system: "system";
        marketing: "marketing";
    }>;
    title: z.ZodString;
    message: z.ZodString;
    priority: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        critical: "critical";
    }>;
    isRead: z.ZodDefault<z.ZodBoolean>;
    isDismissed: z.ZodDefault<z.ZodBoolean>;
    relatedEntityId: z.ZodOptional<z.ZodString>;
    relatedEntityType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        agent: "agent";
        system: "system";
        listing: "listing";
        booking: "booking";
    }>>;
    actionUrl: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, z.core.$strip>;
/**
 * Zod schema for creating new alerts
 */
export declare const CreateAlertInputSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodEnum<{
        price_change: "price_change";
        new_listing: "new_listing";
        status_change: "status_change";
        saved_search: "saved_search";
        booking_update: "booking_update";
        system: "system";
        marketing: "marketing";
    }>;
    title: z.ZodString;
    message: z.ZodString;
    priority: z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        critical: "critical";
    }>;
    relatedEntityId: z.ZodOptional<z.ZodString>;
    relatedEntityType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        agent: "agent";
        system: "system";
        listing: "listing";
        booking: "booking";
    }>>;
    actionUrl: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    expiresAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
/**
 * Zod schema for alert search filters
 */
export declare const AlertFiltersSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        price_change: "price_change";
        new_listing: "new_listing";
        status_change: "status_change";
        saved_search: "saved_search";
        booking_update: "booking_update";
        system: "system";
        marketing: "marketing";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        critical: "critical";
    }>>;
    isRead: z.ZodOptional<z.ZodBoolean>;
    isDismissed: z.ZodOptional<z.ZodBoolean>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
    relatedEntityType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        agent: "agent";
        system: "system";
        listing: "listing";
        booking: "booking";
    }>>;
}, z.core.$strip>;
/**
 * Zod schema for alert sort options
 */
export declare const AlertSortOptionSchema: z.ZodEnum<{
    date_asc: "date_asc";
    date_desc: "date_desc";
    priority_desc: "priority_desc";
    priority_asc: "priority_asc";
    type: "type";
    unread_first: "unread_first";
}>;
//# sourceMappingURL=alert.d.ts.map