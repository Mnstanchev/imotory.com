/**
 * Core validation utilities for the property website shared package
 * @module validators
 * @description
 * Comprehensive validation utilities for Bulgarian property platform including
 * phone validation, multilingual content, currency conversion, and security utilities.
 * Provides type-safe validation functions, currency operations, and input sanitization.
 */

import { MultilingualText, Language, Currency } from '../types/common';
export * from './typeGuards';

/**
 * Bulgarian phone number regex for validation
 * Supports both international (+359) and local (0) formats
 * @constant {RegExp} BULGARIAN_PHONE_REGEX
 * @description Regular expression for validating Bulgarian phone numbers
 * @example
 * ```typescript
 * validateBulgarianPhone('+359888123456'); // true
 * validateBulgarianPhone('0888123456'); // true
 * validateBulgarianPhone('123456789'); // false
 * ```
 */
export const BULGARIAN_PHONE_REGEX = /^(\+359|0)[0-9]{8,9}$/;

/**
 * Validate Bulgarian phone number format
 * @param phone - Phone number string to validate
 * @returns true if valid Bulgarian phone number, false otherwise
 * @example
 * ```typescript
 * validateBulgarianPhone('+359888123456'); // true
 * validateBulgarianPhone('0888123456'); // true
 * validateBulgarianPhone('invalid'); // false
 * ```
 */
export const validateBulgarianPhone = (phone: string): boolean => {
  return BULGARIAN_PHONE_REGEX.test(phone);
};

/**
 * Validate multilingual content completeness
 * @param content - Multilingual text object to validate
 * @param requiredLanguages - Array of required language codes (default: ['en'])
 * @returns true if all required languages have non-empty content
 * @example
 * ```typescript
 * const content: MultilingualText = { en: 'Hello', bg: 'Здравей' };
 * validateMultilingualContent(content, ['en', 'bg']); // true
 * validateMultilingualContent(content, ['en', 'ru']); // false
 * ```
 */
export const validateMultilingualContent = (
  content: MultilingualText,
  requiredLanguages: Language[] = ['en']
): boolean => {
  return requiredLanguages.every(lang => 
    content[lang] && content[lang].trim().length > 0
  );
};

/**
 * Price conversion utilities for currency operations
 * @namespace PriceConverter
 * @description Currency conversion and formatting utilities with real-time exchange rates support
 * @property {Record<Currency, Record<Currency, number>>} rates - Exchange rate lookup table
 * @property {Function} toEur - Convert any currency to EUR
 * @property {Function} convert - Convert between any two currencies
 * @property {Function} format - Format price with currency symbol
 * @example
 * ```typescript
 * // Convert BGN to EUR
 * const eurPrice = PriceConverter.toEur(1000, 'BGN'); // ~511.30 EUR
 * 
 * // Convert between any currencies
 * const usdPrice = PriceConverter.convert(1000, 'BGN', 'USD'); // ~547.60 USD
 * 
 * // Format price for display
 * const formatted = PriceConverter.format(1000, 'BGN', 'bg-BG'); // "1 000,00 лв."
 * ```
 */
export const PriceConverter = {
  // Base conversion rates (should be updated from external API in production)
  rates: {
    BGN: { EUR: 0.5113, USD: 0.5476 },
    EUR: { BGN: 1.9558, USD: 1.0714 },
    USD: { BGN: 1.8260, EUR: 0.9334 }
  } as Record<Currency, Record<Currency, number>>,
  
  /**
   * Convert price to EUR
   * @param price - Price amount to convert
   * @param currency - Source currency
   * @returns Price in EUR
   * @example
   * ```typescript
   * const eurPrice = PriceConverter.toEur(1000, 'BGN'); // 511.30
   * ```
   */
  toEur: (price: number, currency: Currency): number => {
    if (currency === 'EUR') return price;
    return price * PriceConverter.rates[currency].EUR;
  },
  
  /**
   * Convert between any two currencies
   * @param price - Price amount to convert
   * @param fromCurrency - Source currency
   * @param toCurrency - Target currency
   * @returns Converted price
   * @example
   * ```typescript
   * const usdPrice = PriceConverter.convert(1000, 'BGN', 'USD'); // 547.60
   * ```
   */
  convert: (price: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return price;
    
    // Convert to EUR first, then to target currency
    const eurAmount = PriceConverter.toEur(price, fromCurrency);
    return eurAmount * PriceConverter.rates.EUR[toCurrency];
  },
  
  /**
   * Format price with currency symbol
   * @param price - Price amount
   * @param currency - Currency code
   * @param locale - Locale for formatting (default: 'en-US')
   * @returns Formatted price string
   * @example
   * ```typescript
   * const formatted = PriceConverter.format(1000, 'BGN', 'bg-BG'); // "1 000,00 лв."
   * ```
   */
  format: (price: number, currency: Currency, locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(price);
  }
};

