/**
 * Zod schemas for alert and notification validation
 */

import { z } from 'zod';

/**
 * Zod schema for alert type enum
 */
export const AlertTypeSchema = z.enum([
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
export const AlertPrioritySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical'
]);

/**
 * Zod schema for notification preferences
 */
export const NotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
  frequency: z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
  types: z.record(AlertTypeSchema, z.boolean()).default({
    price_change: true,
    new_listing: true,
    status_change: true,
    saved_search: true,
    booking_update: true,
    system: true,
    marketing: false
  })
});

/**
 * Zod schema for alert validation
 */
export const AlertSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: AlertTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  priority: AlertPrioritySchema,
  isRead: z.boolean().default(false),
  isDismissed: z.boolean().default(false),
  relatedEntityId: z.string().uuid().optional(),
  relatedEntityType: z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional(),
  actionUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

/**
 * Zod schema for creating new alerts
 */
export const CreateAlertInputSchema = z.object({
  userId: z.string().uuid(),
  type: AlertTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  priority: AlertPrioritySchema,
  relatedEntityId: z.string().uuid().optional(),
  relatedEntityType: z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional(),
  actionUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.date().optional()
});

/**
 * Zod schema for alert search filters
 */
export const AlertFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  type: AlertTypeSchema.optional(),
  priority: AlertPrioritySchema.optional(),
  isRead: z.boolean().optional(),
  isDismissed: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  relatedEntityType: z.enum(['listing', 'user', 'booking', 'agent', 'system']).optional()
});

/**
 * Zod schema for alert sort options
 */
export const AlertSortOptionSchema = z.enum([
  'date_desc',
  'date_asc',
  'priority_desc',
  'priority_asc',
  'type',
  'unread_first'
]);

