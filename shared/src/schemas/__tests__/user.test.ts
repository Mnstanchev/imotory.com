/**
 * Tests for user schemas
 */

import { describe, it, expect } from '@jest/globals';
import { UserSchema, RegisterUserInputSchema } from '../user';

describe('User Schema Tests', () => {
  it('should validate a complete user', () => {
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user' as const,
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

    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should validate registration input', () => {
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

    const result = RegisterUserInputSchema.safeParse(registerInput);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      email: 'invalid-email',
      firstName: 'Test',
      lastName: 'User',
      password: 'SecurePass123!',
      phone: '+359887654321'
    };

    const result = RegisterUserInputSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should reject weak password', () => {
    const weakPasswordUser = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: '123',
      phone: '+359887654321'
    };

    const result = RegisterUserInputSchema.safeParse(weakPasswordUser);
    expect(result.success).toBe(false);
  });
});