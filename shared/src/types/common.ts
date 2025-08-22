/**
 * Common utility types for the property website shared package
 * @module types/common
 * @description
 * Provides foundational types used across the entire application including
 * multilingual support, location data, API responses, and basic data structures.
 */

/**
 * Supported language codes for multilingual content across the platform
 * @typedef {'en' | 'bg' | 'ru'} Language
 * @description
 * - `en`: English - Primary language for international users and expats
 * - `bg`: Bulgarian - Native language for Bulgarian market (primary audience)
 * - `ru`: Russian - Secondary language for Russian-speaking users
 * @example
 * ```typescript
 * const language: Language = 'bg';
 * const title: MultilingualText = { en: 'Apartment', bg: 'Апартамент', ru: 'Квартира' };
 * ```
 */
export type Language = 'en' | 'bg' | 'ru';

/**
 * Multilingual text object for content that needs to be available in multiple languages
 * @interface MultilingualText
 * @property {string} [en] - English text content (optional for partial translations)
 * @property {string} [bg] - Bulgarian text content (optional for partial translations)
 * @property {string} [ru] - Russian text content (optional for partial translations)
 * @description
 * Used throughout the application for any user-facing text that needs to support
 * multiple languages. All properties are optional to allow for partial translations.
 * @example
 * ```typescript
 * const title: MultilingualText = {
 *   en: 'Luxury Apartment',
 *   bg: 'Луксозен апартамент',
 *   ru: 'Роскошная квартира'
 * };
 * 
 * const description: MultilingualText = {
 *   bg: 'Просторен апартамент в центъра' // Bulgarian only
 * };
 * ```
 */
export interface MultilingualText {
  en?: string;
  bg?: string;
  ru?: string;
}

/**
 * Geographic coordinates for property locations and mapping functionality
 * @interface Coordinates
 * @property {number} latitude - Latitude coordinate (-90 to 90 degrees)
 * @property {number} longitude - Longitude coordinate (-180 to 180 degrees)
 * @description
 * Used for property locations, search radius calculations, and integration
 * with mapping services like Google Maps or OpenStreetMap.
 * @example
 * ```typescript
 * const sofiaCenter: Coordinates = {
 *   latitude: 42.6977,
 *   longitude: 23.3219
 * };
 * ```
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Complete location information for properties with multilingual support
 * @interface Location
 * @property {string} address - Full street address
 * @property {string} city - City or town name
 * @property {string} [neighborhood] - Neighborhood, district, or area name (optional)
 * @property {string} country - Country name
 * @property {Coordinates} coordinates - Geographic coordinates for mapping
 * @property {MultilingualText} localizedNames - Localized names for city and neighborhood
 * @description
 * Provides complete location information for properties including address,
 * coordinates for mapping, and localized names in multiple languages.
 * @example
 * ```typescript
 * const location: Location = {
 *   address: '123 Vitosha Boulevard',
 *   city: 'Sofia',
 *   neighborhood: 'City Center',
 *   country: 'Bulgaria',
 *   coordinates: { latitude: 42.6977, longitude: 23.3219 },
 *   localizedNames: {
 *     en: 'Sofia City Center',
 *     bg: 'Център на София',
 *     ru: 'Центр Софии'
 *   }
 * };
 * ```
 */
export interface Location {
  address: string;
  city: string;
  neighborhood?: string;
  country: string;
  coordinates: Coordinates;
  localizedNames: MultilingualText;
}

/**
 * Standardized API error structure for consistent error responses
 * @interface ApiError
 * @property {string} code - Machine-readable error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
 * @property {string} message - Human-readable error message
 * @property {string} [field] - Specific field that caused the error (for form validation)
 * @description
 * Provides consistent error structure across all API endpoints for better
 * error handling and debugging on both frontend and backend.
 * @example
 * ```typescript
 * const error: ApiError = {
 *   code: 'VALIDATION_ERROR',
 *   message: 'Invalid email format',
 *   field: 'email'
 * };
 * ```
 */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Generic API response wrapper for consistent response format across all endpoints
 * @interface ApiResponse
 * @template T - The type of data being returned in the response
 * @property {T} data - The actual response data
 * @property {boolean} success - Whether the request was successful
 * @property {string} [message] - Optional informational message
 * @property {ApiError[]} [errors] - Array of errors if success is false
 * @description
 * Standardized response format used by all API endpoints to ensure consistent
 * handling of both successful and failed requests.
 * @example
 * ```typescript
 * const response: ApiResponse<Listing> = {
 *   data: listing,
 *   success: true,
 *   message: 'Listing retrieved successfully'
 * };
 * 
 * const errorResponse: ApiResponse<null> = {
 *   data: null,
 *   success: false,
 *   errors: [{
 *     code: 'NOT_FOUND',
 *     message: 'Listing not found'
 *   }]
 * };
 * ```
 */
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ApiError[];
}

