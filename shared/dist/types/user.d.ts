/**
 * User-related types for authentication and user management
 * @module types/user
 * @description
 * Defines all types related to user authentication, profiles, and access control
 * including roles, preferences, and authentication tokens.
 */
/**
 * User roles for access control
 * @enum {string} UserRole
 * @description Defines user permission levels and access rights across the platform
 * @property {string} USER - Standard user with basic permissions (property search, favorites, bookings)
 * @property {string} AGENT - Real estate agent with listing management capabilities
 * @property {string} ADMIN - Administrative user with elevated permissions
 * @property {string} SUPER_ADMIN - Highest level with full system access
 * @example
 * ```typescript
 * const role: UserRole = UserRole.AGENT;
 * const canManageListings = role === UserRole.AGENT || role === UserRole.ADMIN;
 * ```
 */
export declare enum UserRole {
    USER = "user",
    AGENT = "agent",
    ADMIN = "admin",
    SUPER_ADMIN = "superadmin"
}
/**
 * User notification preferences
 * @interface UserPreferences
 * @description Comprehensive notification and display preferences for user experience customization
 * @property {string} language - Preferred language for content display ('en', 'bg', 'ru')
 * @property {string} currency - Preferred currency for price display ('BGN', 'EUR', 'USD')
 * @property {Object} notifications - Notification channel preferences
 * @property {boolean} notifications.email - Enable email notifications
 * @property {boolean} notifications.sms - Enable SMS notifications
 * @property {boolean} notifications.push - Enable push notifications
 * @property {boolean} savedSearches - Enable notifications for saved search updates
 * @property {boolean} newsletter - Enable newsletter subscription
 * @property {boolean} marketingEmails - Enable marketing email communications
 * @example
 * ```typescript
 * const preferences: UserPreferences = {
 *   language: 'bg',
 *   currency: 'EUR',
 *   notifications: {
 *     email: true,
 *     sms: false,
 *     push: true
 *   },
 *   savedSearches: true,
 *   newsletter: false,
 *   marketingEmails: false
 * };
 * ```
 */
export interface UserPreferences {
    language: string;
    currency: string;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    savedSearches: boolean;
    newsletter: boolean;
    marketingEmails: boolean;
}
/**
 * User profile information
 * @interface User
 * @description Complete user profile with authentication status and preferences
 * @property {string} id - Unique user identifier
 * @property {string} email - Primary email address for login and communication
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [phone] - Contact phone number (optional)
 * @property {string} [avatar] - URL to user's profile photo (optional)
 * @property {UserRole} role - User's permission level (user, agent, admin, superadmin)
 * @property {UserPreferences} preferences - User's display and notification preferences
 * @property {boolean} isEmailVerified - Email verification status
 * @property {boolean} isPhoneVerified - Phone verification status
 * @property {boolean} isActive - Account activation status
 * @property {Date} [lastLoginAt] - Timestamp of last login (optional)
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last profile update timestamp
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'user-123',
 *   email: 'john.doe@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+359888123456',
 *   role: UserRole.USER,
 *   preferences: {
 *     language: 'en',
 *     currency: 'EUR',
 *     notifications: { email: true, sms: false, push: true },
 *     savedSearches: true,
 *     newsletter: true,
 *     marketingEmails: false
 *   },
 *   isEmailVerified: true,
 *   isPhoneVerified: false,
 *   isActive: true,
 *   createdAt: new Date('2024-01-15'),
 *   updatedAt: new Date('2024-12-01')
 * };
 * ```
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    preferences: UserPreferences;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Authentication token structure
 * @interface AuthToken
 * @description JWT token details for session management
 * @property {string} token - JWT access token for API authentication
 * @property {string} refreshToken - Refresh token for obtaining new access tokens
 * @property {Date} expiresAt - Token expiration timestamp
 * @property {Date} refreshExpiresAt - Refresh token expiration timestamp
 * @property {string} userId - Associated user identifier
 * @property {UserRole} role - User's role for permission validation
 * @property {Date} issuedAt - Token issuance timestamp
 * @example
 * ```typescript
 * const authToken: AuthToken = {
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   expiresAt: new Date('2024-12-31T23:59:59Z'),
 *   refreshExpiresAt: new Date('2025-01-31T23:59:59Z'),
 *   userId: 'user-123',
 *   role: UserRole.USER,
 *   issuedAt: new Date('2024-12-01T10:00:00Z')
 * };
 * ```
 */
