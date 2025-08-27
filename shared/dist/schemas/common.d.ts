/**
 * Common utility schemas for runtime validation
 */
import { z } from 'zod';
/**
 * Schema for supported language codes
 */
export declare const LanguageSchema: z.ZodEnum<{
    en: "en";
    bg: "bg";
    ru: "ru";
}>;
/**
 * Schema for multilingual text validation
 */
export declare const MultilingualTextSchema: z.ZodObject<{
    en: z.ZodString;
    bg: z.ZodString;
    ru: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for geographic coordinates
 */
export declare const CoordinatesSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}, z.core.$strip>;
/**
 * Schema for detailed location information
 */
export declare const LocationSchema: z.ZodObject<{
    address: z.ZodString;
    city: z.ZodString;
    neighborhood: z.ZodOptional<z.ZodString>;
    country: z.ZodString;
    coordinates: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, z.core.$strip>;
    localizedNames: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Schema for API error structure
 */
export declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    field: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for pagination metadata
 */
export declare const PaginationInfoSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
/**
 * Schema for supported currency codes
 */
export declare const CurrencySchema: z.ZodEnum<{
    BGN: "BGN";
    EUR: "EUR";
    USD: "USD";
}>;
/**
 * Schema for image metadata
 */
export declare const ImageSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    order: z.ZodNumber;
}, z.core.$strip>;
/**
 * Schema for price range
 */
export declare const PriceRangeSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
    currency: z.ZodEnum<{
        BGN: "BGN";
        EUR: "EUR";
        USD: "USD";
    }>;
}, z.core.$strip>;
/**
 * Schema for date range
 */
export declare const DateRangeSchema: z.ZodObject<{
    start: z.ZodDate;
    end: z.ZodDate;
}, z.core.$strip>;
/**
 * Generic schema for API responses
 */
export declare const ApiResponseSchema: <T>(dataSchema: z.ZodSchema<T>) => z.ZodObject<{
    data: z.ZodType<T, unknown, z.core.$ZodTypeInternals<T, unknown>>;
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Generic schema for paginated API responses
 */
export declare const PaginatedResponseSchema: <T>(dataSchema: z.ZodSchema<T>) => z.ZodObject<{
    data: z.ZodArray<z.ZodType<T, unknown, z.core.$ZodTypeInternals<T, unknown>>>;
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>;
    errors: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        field: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
//# sourceMappingURL=common.d.ts.map