"use strict";
/**
 * Zod schemas for booking and appointment validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSortOptionSchema = exports.BookingFiltersSchema = exports.AvailableSlotsSchema = exports.UpdateBookingInputSchema = exports.CreateBookingInputSchema = exports.BookingSchema = exports.ContactInfoSchema = exports.TimeSlotSchema = exports.BookingStatusSchema = exports.VisitTypeSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
/**
 * Zod schema for visit type enum
 */
exports.VisitTypeSchema = zod_1.z.enum([
    'viewing',
    'valuation',
    'consultation',
    'inspection'
]);
/**
 * Zod schema for booking status enum
 */
exports.BookingStatusSchema = zod_1.z.enum([
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
exports.TimeSlotSchema = zod_1.z.object({
    start: zod_1.z.date(),
    end: zod_1.z.date(),
    duration: zod_1.z.number().positive().int() // minutes
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
exports.ContactInfoSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string()
        .regex(/^\+?[\d\s\-\(\)]{8,}$/, "Invalid phone format")
        .min(8, "Phone must be at least 8 characters"),
    preferredLanguage: zod_1.z.string().min(2, "Language code must be at least 2 characters"),
    notes: zod_1.z.string().optional()
});
/**
 * Zod schema for booking validation
 */
exports.BookingSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    listingId: zod_1.z.string().uuid(),
    agentId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid().optional(),
    contactInfo: exports.ContactInfoSchema,
    visitType: exports.VisitTypeSchema,
    status: exports.BookingStatusSchema,
    scheduledAt: zod_1.z.date().min(new Date(), "Scheduled date must be in the future"),
    duration: zod_1.z.number().positive().int().min(15, "Duration must be at least 15 minutes"),
    location: common_1.LocationSchema,
    specialRequests: zod_1.z.string().optional(),
    reminderSent: zod_1.z.boolean().default(false),
    confirmationSent: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date())
});
/**
 * Zod schema for creating new bookings
 */
exports.CreateBookingInputSchema = zod_1.z.object({
    listingId: zod_1.z.string().uuid(),
    agentId: zod_1.z.string().uuid(),
    contactInfo: exports.ContactInfoSchema,
    visitType: exports.VisitTypeSchema,
    scheduledAt: zod_1.z.date().min(new Date(), "Scheduled date must be in the future"),
    duration: zod_1.z.number().positive().int().min(15, "Duration must be at least 15 minutes"),
    specialRequests: zod_1.z.string().optional()
});
/**
 * Zod schema for updating existing bookings
 */
exports.UpdateBookingInputSchema = zod_1.z.object({
    listingId: zod_1.z.string().uuid().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    contactInfo: exports.ContactInfoSchema.partial().optional(),
    visitType: exports.VisitTypeSchema.optional(),
    scheduledAt: zod_1.z.date().min(new Date(), "Scheduled date must be in the future").optional(),
    duration: zod_1.z.number().positive().int().min(15).optional(),
    specialRequests: zod_1.z.string().optional(),
    status: exports.BookingStatusSchema.optional()
});
/**
 * Zod schema for available time slots
 */
exports.AvailableSlotsSchema = zod_1.z.object({
    date: zod_1.z.date(),
    slots: zod_1.z.array(exports.TimeSlotSchema),
    agentId: zod_1.z.string().uuid(),
    listingId: zod_1.z.string().uuid()
});
/**
 * Zod schema for booking search filters
 */
exports.BookingFiltersSchema = zod_1.z.object({
    listingId: zod_1.z.string().uuid().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid().optional(),
    visitType: exports.VisitTypeSchema.optional(),
    status: exports.BookingStatusSchema.optional(),
    dateFrom: zod_1.z.date().optional(),
    dateTo: zod_1.z.date().optional()
});
/**
 * Zod schema for booking sort options
 */
exports.BookingSortOptionSchema = zod_1.z.enum([
    'date_asc',
    'date_desc',
    'status_asc',
    'status_desc',
    'created_asc',
    'created_desc'
]);
//# sourceMappingURL=booking.js.map