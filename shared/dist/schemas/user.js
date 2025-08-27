"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenSchema = exports.UserSchema = exports.UserSortOptionSchema = exports.UserFiltersSchema = exports.UpdateUserProfileInputSchema = exports.PhoneVerificationInputSchema = exports.EmailVerificationInputSchema = exports.PasswordChangeInputSchema = exports.PasswordResetInputSchema = exports.PasswordResetRequestSchema = exports.LoginCredentialsSchema = exports.RegisterUserInputSchema = exports.UserPreferencesSchema = exports.UserRoleSchema = void 0;
/**
 * User validation schemas
 */
const zod_1 = require("zod");
/**
 * Schema for user roles
 */
exports.UserRoleSchema = zod_1.z.enum([
    'user',
    'agent',
    'admin',
    'superadmin'
]);
/**
 * Schema for user notification preferences
 */
exports.UserPreferencesSchema = zod_1.z.object({
    language: zod_1.z.string().min(2, 'Language must be at least 2 characters').max(5, 'Language code too long'),
    currency: zod_1.z.string().min(3, 'Currency must be 3 characters').max(3, 'Currency must be 3 characters'),
    notifications: zod_1.z.object({
        email: zod_1.z.boolean(),
        sms: zod_1.z.boolean(),
        push: zod_1.z.boolean(),
    }),
    savedSearches: zod_1.z.boolean(),
    newsletter: zod_1.z.boolean(),
    marketingEmails: zod_1.z.boolean(),
});
/**
 * Schema for Bulgarian phone number validation
 */
const BulgarianPhoneSchema = zod_1.z.string().regex(/^(\+359|0)[0-9]{8,9}$/, 'Invalid Bulgarian phone number format. Use +359XXXXXXXXX or 0XXXXXXXXX');
/**
 * Schema for password validation
 */
const PasswordSchema = zod_1.z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
/**
 * Schema for creating new users
 */
exports.RegisterUserInputSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: PasswordSchema,
    confirmPassword: zod_1.z.string(),
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
    phone: BulgarianPhoneSchema.optional(),
    role: exports.UserRoleSchema.optional().default('user'),
    preferences: exports.UserPreferencesSchema.partial().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
/**
 * Schema for login credentials
 */
exports.LoginCredentialsSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
    rememberMe: zod_1.z.boolean().optional().default(false),
});
/**
 * Schema for password reset request
 */
exports.PasswordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
});
/**
 * Schema for password reset confirmation
 */
exports.PasswordResetInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    newPassword: PasswordSchema,
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
/**
 * Schema for password change
 */
exports.PasswordChangeInputSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: PasswordSchema,
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
/**
 * Schema for email verification
 */
exports.EmailVerificationInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Verification token is required'),
});
/**
 * Schema for phone verification
 */
exports.PhoneVerificationInputSchema = zod_1.z.object({
    phone: BulgarianPhoneSchema,
    code: zod_1.z.string().min(4, 'Verification code must be at least 4 characters').max(6, 'Verification code too long'),
});
/**
 * Schema for updating user profile
 */
exports.UpdateUserProfileInputSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50).optional(),
    lastName: zod_1.z.string().min(2).max(50).optional(),
    phone: BulgarianPhoneSchema.optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    preferences: exports.UserPreferencesSchema.partial().optional(),
});
/**
 * Schema for user search filters
 */
exports.UserFiltersSchema = zod_1.z.object({
    role: exports.UserRoleSchema.optional(),
    isEmailVerified: zod_1.z.boolean().optional(),
    isPhoneVerified: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    createdAfter: zod_1.z.date().optional(),
    createdBefore: zod_1.z.date().optional(),
});
/**
 * Schema for user sort options
 */
exports.UserSortOptionSchema = zod_1.z.enum([
    'name_asc',
    'name_desc',
    'date_asc',
    'date_desc',
    'role_asc',
    'role_desc',
    'last_login_asc',
    'last_login_desc',
]);
/**
 * Schema for complete user objects
 */
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid user ID format'),
    email: zod_1.z.string().email('Invalid email format'),
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    phone: BulgarianPhoneSchema.optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    role: exports.UserRoleSchema,
    preferences: exports.UserPreferencesSchema,
    isEmailVerified: zod_1.z.boolean(),
    isPhoneVerified: zod_1.z.boolean(),
    isActive: zod_1.z.boolean(),
    lastLoginAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
/**
 * Schema for authentication tokens
 */
exports.AuthTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    expiresAt: zod_1.z.date(),
    refreshExpiresAt: zod_1.z.date(),
    userId: zod_1.z.string().uuid('Invalid user ID format'),
    role: exports.UserRoleSchema,
    issuedAt: zod_1.z.date(),
});
//# sourceMappingURL=user.js.map