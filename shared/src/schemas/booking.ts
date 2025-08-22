/**
 * Zod schemas for booking and appointment validation
 */

import { z } from 'zod';
import { LocationSchema } from './common';

/**
 * Zod schema for visit type enum
 */
export const VisitTypeSchema = z.enum([
  'viewing',
  'valuation',
  'consultation',
  'inspection'
]);

/**
 * Zod schema for booking status enum
 */
export const BookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
  'rescheduled'
]);

/**
 * Zod schema for time slot validation
 */
export const TimeSlotSchema = z.object({
  start: z.date(),
  end: z.date(),
  duration: z.number().positive().int() // minutes
}).refine(data => data.end > data.start, {
  message: "End time must be after start time"
}).refine(data => {
  const expectedEnd = new Date(data.start.getTime() + data.duration * 60000);
  return Math.abs(data.end.getTime() - expectedEnd.getTime()) < 60000; // within 1 minute tolerance
}, {
  message: "Duration must match start and end times"
});

/**
 * Zod schema for contact information validation
 */
export const ContactInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]{8,}$/, "Invalid phone format")
    .min(8, "Phone must be at least 8 characters"),
  preferredLanguage: z.string().min(2, "Language code must be at least 2 characters"),
  notes: z.string().optional()
});

/**
 * Zod schema for booking validation
 */
export const BookingSchema = z.object({
  id: z.string().uuid(),
  listingId: z.string().uuid(),
  agentId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  contactInfo: ContactInfoSchema,
  visitType: VisitTypeSchema,
  status: BookingStatusSchema,
  scheduledAt: z.date().min(new Date(), "Scheduled date must be in the future"),
  duration: z.number().positive().int().min(15, "Duration must be at least 15 minutes"),
  location: LocationSchema,
  specialRequests: z.string().optional(),
  reminderSent: z.boolean().default(false),
  confirmationSent: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

/**
 * Zod schema for creating new bookings
 */
export const CreateBookingInputSchema = z.object({
  listingId: z.string().uuid(),
  agentId: z.string().uuid(),
  contactInfo: ContactInfoSchema,
  visitType: VisitTypeSchema,
  scheduledAt: z.date().min(new Date(), "Scheduled date must be in the future"),
  duration: z.number().positive().int().min(15, "Duration must be at least 15 minutes"),
  specialRequests: z.string().optional()
});

/**
 * Zod schema for updating existing bookings
 */
export const UpdateBookingInputSchema = z.object({
  listingId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  contactInfo: ContactInfoSchema.partial().optional(),
  visitType: VisitTypeSchema.optional(),
  scheduledAt: z.date().min(new Date(), "Scheduled date must be in the future").optional(),
  duration: z.number().positive().int().min(15).optional(),
  specialRequests: z.string().optional(),
  status: BookingStatusSchema.optional()
});

/**
 * Zod schema for available time slots
 */
export const AvailableSlotsSchema = z.object({
  date: z.date(),
  slots: z.array(TimeSlotSchema),
  agentId: z.string().uuid(),
  listingId: z.string().uuid()
});

/**
 * Zod schema for booking search filters
 */
export const BookingFiltersSchema = z.object({
  listingId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  visitType: VisitTypeSchema.optional(),
  status: BookingStatusSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional()
});

/**
 * Zod schema for booking sort options
 */
export const BookingSortOptionSchema = z.enum([
  'date_asc',
  'date_desc',
  'status_asc',
  'status_desc',
  'created_asc',
  'created_desc'
]);