/**
 * Pagination metadata for paginated API responses
 * @interface PaginationInfo
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} totalPages - Total number of available pages
 * @description
 * Provides pagination metadata for list endpoints to help clients
 * implement pagination controls and understand the complete dataset.
 * @example
 * ```typescript
 * const pagination: PaginationInfo = {
 *   page: 1,
 *   limit: 20,
 *   total: 150,
 *   totalPages: 8
 * };
 * ```
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response combining data and pagination metadata
 * @interface PaginatedResponse
 * @template T - The type of items in the response array
 * @extends {ApiResponse<T[]>}
 * @property {T[]} data - Array of items for the current page
 * @property {PaginationInfo} pagination - Pagination metadata
 * @description
 * Combines the generic API response with pagination information for list endpoints.
 * Used for search results, listings, users, and other collection endpoints.
 * @example
 * ```typescript
 * const response: PaginatedResponse<Listing> = {
 *   data: [listing1, listing2, listing3],
 *   success: true,
 *   message: 'Listings retrieved successfully',
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 150,
 *     totalPages: 8
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * Supported currency codes for property prices and financial transactions
 * @typedef {'BGN' | 'EUR' | 'USD'} Currency
 * @description
 * - `BGN`: Bulgarian Lev - Local currency, primarily used for Bulgarian market
 * - `EUR`: Euro - International currency, commonly used for premium properties
 * - `USD`: US Dollar - International currency for global users
 * @example
 * ```typescript
 * const price: Currency = 'EUR';
 * const priceRange: PriceRange = { min: 100000, max: 200000, currency: 'EUR' };
 * ```
 */
export type Currency = 'BGN' | 'EUR' | 'USD';

/**
 * Image metadata for property images, user avatars, and other media
 * @interface Image
 * @property {string} id - Unique identifier for the image
 * @property {string} url - Public URL to access the image
 * @property {string} [alt] - Alternative text for accessibility and SEO
 * @property {number} width - Image width in pixels
 * @property {number} height - Image height in pixels
 * @property {number} order - Display order for gallery sorting (0-indexed)
 * @description
 * Standardized image metadata used for property galleries, user avatars,
 * agent photos, and other media assets across the platform.
 * @example
 * ```typescript
 * const image: Image = {
 *   id: 'img-123',
 *   url: 'https://cdn.example.com/properties/123/main.jpg',
 *   alt: 'Living room with modern furniture',
 *   width: 1920,
 *   height: 1080,
 *   order: 0
 * };
 * ```
 */
export interface Image {
  id: string;
  url: string;
  alt?: string;
  width: number;
  height: number;
  order: number;
}

/**
 * Price range for filtering and validation purposes
 * @interface PriceRange
 * @property {number} min - Minimum price in the specified currency
 * @property {number} max - Maximum price in the specified currency
 * @property {Currency} currency - Currency code for the price range
 * @description
 * Used for search filters, validation, and displaying price ranges.
 * All prices are in the specified currency to avoid conversion issues.
 * @example
 * ```typescript
 * const priceRange: PriceRange = {
 *   min: 100000,
 *   max: 500000,
 *   currency: 'EUR'
 * };
 * ```
 */
export interface PriceRange {
  min: number;
  max: number;
  currency: Currency;
}

/**
 * Date range for filtering and validation purposes
 * @interface DateRange
 * @property {Date} start - Start date (inclusive)
 * @property {Date} end - End date (inclusive)
 * @description
 * Used for date-based filtering in search queries, availability checks,
 * and booking date validation.
 * @example
 * ```typescript
 * const dateRange: DateRange = {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-12-31')
 * };
 * ```
 */
export interface DateRange {
  start: Date;
  end: Date;
}