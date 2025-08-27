/**
 * Zod schemas for booking and appointment validation
 */
import { z } from 'zod';
/**
 * Zod schema for visit type enum
 */
export declare const VisitTypeSchema: z.ZodEnum<{
    viewing: "viewing";
    valuation: "valuation";
    consultation: "consultation";
    inspection: "inspection";
}>;
/**
 * Zod schema for booking status enum
 */
export declare const BookingStatusSchema: z.ZodEnum<{
    pending: "pending";
    confirmed: "confirmed";
    cancelled: "cancelled";
    completed: "completed";
    no_show: "no_show";
    rescheduled: "rescheduled";
}>;
/**
 * Zod schema for time slot validation
 */
export declare const TimeSlotSchema: z.ZodObject<{
    start: z.ZodDate;
    end: z.ZodDate;
    duration: z.ZodNumber;
}, z.core.$strip>;
/**
 * Zod schema for contact information validation
 */
export declare const ContactInfoSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    preferredLanguage: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Zod schema for booking validation
 */
export declare const BookingSchema: z.ZodObject<{
    id: z.ZodString;
    listingId: z.ZodString;
    agentId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    contactInfo: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        preferredLanguage: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    visitType: z.ZodEnum<{
        viewing: "viewing";
        valuation: "valuation";
        consultation: "consultation";
        inspection: "inspection";
    }>;
    status: z.ZodEnum<{
        pending: "pending";
        confirmed: "confirmed";
        cancelled: "cancelled";
        completed: "completed";
        no_show: "no_show";
        rescheduled: "rescheduled";
    }>;
    scheduledAt: z.ZodDate;
    duration: z.ZodNumber;
    location: z.ZodObject<{
        address: z.ZodString;
        city: z.ZodString;
        neighborhood: z.ZodOptional<z.ZodString>;
        country: z.ZodString;
        coordinates: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>;
        localizedNames: z.ZodObject<{
            en: z.ZodString;
            bg: z.ZodString;
            ru: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    specialRequests: z.ZodOptional<z.ZodString>;
    reminderSent: z.ZodDefault<z.ZodBoolean>;
    confirmationSent: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, z.core.$strip>;
/**
 * Zod schema for creating new bookings
 */
export declare const CreateBookingInputSchema: z.ZodObject<{
    listingId: z.ZodString;
    agentId: z.ZodString;
    contactInfo: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        preferredLanguage: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    visitType: z.ZodEnum<{
        viewing: "viewing";
        valuation: "valuation";
        consultation: "consultation";
        inspection: "inspection";
    }>;
    scheduledAt: z.ZodDate;
    duration: z.ZodNumber;
    specialRequests: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Zod schema for updating existing bookings
 */
export declare const UpdateBookingInputSchema: z.ZodObject<{
    listingId: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    contactInfo: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        preferredLanguage: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    visitType: z.ZodOptional<z.ZodEnum<{
        viewing: "viewing";
        valuation: "valuation";
        consultation: "consultation";
        inspection: "inspection";
    }>>;
    scheduledAt: z.ZodOptional<z.ZodDate>;
    duration: z.ZodOptional<z.ZodNumber>;
    specialRequests: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        confirmed: "confirmed";
        cancelled: "cancelled";
        completed: "completed";
        no_show: "no_show";
        rescheduled: "rescheduled";
    }>>;
}, z.core.$strip>;
/**
 * Zod schema for available time slots
 */
export declare const AvailableSlotsSchema: z.ZodObject<{
    date: z.ZodDate;
    slots: z.ZodArray<z.ZodObject<{
        start: z.ZodDate;
        end: z.ZodDate;
        duration: z.ZodNumber;
    }, z.core.$strip>>;
    agentId: z.ZodString;
    listingId: z.ZodString;
}, z.core.$strip>;
/**
 * Zod schema for booking search filters
 */
export declare const BookingFiltersSchema: z.ZodObject<{
    listingId: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    visitType: z.ZodOptional<z.ZodEnum<{
        viewing: "viewing";
        valuation: "valuation";
        consultation: "consultation";
        inspection: "inspection";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        confirmed: "confirmed";
        cancelled: "cancelled";
        completed: "completed";
        no_show: "no_show";
        rescheduled: "rescheduled";
    }>>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
/**
 * Zod schema for booking sort options
 */
export declare const BookingSortOptionSchema: z.ZodEnum<{
    date_asc: "date_asc";
    date_desc: "date_desc";
    status_asc: "status_asc";
    status_desc: "status_desc";
    created_asc: "created_asc";
    created_desc: "created_desc";
}>;
//# sourceMappingURL=booking.d.ts.map