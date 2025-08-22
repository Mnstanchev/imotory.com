/**
 * Alert and notification types for user notifications
 * @module types/alert
 * @description
 * Defines all notification-related types including alert categories, priorities,
 * and notification preferences for user communication across the platform.
 */

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
export enum AlertType {
  PRICE_CHANGE = 'price_change',
  NEW_LISTING = 'new_listing',
  STATUS_CHANGE = 'status_change',
  SAVED_SEARCH = 'saved_search',
  BOOKING_UPDATE = 'booking_update',
  SYSTEM = 'system',
  MARKETING = 'marketing'
}

/**
 * Priority levels for alerts
 * @enum {string} AlertPriority
 * @description Urgency levels for user notifications and system alerts
 * @property {string} LOW - Low priority, informational notifications
 * @property {string} MEDIUM - Medium priority, important updates
 * @property {string} HIGH - High priority, requires attention
 * @property {string} CRITICAL - Critical priority, immediate action required
 */
export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Alert notification interface
 * @interface Alert
 * @description Complete alert structure for user notifications across the platform
 * @property {string} id - Unique alert identifier
 * @property {string} userId - Target user identifier
 * @property {AlertType} type - Category of alert notification
 * @property {string} title - Alert title displayed to user
 * @property {string} message - Detailed alert content
 * @property {AlertPriority} priority - Urgency level of the alert
 * @property {boolean} isRead - Whether user has read the alert
 * @property {boolean} isDismissed - Whether user has dismissed the alert
 * @property {string} [relatedEntityId] - Associated entity identifier (listing, booking, etc.)
 * @property {'listing' | 'user' | 'booking' | 'agent' | 'system'} [relatedEntityType] - Type of associated entity
 * @property {string} [actionUrl] - URL for user action (view listing, manage booking, etc.)
 * @property {Record<string, any>} [metadata] - Additional context data for the alert
 * @property {Date} [expiresAt] - Alert expiration date
 * @property {Date} createdAt - Alert creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @example
 * ```typescript
 * const alert: Alert = {
 *   id: 'alert-123',
 *   userId: 'user-456',
 *   type: AlertType.NEW_LISTING,
 *   title: 'New Property Matching Your Search',
 *   message: 'A new 3-bedroom apartment in Lozenets has been listed',
 *   priority: AlertPriority.MEDIUM,
 *   isRead: false,
 *   isDismissed: false,
 *   relatedEntityId: 'listing-789',
 *   relatedEntityType: 'listing',
 *   actionUrl: '/listings/789',
 *   createdAt: new Date('2024-12-01T10:00:00Z'),
 *   updatedAt: new Date('2024-12-01T10:00:00Z')
 * };
 * ```
 */
export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  priority: AlertPriority;
  isRead: boolean;
  isDismissed: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'listing' | 'user' | 'booking' | 'agent' | 'system';
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating new alerts
 * @interface CreateAlertInput
 * @description Input structure for creating new user notifications
 * @property {string} userId - Target user identifier
 * @property {AlertType} type - Category of alert notification
 * @property {string} title - Alert title displayed to user
 * @property {string} message - Detailed alert content
 * @property {AlertPriority} priority - Urgency level of the alert
 * @property {string} [relatedEntityId] - Associated entity identifier
 * @property {'listing' | 'user' | 'booking' | 'agent' | 'system'} [relatedEntityType] - Type of associated entity
 * @property {string} [actionUrl] - URL for user action
 * @property {Record<string, any>} [metadata] - Additional context data
 * @property {Date} [expiresAt] - Alert expiration date
 * @example
 * ```typescript
 * const createAlert: CreateAlertInput = {
 *   userId: 'user-123',
 *   type: AlertType.PRICE_CHANGE,
 *   title: 'Price Reduced',
 *   message: 'The apartment you viewed in Lozenets has reduced its price by €10,000',
 *   priority: AlertPriority.HIGH,
 *   relatedEntityId: 'listing-456',
 *   relatedEntityType: 'listing',
 *   actionUrl: '/listings/456'
 * };
 * ```
 */
export interface CreateAlertInput {
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  priority: AlertPriority;
  relatedEntityId?: string;
  relatedEntityType?: 'listing' | 'user' | 'booking' | 'agent' | 'system';
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

/**
 * Alert search filters
 * @interface AlertFilters
 * @description Filtering options for alert management and retrieval
 * @property {string} [userId] - Filter alerts for specific user
 * @property {AlertType} [type] - Filter by alert category
 * @property {AlertPriority} [priority] - Filter by urgency level
 * @property {boolean} [isRead] - Filter read/unread alerts
 * @property {boolean} [isDismissed] - Filter dismissed/undismissed alerts
 * @property {Date} [createdAfter] - Filter alerts created after date
 * @property {Date} [createdBefore] - Filter alerts created before date
 * @property {string} [relatedEntityType] - Filter by entity type association
 * @example
 * ```typescript
 * const alertFilters: AlertFilters = {
 *   userId: 'user-123',
 *   type: AlertType.NEW_LISTING,
 *   isRead: false,
 *   createdAfter: new Date('2024-12-01')
 * };
 * ```
 */
export interface AlertFilters {
  userId?: string;
  type?: AlertType;
  priority?: AlertPriority;
  isRead?: boolean;
  isDismissed?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  relatedEntityType?: string;
}

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
export enum AlertSortOption {
  DATE_DESC = 'date_desc',
  DATE_ASC = 'date_asc',
  PRIORITY_DESC = 'priority_desc',
  PRIORITY_ASC = 'priority_asc',
  TYPE = 'type',
  UNREAD_FIRST = 'unread_first'
}

/**
 * User notification preferences
 * @interface NotificationPreferences
 * @description Comprehensive notification settings for user communication preferences
 * @property {boolean} email - Enable email notifications
 * @property {boolean} sms - Enable SMS notifications
 * @property {boolean} push - Enable push notifications
 * @property {boolean} inApp - Enable in-app notifications
 * @property {'immediate' | 'daily' | 'weekly'} frequency - Notification delivery frequency
 * @property {Object} types - Alert type-specific preferences
 * @property {boolean} [types.price_change] - Price change notifications
 * @property {boolean} [types.new_listing] - New listing notifications
 * @property {boolean} [types.status_change] - Status change notifications
 * @property {boolean} [types.saved_search] - Saved search notifications
 * @property {boolean} [types.booking_update] - Booking update notifications
 * @property {boolean} [types.system] - System notification preferences
 * @property {boolean} [types.marketing] - Marketing communication preferences
 * @example
 * ```typescript
 * const preferences: NotificationPreferences = {
 *   email: true,
 *   sms: false,
 *   push: true,
 *   inApp: true,
 *   frequency: 'daily',
 *   types: {
 *     price_change: true,
 *     new_listing: true,
 *     status_change: true,
 *     saved_search: true,
 *     booking_update: true,
 *     system: true,
 *     marketing: false
 *   }
 * };
 * ```
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: {
    [key in AlertType]?: boolean;
  };
}