"use strict";
/**
 * Zod schemas for alert and notification validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertSortOptionSchema = exports.AlertFiltersSchema = exports.CreateAlertInputSchema = exports.AlertSchema = exports.NotificationPreferencesSchema = exports.AlertPrioritySchema = exports.AlertTypeSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for alert type enum
 */
exports.AlertTypeSchema = zod_1.z.enum([
    'price_change',
    'new_listing',
    'status_change',
    'saved_search',
    'booking_update',
    'system',
    'marketing'
]);
/**
 * Zod schema for alert priority enum
 */
exports.AlertPrioritySchema = zod_1.z.enum([
    'low',
    'medium',
    'high',
    'critical'
]);
/**
 * Zod schema for notification preferences
 */
exports.NotificationPreferencesSchema = zod_1.z.object({
    email: zod_1.z.boolean().default(true),
    sms: zod_1.z.boolean().default(false),
    push: zod_1.z.boolean().default(true),
    inApp: zod_1.z.boolean().default(true),
    frequency: zod_1.z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
    types: zod_1.z.record(exports.AlertTypeSchema, zod_1.z.boolean()).optional()
});
/**
 * Zod schema for alert validation
 */
exports.AlertSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    type: exports.AlertTypeSchema,
    title: zod_1.z.string().min(1, "Title is required").max(200, "Title too long"),
    message: zod_1.z.string().min(1, "Message is required").max(2000, "Message too long"),
    priority: exports.AlertPrioritySchema,
    isRead: zod_1.z.boolean().default(false),
    isDismissed: zod_1.z.boolean().default(false),
    relatedEntityId: zod_1.z.string().uuid().optional(),
    relatedEntityType: zod_1.z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional(),
    actionUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    expiresAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date())
});
/**
 * Zod schema for creating new alerts
 */
exports.CreateAlertInputSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    type: exports.AlertTypeSchema,
    title: zod_1.z.string().min(1, "Title is required").max(200, "Title too long"),
    message: zod_1.z.string().min(1, "Message is required").max(2000, "Message too long"),
    priority: exports.AlertPrioritySchema,
    relatedEntityId: zod_1.z.string().uuid().optional(),
    relatedEntityType: zod_1.z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional(),
    actionUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    expiresAt: zod_1.z.date().optional()
});
/**
 * Zod schema for alert search filters
 */
exports.AlertFiltersSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    type: exports.AlertTypeSchema.optional(),
    priority: exports.AlertPrioritySchema.optional(),
    isRead: zod_1.z.boolean().optional(),
    isDismissed: zod_1.z.boolean().optional(),
    createdAfter: zod_1.z.date().optional(),
    createdBefore: zod_1.z.date().optional(),
    relatedEntityType: zod_1.z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional()
});
/**
 * Zod schema for alert sort options
 */
exports.AlertSortOptionSchema = zod_1.z.enum([
    'date_desc',
    'date_asc',
    'priority_desc',
    'priority_asc',
    'type',
    'unread_first'
]);
//# sourceMappingURL=alert.js.map