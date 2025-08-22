/**
 * Booking and appointment types for property visits and scheduling
 * @module types/booking
 * @description
 * Defines all types related to property booking appointments including visit types,
 * scheduling, contact information, and booking management interfaces.
 */

import { Location } from './common';

/**
 * Types of property visits that can be scheduled
 * @enum {string} VisitType
 * @description Available appointment types for property-related activities
 * @property {string} VIEWING - Standard property viewing for potential buyers/renters
 * @property {string} VALUATION - Property valuation and pricing consultation
 * @property {string} CONSULTATION - General real estate consultation and advice
 * @property {string} INSPECTION - Detailed property inspection for condition assessment
 * @example
 * ```typescript
 * const visitType: VisitType = VisitType.VIEWING;
 * ```
 */
export enum VisitType {
  VIEWING = 'viewing',
  VALUATION = 'valuation',
  CONSULTATION = 'consultation',
  INSPECTION = 'inspection'
}

/**
 * Status of booking appointments
 * @enum {string} BookingStatus
 * @description Lifecycle status for booking appointments
 * @property {string} PENDING - Awaiting confirmation from agent
 * @property {string} CONFIRMED - Appointment confirmed and scheduled
 * @property {string} CANCELLED - Appointment cancelled by user or agent
 * @property {string} COMPLETED - Appointment successfully completed
 * @property {string} NO_SHOW - User did not attend scheduled appointment
 * @property {string} RESCHEDULED - Appointment rescheduled to new time
 * @example
 * ```typescript
 * const status: BookingStatus = BookingStatus.CONFIRMED;
 * ```
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

/**
 * Time slot for scheduling appointments
 * @interface TimeSlot
 * @description Available time window for booking appointments
 * @property {Date} start - Start time of the appointment slot
 * @property {Date} end - End time of the appointment slot
 * @property {number} duration - Duration in minutes
 * @example
 * ```typescript
 * const slot: TimeSlot = {
 *   start: new Date('2024-12-25T10:00:00Z'),
 *   end: new Date('2024-12-25T11:00:00Z'),
 *   duration: 60
 * };
 * ```
 */
export interface TimeSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

/**
 * Contact information for booking appointments
 * @interface ContactInfo
 * @description Contact details for appointment attendees
 * @property {string} name - Full name of the person attending
 * @property {string} email - Email address for communication
 * @property {string} phone - Phone number for contact
 * @property {string} preferredLanguage - Preferred language for communication ('en', 'bg', 'ru')
 * @property {string} [notes] - Additional notes or special requirements
 * @example
 * ```typescript
 * const contact: ContactInfo = {
 *   name: 'John Smith',
 *   email: 'john@example.com',
 *   phone: '+359888123456',
 *   preferredLanguage: 'en',
 *   notes: 'Please bring floor plans if available'
 * };
 * ```
 */
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  notes?: string;
}

/**
 * Property booking/appointment interface
 * @interface Booking
 * @description Complete booking appointment with all details
 * @property {string} id - Unique booking identifier
 * @property {string} listingId - Associated property listing ID
 * @property {string} agentId - Assigned real estate agent ID
 * @property {string} [userId] - User ID for registered users (optional for anonymous bookings)
 * @property {ContactInfo} contactInfo - Contact details of the attendee
 * @property {VisitType} visitType - Type of property visit scheduled
 * @property {BookingStatus} status - Current appointment status
 * @property {Date} scheduledAt - Scheduled appointment time
 * @property {number} duration - Appointment duration in minutes
 * @property {Location} location - Property location for the appointment
 * @property {string} [specialRequests] - Any special requests or notes
 * @property {boolean} reminderSent - Whether reminder notification was sent
 * @property {boolean} confirmationSent - Whether confirmation was sent
 * @property {Date} createdAt - Booking creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @example
 * ```typescript
 * const booking: Booking = {
 *   id: 'booking-123',
 *   listingId: 'listing-456',
 *   agentId: 'agent-789',
 *   userId: 'user-101',
 *   contactInfo: {
 *     name: 'Maria Ivanova',
 *     email: 'maria@example.com',
 *     phone: '+359888123456',
 *     preferredLanguage: 'bg'
 *   },
 *   visitType: VisitType.VIEWING,
 *   status: BookingStatus.CONFIRMED,
 *   scheduledAt: new Date('2024-12-25T14:00:00Z'),
 *   duration: 60,
 *   location: {
 *     address: '123 Main St, Sofia',
 *     city: 'Sofia',
 *     country: 'Bulgaria',
 *     coordinates: { latitude: 42.6977, longitude: 23.3219 }
 *   },
 *   reminderSent: true,
 *   confirmationSent: true,
 *   createdAt: new Date('2024-12-20T10:00:00Z'),
 *   updatedAt: new Date('2024-12-24T15:30:00Z')
 * };
 * ```
 */