/**
 * Create URL-friendly slug from text
 * @param title - Text to convert to slug
 * @returns URL-friendly slug
 * @example
 * ```typescript
 * const slug = createSlug('Luxury Apartment in Sofia'); // "luxury-apartment-in-sofia"
 * ```
 */
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04ff -]/g, '') // Allow Cyrillic characters
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
};

/**
 * Get localized text with fallback support
 * @param content - Multilingual text object
 * @param language - Preferred language
 * @param fallback - Fallback language (default: 'en')
 * @returns Localized text string
 * @example
 * ```typescript
 * const text = getLocalizedText({ en: 'Hello', bg: 'Здравей' }, 'bg'); // "Здравей"
 * const fallback = getLocalizedText({ en: 'Hello' }, 'bg'); // "Hello"
 * ```
 */
export const getLocalizedText = (
  content: MultilingualText,
  language: Language,
  fallback: Language = 'en'
): string => {
  return content[language] || content[fallback] || content.en || '';
};

/**
 * Generate unique identifier
 * @returns UUID string
 * @example
 * ```typescript
 * const id = generateId(); // "123e4567-e89b-12d3-a456-426614174000"
 * ```
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if valid email format
 * @example
 * ```typescript
 * validateEmail('user@example.com'); // true
 * validateEmail('invalid-email'); // false
 * ```
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate UUID format
 * @param uuid - UUID string to validate
 * @returns true if valid UUID format
 * @example
 * ```typescript
 * validateUUID('123e4567-e89b-12d3-a456-426614174000'); // true
 * validateUUID('invalid-uuid'); // false
 * ```
 */
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Date utilities for handling dates in the application
 * @namespace DateUtils
 * @description Comprehensive date manipulation and formatting utilities
 * @property {Function} format - Format date for display
 * @property {Function} isFuture - Check if date is in the future
 * @property {Function} isPast - Check if date is in the past
 * @property {Function} daysBetween - Calculate days between two dates
 * @example
 * ```typescript
 * const formatted = DateUtils.format(new Date(), 'bg-BG'); // "1 декември 2024 г."
 * const isFuture = DateUtils.isFuture(new Date('2025-01-01')); // true
 * const days = DateUtils.daysBetween(new Date('2024-01-01'), new Date('2024-01-15')); // 14
 * ```
 */
export const DateUtils = {
  /**
   * Format date for display
   * @param date - Date to format
   * @param locale - Locale for formatting (default: 'en-US')
   * @returns Formatted date string
   * @example
   * ```typescript
   * const formatted = DateUtils.format(new Date(), 'bg-BG'); // "1 декември 2024 г."
   * ```
   */
  format: (date: Date, locale: string = 'en-US'): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },
  
  /**
   * Check if date is in the future
   * @param date - Date to check
   * @returns true if date is in the future
   * @example
   * ```typescript
   * const isFuture = DateUtils.isFuture(new Date('2025-01-01')); // true
   * ```
   */
  isFuture: (date: Date): boolean => {
    return date > new Date();
  },
  
  /**
   * Check if date is in the past
   * @param date - Date to check
   * @returns true if date is in the past
   * @example
   * ```typescript
   * const isPast = DateUtils.isPast(new Date('2020-01-01')); // true
   * ```
   */
  isPast: (date: Date): boolean => {
    return date < new Date();
  },
  
  /**
   * Calculate days between two dates
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Number of days between dates
   * @example
   * ```typescript
   * const days = DateUtils.daysBetween(new Date('2024-01-01'), new Date('2024-01-15')); // 14
   * ```
   */
  daysBetween: (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
};

/**
 * Sanitize input strings to prevent XSS
 * @param input - Input string to sanitize
 * @returns Sanitized string
 * @example
 * ```typescript
 * const safe = sanitizeInput('<script>alert("xss")</script>'); // "&lt;script&gt;..."
 * ```
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[\u00A0-\u9999<>\&]/gim, (i) => {
      return '\u0026#' + i.charCodeAt(0) + ';';
    })
    .trim();
};

/**
 * Mock File interface for Node.js environment
 */
interface MockFile {
  name: string;
  type: string;
  size: number;
}

/**
 * Validate file upload (basic validation)
 * @param file - File object to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns true if file is valid
 * @example
 * ```typescript
 * const file = { name: 'image.jpg', type: 'image/jpeg', size: 1024 };
 * const isValid = validateFileUpload(file); // true
 * const invalidFile = { name: 'document.pdf', type: 'application/pdf', size: 1024 };
 * const isInvalid = validateFileUpload(invalidFile); // false
 * ```
 */
export const validateFileUpload = (
  file: MockFile | File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): boolean => {
  if (!allowedTypes.includes(file.type)) return false;
  if (file.size > maxSize) return false;
  return true;
};