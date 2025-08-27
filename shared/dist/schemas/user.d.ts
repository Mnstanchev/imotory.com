/**
 * User validation schemas
 */
import { z } from 'zod';
/**
 * Schema for user roles
 */
export declare const UserRoleSchema: z.ZodEnum<{
    user: "user";
    agent: "agent";
    admin: "admin";
    superadmin: "superadmin";
}>;
/**
 * Schema for user notification preferences
 */
export declare const UserPreferencesSchema: z.ZodObject<{
    language: z.ZodString;
    currency: z.ZodString;
    notifications: z.ZodObject<{
        email: z.ZodBoolean;
        sms: z.ZodBoolean;
        push: z.ZodBoolean;
    }, z.core.$strip>;
    savedSearches: z.ZodBoolean;
    newsletter: z.ZodBoolean;
    marketingEmails: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Schema for creating new users
 */
export declare const RegisterUserInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        user: "user";
        agent: "agent";
        admin: "admin";
        superadmin: "superadmin";
    }>>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        currency: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            email: z.ZodBoolean;
            sms: z.ZodBoolean;
            push: z.ZodBoolean;
        }, z.core.$strip>>;
        savedSearches: z.ZodOptional<z.ZodBoolean>;
        newsletter: z.ZodOptional<z.ZodBoolean>;
        marketingEmails: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Schema for login credentials
 */
export declare const LoginCredentialsSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Schema for password reset request
 */
export declare const PasswordResetRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for password reset confirmation
 */
export declare const PasswordResetInputSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for password change
 */
export declare const PasswordChangeInputSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for email verification
 */
export declare const EmailVerificationInputSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for phone verification
 */
export declare const PhoneVerificationInputSchema: z.ZodObject<{
    phone: z.ZodString;
    code: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for updating user profile
 */
export declare const UpdateUserProfileInputSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        currency: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            email: z.ZodBoolean;
            sms: z.ZodBoolean;
            push: z.ZodBoolean;
        }, z.core.$strip>>;
        savedSearches: z.ZodOptional<z.ZodBoolean>;
        newsletter: z.ZodOptional<z.ZodBoolean>;
        marketingEmails: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Schema for user search filters
 */
export declare const UserFiltersSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        user: "user";
        agent: "agent";
        admin: "admin";
        superadmin: "superadmin";
    }>>;
    isEmailVerified: z.ZodOptional<z.ZodBoolean>;
    isPhoneVerified: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    createdAfter: z.ZodOptional<z.ZodDate>;
    createdBefore: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
/**
 * Schema for user sort options
 */
export declare const UserSortOptionSchema: z.ZodEnum<{
    date_asc: "date_asc";
    date_desc: "date_desc";
    name_asc: "name_asc";
    name_desc: "name_desc";
    role_asc: "role_asc";
    role_desc: "role_desc";
    last_login_asc: "last_login_asc";
    last_login_desc: "last_login_desc";
}>;
/**
 * Schema for complete user objects
 */
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        user: "user";
        agent: "agent";
        admin: "admin";
        superadmin: "superadmin";
    }>;
    preferences: z.ZodObject<{
        language: z.ZodString;
        currency: z.ZodString;
        notifications: z.ZodObject<{
            email: z.ZodBoolean;
            sms: z.ZodBoolean;
            push: z.ZodBoolean;
        }, z.core.$strip>;
        savedSearches: z.ZodBoolean;
        newsletter: z.ZodBoolean;
        marketingEmails: z.ZodBoolean;
    }, z.core.$strip>;
    isEmailVerified: z.ZodBoolean;
    isPhoneVerified: z.ZodBoolean;
    isActive: z.ZodBoolean;
    lastLoginAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
/**
 * Schema for authentication tokens
 */
export declare const AuthTokenSchema: z.ZodObject<{
    token: z.ZodString;
    refreshToken: z.ZodString;
    expiresAt: z.ZodDate;
    refreshExpiresAt: z.ZodDate;
    userId: z.ZodString;
    role: z.ZodEnum<{
        user: "user";
        agent: "agent";
        admin: "admin";
        superadmin: "superadmin";
    }>;
    issuedAt: z.ZodDate;
}, z.core.$strip>;
//# sourceMappingURL=user.d.ts.map