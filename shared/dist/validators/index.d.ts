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
export declare const BULGARIAN_PHONE_REGEX: RegExp;
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
export declare const validateBulgarianPhone: (phone: string) => boolean;
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
export declare const validateMultilingualContent: (content: MultilingualText, requiredLanguages?: Language[]) => boolean;
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
export declare const PriceConverter: {
    rates: Record<Currency, Record<Currency, number>>;
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
    toEur: (price: number, currency: Currency) => number;
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
    convert: (price: number, fromCurrency: Currency, toCurrency: Currency) => number;
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
    format: (price: number, currency: Currency, locale?: string) => string;
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
export declare const createSlug: (title: string) => string;
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
export declare const getLocalizedText: (content: MultilingualText, language: Language, fallback?: Language) => string;
/**
 * Generate unique identifier
 * @returns UUID string
 * @example
 * ```typescript
 * const id = generateId(); // "123e4567-e89b-12d3-a456-426614174000"
 * ```
 */
export declare const generateId: () => string;
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
export declare const validateEmail: (email: string) => boolean;
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
export declare const validateUUID: (uuid: string) => boolean;
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
export declare const DateUtils: {
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
    format: (date: Date, locale?: string) => string;
    /**
     * Check if date is in the future
     * @param date - Date to check
     * @returns true if date is in the future
     * @example
     * ```typescript
     * const isFuture = DateUtils.isFuture(new Date('2025-01-01')); // true
     * ```
     */
    isFuture: (date: Date) => boolean;
    /**
     * Check if date is in the past
     * @param date - Date to check
     * @returns true if date is in the past
     * @example
     * ```typescript
     * const isPast = DateUtils.isPast(new Date('2020-01-01')); // true
     * ```
     */
    isPast: (date: Date) => boolean;
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
    daysBetween: (startDate: Date, endDate: Date) => number;
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
export declare const sanitizeInput: (input: string) => string;
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
export declare const validateFileUpload: (file: MockFile | File, allowedTypes?: string[], maxSize?: number) => boolean;
//# sourceMappingURL=index.d.ts.map