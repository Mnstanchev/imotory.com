"use strict";
/**
 * Tests for user schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const user_1 = require("../user");
(0, globals_1.describe)('User Schema Tests', () => {
    (0, globals_1.it)('should validate a complete user', () => {
        const validUser = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            phone: '+359888123456',
            preferences: {
                language: 'en',
                currency: 'EUR',
                notifications: {
                    email: true,
                    sms: false,
                    push: true
                },
                savedSearches: true,
                newsletter: false,
                marketingEmails: false
            },
            isEmailVerified: true,
            isPhoneVerified: true,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
        };
        const result = user_1.UserSchema.safeParse(validUser);
        (0, globals_1.expect)(result.success).toBe(true);
    });
    (0, globals_1.it)('should validate registration input', () => {
        const registerInput = {
            email: 'newuser@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!',
            phone: '+359887654321',
            preferences: {
                language: 'en',
                currency: 'EUR',
                notifications: {
                    email: true,
                    sms: false,
                    push: true
                },
                savedSearches: true,
                newsletter: true,
                marketingEmails: false
            }
        };
        const result = user_1.RegisterUserInputSchema.safeParse(registerInput);
        (0, globals_1.expect)(result.success).toBe(true);
    });
    (0, globals_1.it)('should reject invalid email', () => {
        const invalidUser = {
            email: 'invalid-email',
            firstName: 'Test',
            lastName: 'User',
            password: 'SecurePass123!',
            phone: '+359887654321'
        };
        const result = user_1.RegisterUserInputSchema.safeParse(invalidUser);
        (0, globals_1.expect)(result.success).toBe(false);
    });
    (0, globals_1.it)('should reject weak password', () => {
        const weakPasswordUser = {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: '123',
            phone: '+359887654321'
        };
        const result = user_1.RegisterUserInputSchema.safeParse(weakPasswordUser);
        (0, globals_1.expect)(result.success).toBe(false);
    });
});
//# sourceMappingURL=user.test.js.map