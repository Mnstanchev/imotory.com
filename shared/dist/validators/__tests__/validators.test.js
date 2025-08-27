"use strict";
/**
 * Tests for validation utilities
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const validators = __importStar(require("../index"));
(0, globals_1.describe)('Validation Utilities', () => {
    (0, globals_1.describe)('Bulgarian Phone Validation', () => {
        (0, globals_1.it)('should validate correct Bulgarian phone numbers', () => {
            (0, globals_1.expect)(validators.validateBulgarianPhone('+359888123456')).toBe(true);
            (0, globals_1.expect)(validators.validateBulgarianPhone('0888123456')).toBe(true);
            (0, globals_1.expect)(validators.validateBulgarianPhone('+35929876543')).toBe(true);
        });
        (0, globals_1.it)('should reject invalid phone numbers', () => {
            (0, globals_1.expect)(validators.validateBulgarianPhone('123456789')).toBe(false);
            (0, globals_1.expect)(validators.validateBulgarianPhone('invalid')).toBe(false);
        });
    });
    (0, globals_1.describe)('URL Slug Generation', () => {
        (0, globals_1.it)('should create valid slugs from titles', () => {
            (0, globals_1.expect)(validators.createSlug('Luxury Apartment in Sofia')).toBe('luxury-apartment-in-sofia');
            (0, globals_1.expect)(validators.createSlug('  Multiple   Spaces  ')).toBe('multiple-spaces');
        });
        (0, globals_1.it)('should handle non-Latin characters', () => {
            (0, globals_1.expect)(validators.createSlug('Апартамент в София')).toBe('апартамент-в-софия');
        });
    });
    (0, globals_1.describe)('Email and UUID Validation', () => {
        (0, globals_1.it)('should validate email formats', () => {
            (0, globals_1.expect)(validators.validateEmail('user@example.com')).toBe(true);
            (0, globals_1.expect)(validators.validateEmail('invalid-email')).toBe(false);
        });
        (0, globals_1.it)('should validate UUID formats', () => {
            (0, globals_1.expect)(validators.validateUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
            (0, globals_1.expect)(validators.validateUUID('invalid-uuid')).toBe(false);
        });
    });
    (0, globals_1.describe)('Date Utilities', () => {
        (0, globals_1.it)('should check future and past dates', () => {
            const futureDate = new Date('2030-01-01');
            const pastDate = new Date('2020-01-01');
            (0, globals_1.expect)(validators.DateUtils.isFuture(futureDate)).toBe(true);
            (0, globals_1.expect)(validators.DateUtils.isPast(pastDate)).toBe(true);
        });
        (0, globals_1.it)('should calculate days between dates', () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-15');
            const days = validators.DateUtils.daysBetween(startDate, endDate);
            (0, globals_1.expect)(days).toBe(14);
        });
    });
    (0, globals_1.describe)('Price Converter', () => {
        (0, globals_1.it)('should convert between currencies', () => {
            const usdPrice = validators.PriceConverter.convert(1000, 'BGN', 'USD');
            (0, globals_1.expect)(usdPrice).toBeCloseTo(547.8, 1);
        });
        (0, globals_1.it)('should handle same currency conversion', () => {
            const result = validators.PriceConverter.convert(1000, 'EUR', 'EUR');
            (0, globals_1.expect)(result).toBe(1000);
        });
    });
});
//# sourceMappingURL=validators.test.js.map