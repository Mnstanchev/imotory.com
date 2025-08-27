"use strict";
/**
 * Alert and notification types for user notifications
 * @module types/alert
 * @description
 * Defines all notification-related types including alert categories, priorities,
 * and notification preferences for user communication across the platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertSortOption = exports.AlertPriority = exports.AlertType = void 0;
/**
 * Types of alerts that can be sent to users
 * @enum {string} AlertType
 * @description Categories of notifications users can receive based on their preferences
 * @property {string} PRICE_CHANGE - Notifications when property prices change
 * @property {string} NEW_LISTING - Alerts for new properties matching saved searches
 * @property {string} STATUS_CHANGE - Updates when listing status changes (sold, rented, etc.)
 * @property {string} SAVED_SEARCH - New results for saved search criteria
 * @property {string} BOOKING_UPDATE - Updates on appointment bookings and scheduling
 * @property {string} SYSTEM - Important system announcements and updates
 * @property {string} MARKETING - Marketing and promotional communications
 */
var AlertType;
(function (AlertType) {
    AlertType["PRICE_CHANGE"] = "price_change";
    AlertType["NEW_LISTING"] = "new_listing";
    AlertType["STATUS_CHANGE"] = "status_change";
    AlertType["SAVED_SEARCH"] = "saved_search";
    AlertType["BOOKING_UPDATE"] = "booking_update";
    AlertType["SYSTEM"] = "system";
    AlertType["MARKETING"] = "marketing";
})(AlertType || (exports.AlertType = AlertType = {}));
/**
 * Priority levels for alerts
 * @enum {string} AlertPriority
 * @description Urgency levels for user notifications and system alerts
 * @property {string} LOW - Low priority, informational notifications
 * @property {string} MEDIUM - Medium priority, important updates
 * @property {string} HIGH - High priority, requires attention
 * @property {string} CRITICAL - Critical priority, immediate action required
 */
var AlertPriority;
(function (AlertPriority) {
    AlertPriority["LOW"] = "low";
    AlertPriority["MEDIUM"] = "medium";
    AlertPriority["HIGH"] = "high";
    AlertPriority["CRITICAL"] = "critical";
})(AlertPriority || (exports.AlertPriority = AlertPriority = {}));
/**
 * Alert sort options
 * @enum {string} AlertSortOption
 * @description Available sorting options for alert listings
 * @property {string} DATE_DESC - Sort by creation date descending (newest first)
 * @property {string} DATE_ASC - Sort by creation date ascending (oldest first)
 * @property {string} PRIORITY_DESC - Sort by priority descending (critical first)
 * @property {string} PRIORITY_ASC - Sort by priority ascending (low first)
 * @property {string} TYPE - Group by alert type
 * @property {string} UNREAD_FIRST - Prioritize unread alerts
 */
var AlertSortOption;
(function (AlertSortOption) {
    AlertSortOption["DATE_DESC"] = "date_desc";
    AlertSortOption["DATE_ASC"] = "date_asc";
    AlertSortOption["PRIORITY_DESC"] = "priority_desc";
    AlertSortOption["PRIORITY_ASC"] = "priority_asc";
    AlertSortOption["TYPE"] = "type";
    AlertSortOption["UNREAD_FIRST"] = "unread_first";
})(AlertSortOption || (exports.AlertSortOption = AlertSortOption = {}));
//# sourceMappingURL=alert.js.map