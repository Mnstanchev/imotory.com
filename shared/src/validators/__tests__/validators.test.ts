/**
 * Tests for validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import * as validators from '../index';

describe('Validation Utilities', () => {
  describe('Bulgarian Phone Validation', () => {
    it('should validate correct Bulgarian phone numbers', () => {
      expect(validators.validateBulgarianPhone('+359888123456')).toBe(true);
      expect(validators.validateBulgarianPhone('0888123456')).toBe(true);
      expect(validators.validateBulgarianPhone('+35929876543')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validators.validateBulgarianPhone('123456789')).toBe(false);
      expect(validators.validateBulgarianPhone('invalid')).toBe(false);
    });
  });

  describe('URL Slug Generation', () => {
    it('should create valid slugs from titles', () => {
      expect(validators.createSlug('Luxury Apartment in Sofia')).toBe('luxury-apartment-in-sofia');
      expect(validators.createSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('should handle non-Latin characters', () => {
      expect(validators.createSlug('Апартамент в София')).toBe('апартамент-в-софия');
    });
  });

  describe('Email and UUID Validation', () => {
    it('should validate email formats', () => {
      expect(validators.validateEmail('user@example.com')).toBe(true);
      expect(validators.validateEmail('invalid-email')).toBe(false);
    });

    it('should validate UUID formats', () => {
      expect(validators.validateUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(validators.validateUUID('invalid-uuid')).toBe(false);
    });
  });

  describe('Date Utilities', () => {
    it('should check future and past dates', () => {
      const futureDate = new Date('2030-01-01');
      const pastDate = new Date('2020-01-01');

      expect(validators.DateUtils.isFuture(futureDate)).toBe(true);
      expect(validators.DateUtils.isPast(pastDate)).toBe(true);
    });

    it('should calculate days between dates', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-15');
      const days = validators.DateUtils.daysBetween(startDate, endDate);
      expect(days).toBe(14);
    });
  });

  describe('Price Converter', () => {
    it('should convert between currencies', () => {
      const usdPrice = validators.PriceConverter.convert(1000, 'BGN', 'USD');
      expect(usdPrice).toBeCloseTo(547.8, 1);
    });

    it('should handle same currency conversion', () => {
      const result = validators.PriceConverter.convert(1000, 'EUR', 'EUR');
      expect(result).toBe(1000);
    });
  });
});