"use strict";
/**
 * Booking and appointment types for property visits and scheduling
 * @module types/booking
 * @description
 * Defines all types related to property booking appointments including visit types,
 * scheduling, contact information, and booking management interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSortOption = exports.BookingStatus = exports.VisitType = void 0;
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
var VisitType;
(function (VisitType) {
    VisitType["VIEWING"] = "viewing";
    VisitType["VALUATION"] = "valuation";
    VisitType["CONSULTATION"] = "consultation";
    VisitType["INSPECTION"] = "inspection";
})(VisitType || (exports.VisitType = VisitType = {}));
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
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["NO_SHOW"] = "no_show";
    BookingStatus["RESCHEDULED"] = "rescheduled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
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
var BookingSortOption;
(function (BookingSortOption) {
    BookingSortOption["DATE_ASC"] = "date_asc";
    BookingSortOption["DATE_DESC"] = "date_desc";
    BookingSortOption["STATUS_ASC"] = "status_asc";
    BookingSortOption["STATUS_DESC"] = "status_desc";
    BookingSortOption["CREATED_ASC"] = "created_asc";
    BookingSortOption["CREATED_DESC"] = "created_desc";
})(BookingSortOption || (exports.BookingSortOption = BookingSortOption = {}));
//# sourceMappingURL=booking.js.map