export interface Booking {
  id: string;
  listingId: string;
  agentId: string;
  userId?: string; // Optional for anonymous bookings
  contactInfo: ContactInfo;
  visitType: VisitType;
  status: BookingStatus;
  scheduledAt: Date;
  duration: number; // in minutes
  location: Location;
  specialRequests?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating new bookings
 * @interface CreateBookingInput
 * @description Input structure for creating new booking appointments
 * @property {string} listingId - Property listing to book
 * @property {string} agentId - Agent assigned to the booking
 * @property {ContactInfo} contactInfo - Attendee contact information
 * @property {VisitType} visitType - Type of visit scheduled
 * @property {Date} scheduledAt - Preferred appointment time
 * @property {number} duration - Requested duration in minutes
 * @property {string} [specialRequests] - Special requirements or notes
 * @example
 * ```typescript
 * const createBooking: CreateBookingInput = {
 *   listingId: 'listing-456',
 *   agentId: 'agent-789',
 *   contactInfo: {
 *     name: 'Peter Petrov',
 *     email: 'peter@example.com',
 *     phone: '+359899111222',
 *     preferredLanguage: 'bg'
 *   },
 *   visitType: VisitType.VIEWING,
 *   scheduledAt: new Date('2024-12-25T15:00:00Z'),
 *   duration: 60,
 *   specialRequests: 'Please arrange for building amenities tour'
 * };
 * ```
 */
export interface CreateBookingInput {
  listingId: string;
  agentId: string;
  contactInfo: ContactInfo;
  visitType: VisitType;
  scheduledAt: Date;
  duration: number;
  specialRequests?: string;
}

/**
 * Input type for updating existing bookings
 * @typedef {Partial<CreateBookingInput> & { status?: BookingStatus }} UpdateBookingInput
 * @description Flexible update structure for existing bookings
 * @property {BookingStatus} [status] - Updated booking status
 */
export type UpdateBookingInput = Partial<CreateBookingInput> & {
  status?: BookingStatus;
};

/**
 * Available time slots for a specific date
 * @interface AvailableSlots
 * @description Available booking slots for a specific date and property
 * @property {Date} date - Date for which slots are available
 * @property {TimeSlot[]} slots - Array of available time slots
 * @property {string} agentId - Agent offering the slots
 * @property {string} listingId - Property listing for the slots
 * @example
 * ```typescript
 * const availableSlots: AvailableSlots = {
 *   date: new Date('2024-12-25'),
 *   slots: [
 *     { start: new Date('2024-12-25T10:00:00Z'), end: new Date('2024-12-25T11:00:00Z'), duration: 60 },
 *     { start: new Date('2024-12-25T14:00:00Z'), end: new Date('2024-12-25T15:00:00Z'), duration: 60 }
 *   ],
 *   agentId: 'agent-789',
 *   listingId: 'listing-456'
 * };
 * ```
 */
export interface AvailableSlots {
  date: Date;
  slots: TimeSlot[];
  agentId: string;
  listingId: string;
}

/**
 * Booking search filters
 * @interface BookingFilters
 * @description Comprehensive filtering options for booking searches
 * @property {string} [listingId] - Filter by property listing
 * @property {string} [agentId] - Filter by assigned agent
 * @property {string} [userId] - Filter by user ID
 * @property {VisitType} [visitType] - Filter by visit type
 * @property {BookingStatus} [status] - Filter by booking status
 * @property {Date} [dateFrom] - Filter bookings after this date
 * @property {Date} [dateTo] - Filter bookings before this date
 * @example
 * ```typescript
 * const filters: BookingFilters = {
 *   agentId: 'agent-789',
 *   status: BookingStatus.CONFIRMED,
 *   dateFrom: new Date('2024-12-01'),
 *   dateTo: new Date('2024-12-31')
 * };
 * ```
 */
export interface BookingFilters {
  listingId?: string;
  agentId?: string;
  userId?: string;
  visitType?: VisitType;
  status?: BookingStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Booking sort options
 * @enum {string} BookingSortOption
 * @description Available sorting options for booking listings
 * @property {string} DATE_ASC - Sort by date ascending
 * @property {string} DATE_DESC - Sort by date descending
 * @property {string} STATUS_ASC - Sort by status ascending
 * @property {string} STATUS_DESC - Sort by status descending
 * @property {string} CREATED_ASC - Sort by creation date ascending
 * @property {string} CREATED_DESC - Sort by creation date descending
 */
export enum BookingSortOption {
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  STATUS_ASC = 'status_asc',
  STATUS_DESC = 'status_desc',
  CREATED_ASC = 'created_asc',
  CREATED_DESC = 'created_desc'
}