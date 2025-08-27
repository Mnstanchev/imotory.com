"use strict";
/**
 * Core validation utilities for the property website shared package
 * @module validators
 * @description
 * Comprehensive validation utilities for Bulgarian property platform including
 * phone validation, multilingual content, currency conversion, and security utilities.
 * Provides type-safe validation functions, currency operations, and input sanitization.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.sanitizeInput = exports.DateUtils = exports.validateUUID = exports.validateEmail = exports.generateId = exports.getLocalizedText = exports.createSlug = exports.PriceConverter = exports.validateMultilingualContent = exports.validateBulgarianPhone = exports.BULGARIAN_PHONE_REGEX = void 0;
__exportStar(require("./typeGuards"), exports);
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
exports.BULGARIAN_PHONE_REGEX = /^(\+359|0)[0-9]{8,9}$/;
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
const validateBulgarianPhone = (phone) => {
    return exports.BULGARIAN_PHONE_REGEX.test(phone);
};
exports.validateBulgarianPhone = validateBulgarianPhone;
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
const validateMultilingualContent = (content, requiredLanguages = ['en']) => {
    return requiredLanguages.every(lang => content[lang] && content[lang].trim().length > 0);
};
exports.validateMultilingualContent = validateMultilingualContent;
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
exports.PriceConverter = {
    // Base conversion rates (should be updated from external API in production)
    rates: {
        BGN: { EUR: 0.5113, USD: 0.5476 },
        EUR: { BGN: 1.9558, USD: 1.0714 },
        USD: { BGN: 1.8260, EUR: 0.9334 }
    },
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
    toEur: (price, currency) => {
        if (currency === 'EUR')
            return price;
        return price * exports.PriceConverter.rates[currency].EUR;
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
    convert: (price, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency)
            return price;
        // Convert to EUR first, then to target currency
        const eurAmount = exports.PriceConverter.toEur(price, fromCurrency);
        return eurAmount * exports.PriceConverter.rates.EUR[toCurrency];
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
    format: (price, currency, locale = 'en-US') => {
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
const createSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0400-\u04ff -]/g, '') // Allow Cyrillic characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
exports.createSlug = createSlug;
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
const getLocalizedText = (content, language, fallback = 'en') => {
    return content[language] || content[fallback] || content.en || '';
};
exports.getLocalizedText = getLocalizedText;
/**
 * Generate unique identifier
 * @returns UUID string
 * @example
 * ```typescript
 * const id = generateId(); // "123e4567-e89b-12d3-a456-426614174000"
 * ```
 */
const generateId = () => {
    return crypto.randomUUID();
};
exports.generateId = generateId;
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
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
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
const validateUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};
exports.validateUUID = validateUUID;
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
exports.DateUtils = {
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
    format: (date, locale = 'en-US') => {
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
    isFuture: (date) => {
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
    isPast: (date) => {
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
    daysBetween: (startDate, endDate) => {
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
const sanitizeInput = (input) => {
    return input
        .replace(/[\u00A0-\u9999<>\&]/gim, (i) => {
        return '\u0026#' + i.charCodeAt(0) + ';';
    })
        .trim();
};
exports.sanitizeInput = sanitizeInput;
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
const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'], maxSize = 5 * 1024 * 1024 // 5MB
) => {
    if (!allowedTypes.includes(file.type))
        return false;
    if (file.size > maxSize)
        return false;
    return true;
};
exports.validateFileUpload = validateFileUpload;
//# sourceMappingURL=index.js.map