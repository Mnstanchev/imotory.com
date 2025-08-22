/**
 * Tests for booking schemas
 */

import { describe, it, expect } from '@jest/globals';
import { BookingSchema, CreateBookingInputSchema } from '../booking';

describe('Booking Schema Tests', () => {
  it('should validate a complete booking', () => {
    const validBooking = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      listingId: '123e4567-e89b-12d3-a456-426614174001',
      agentId: '123e4567-e89b-12d3-a456-426614174002',
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+359888123456',
        preferredLanguage: 'en'
      },
      visitType: 'viewing' as const,
      status: 'pending' as const,
      scheduledAt: new Date('2025-12-15T10:00:00Z'),
      duration: 60,
      location: {
        address: '123 Main St',
        city: 'Sofia',
        country: 'Bulgaria',
        coordinates: { latitude: 42.6977, longitude: 23.3219 },
        localizedNames: {
          en: 'Sofia',
          bg: 'София',
          ru: 'София'
        }
      },
      notes: 'Looking for 3-bedroom apartment',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    };

    const result = BookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('should validate booking creation input', () => {
    const createInput = {
      listingId: '123e4567-e89b-12d3-a456-426614174001',
      agentId: '123e4567-e89b-12d3-a456-426614174002',
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+359888123456',
        preferredLanguage: 'en'
      },
      visitType: 'viewing' as const,
      scheduledAt: new Date('2025-12-15T10:00:00Z'),
      duration: 60,
      notes: 'Looking for 3-bedroom apartment'
    };

    const result = CreateBookingInputSchema.safeParse(createInput);
    expect(result.success).toBe(true);
  });

  it('should reject invalid visit type', () => {
    const invalidBooking = {
      id: '123',
      listingId: '123',
      agentId: '123',
      contactInfo: { name: 'Test', email: 'test@test.com', phone: '+359888123456' },
      visitType: 'invalid',
      scheduledAt: new Date(),
      duration: 60,
      status: 'pending'
    };

    const result = BookingSchema.safeParse(invalidBooking);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const incompleteBooking = {
      listingId: '123'
    };

    const result = CreateBookingInputSchema.safeParse(incompleteBooking);
    expect(result.success).toBe(false);
  });
});