export interface AuthToken {
    token: string;
    refreshToken: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
    userId: string;
    role: UserRole;
    issuedAt: Date;
}
/**
 * Login credentials input
 * @interface LoginCredentials
 * @description User credentials for authentication
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {boolean} [rememberMe] - Remember login for extended period
 */
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
/**
 * Registration input for new users
 * @interface RegisterUserInput
 * @description Input structure for new user registration
 * @property {string} email - Email address for account creation
 * @property {string} password - User's password (must meet security requirements)
 * @property {string} confirmPassword - Password confirmation for validation
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [phone] - Contact phone number (optional)
 * @property {UserRole} [role] - User role (defaults to UserRole.USER)
 * @property {Partial<UserPreferences>} [preferences] - Initial user preferences
 * @example
 * ```typescript
 * const registerInput: RegisterUserInput = {
 *   email: 'new.user@example.com',
 *   password: 'SecurePass123!',
 *   confirmPassword: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   phone: '+359899654321',
 *   role: UserRole.USER,
 *   preferences: {
 *     language: 'bg',
 *     currency: 'EUR'
 *   }
 * };
 * ```
 */
export interface RegisterUserInput {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    preferences?: Partial<UserPreferences>;
}
/**
 * Password reset request
 * @interface PasswordResetRequest
 * @description Request structure for initiating password reset
 * @property {string} email - Email address to send reset instructions
 */
export interface PasswordResetRequest {
    email: string;
}
/**
 * Password reset confirmation
 * @interface PasswordResetInput
 * @description Input for completing password reset process
 * @property {string} token - Password reset token received via email
 * @property {string} newPassword - New password to set
 * @property {string} confirmPassword - Password confirmation for validation
 */
export interface PasswordResetInput {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
/**
 * Password change request
 * @interface PasswordChangeInput
 * @description Input for changing password while logged in
 * @property {string} currentPassword - Current password for verification
 * @property {string} newPassword - New password to set
 * @property {string} confirmPassword - Password confirmation for validation
 */
export interface PasswordChangeInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
/**
 * Email verification input
 * @interface EmailVerificationInput
 * @description Input for verifying email address
 * @property {string} token - Email verification token
 */
export interface EmailVerificationInput {
    token: string;
}
/**
 * Phone verification input
 * @interface PhoneVerificationInput
 * @description Input for verifying phone number
 * @property {string} phone - Phone number to verify
 * @property {string} code - Verification code received via SMS
 */
export interface PhoneVerificationInput {
    phone: string;
    code: string;
}
/**
 * User profile update input
 * @interface UpdateUserProfileInput
 * @description Partial input for updating user profile information
 * @property {string} [firstName] - Updated first name
 * @property {string} [lastName] - Updated last name
 * @property {string} [phone] - Updated phone number
 * @property {string} [avatar] - Updated profile photo URL
 * @property {Partial<UserPreferences>} [preferences] - Updated preferences
 */
export interface UpdateUserProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    preferences?: Partial<UserPreferences>;
}
/**
 * User search filters
 * @interface UserFilters
 * @description Filtering options for user searches
 * @property {UserRole} [role] - Filter by user role
 * @property {boolean} [isEmailVerified] - Filter by email verification status
 * @property {boolean} [isPhoneVerified] - Filter by phone verification status
 * @property {boolean} [isActive] - Filter by account activation status
 * @property {Date} [createdAfter] - Filter users created after this date
 * @property {Date} [createdBefore] - Filter users created before this date
 */
export interface UserFilters {
    role?: UserRole;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isActive?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
}
/**
 * User sort options
 * @enum {string} UserSortOption
 * @description Available sorting options for user listings
 * @property {string} NAME_ASC - Sort by name ascending
 * @property {string} NAME_DESC - Sort by name descending
 * @property {string} DATE_ASC - Sort by creation date ascending
 * @property {string} DATE_DESC - Sort by creation date descending
 * @property {string} ROLE_ASC - Sort by role ascending
 * @property {string} ROLE_DESC - Sort by role descending
 * @property {string} LAST_LOGIN_ASC - Sort by last login ascending
 * @property {string} LAST_LOGIN_DESC - Sort by last login descending
 */
export declare enum UserSortOption {
    NAME_ASC = "name_asc",
    NAME_DESC = "name_desc",
    DATE_ASC = "date_asc",
    DATE_DESC = "date_desc",
    ROLE_ASC = "role_asc",
    ROLE_DESC = "role_desc",
    LAST_LOGIN_ASC = "last_login_asc",
    LAST_LOGIN_DESC = "last_login_desc"
}
//# sourceMappingURL=user.d.ts.map