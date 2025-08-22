/**
 * User validation schemas
 */
import { z } from 'zod';

/**
 * Schema for user roles
 */
export const UserRoleSchema = z.enum([
  'user',
  'agent',
  'admin',
  'superadmin'
]);

/**
 * Schema for user notification preferences
 */
export const UserPreferencesSchema = z.object({
  language: z.string().min(2, 'Language must be at least 2 characters').max(5, 'Language code too long'),
  currency: z.string().min(3, 'Currency must be 3 characters').max(3, 'Currency must be 3 characters'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  savedSearches: z.boolean(),
  newsletter: z.boolean(),
  marketingEmails: z.boolean(),
});

/**
 * Schema for Bulgarian phone number validation
 */
const BulgarianPhoneSchema = z.string().regex(
  /^(\+359|0)[0-9]{8,9}$/,
  'Invalid Bulgarian phone number format. Use +359XXXXXXXXX or 0XXXXXXXXX'
);

/**
 * Schema for password validation
 */
const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Schema for creating new users
 */
export const RegisterUserInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: PasswordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
  phone: BulgarianPhoneSchema.optional(),
  role: UserRoleSchema.optional().default('user'),
  preferences: UserPreferencesSchema.partial().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Schema for login credentials
 */
export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Schema for password reset request
 */
export const PasswordResetRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

/**
 * Schema for password reset confirmation
 */
export const PasswordResetInputSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Schema for password change
 */
export const PasswordChangeInputSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Schema for email verification
 */
export const EmailVerificationInputSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

/**
 * Schema for phone verification
 */
export const PhoneVerificationInputSchema = z.object({
  phone: BulgarianPhoneSchema,
  code: z.string().min(4, 'Verification code must be at least 4 characters').max(6, 'Verification code too long'),
});

/**
 * Schema for updating user profile
 */
export const UpdateUserProfileInputSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: BulgarianPhoneSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  preferences: UserPreferencesSchema.partial().optional(),
});

/**
 * Schema for user search filters
 */
export const UserFiltersSchema = z.object({
  role: UserRoleSchema.optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

/**
 * Schema for user sort options
 */
export const UserSortOptionSchema = z.enum([
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
export const UserSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: BulgarianPhoneSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  role: UserRoleSchema,
  preferences: UserPreferencesSchema,
  isEmailVerified: z.boolean(),
  isPhoneVerified: z.boolean(),
  isActive: z.boolean(),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for authentication tokens
 */
export const AuthTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  expiresAt: z.date(),
  refreshExpiresAt: z.date(),
  userId: z.string().uuid('Invalid user ID format'),
  role: UserRoleSchema,
  issuedAt: z.date(),
});