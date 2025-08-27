/**
 * Search and filtering types for property listings
 * @module types/search
 * @description
 * Defines all search-related types including filters, sorting, pagination, and search results
 * for property discovery and listing management across the platform.
 */
import { PropertyType, PropertyFeature } from './listing';
import { Location } from './common';
/**
 * Price range for property search filtering
 * @interface PriceRange
 * @description Defines monetary range constraints for property price filtering
 * @property {number} min - Minimum price in specified currency
 * @property {number} max - Maximum price in specified currency
 * @property {string} currency - Currency code (BGN, EUR, USD)
 * @example
 * ```typescript
 * const priceRange: SearchPriceRange = { min: 100000, max: 300000, currency: 'EUR' };
 * ```
 */
export interface SearchPriceRange {
    min: number;
    max: number;
    currency: string;
}
/**
 * Size range for property search filtering
 * @interface SizeRange
 * @description Defines area range constraints for property size filtering
 * @property {number} min - Minimum size in specified unit
 * @property {number} max - Maximum size in specified unit
 * @property {'sqm' | 'sqft' | 'acre'} unit - Unit of measurement for property size
 * @example
 * ```typescript
 * const sizeRange: SizeRange = { min: 100, max: 250, unit: 'sqm' };
 * ```
 */
export interface SizeRange {
    min: number;
    max: number;
    unit: 'sqm' | 'sqft' | 'acre';
}
/**
 * Year range for property search filtering
 * @interface YearRange
 * @description Defines year range constraints for property construction year filtering
 * @property {number} min - Earliest construction year
 * @property {number} max - Latest construction year
 * @example
 * ```typescript
 * const yearRange: YearRange = { min: 1990, max: 2024 };
 * ```
 */
export interface YearRange {
    min: number;
    max: number;
}
/**
 * Location-based search filters
 * @interface LocationFilter
 * @description Geographic filtering options for property searches
 * @property {string} [city] - Target city for property search
 * @property {string} [neighborhood] - Specific neighborhood or district
 * @property {string} [postalCode] - Postal/ZIP code for location targeting
 * @property {number} [distance] - Maximum distance from coordinates in kilometers
 * @property {Object} [coordinates] - Geographic coordinates for distance-based search
 * @property {number} coordinates.lat - Latitude coordinate
 * @property {number} coordinates.lng - Longitude coordinate
 * @example
 * ```typescript
 * const locationFilter: LocationFilter = {
 *   city: 'Sofia',
 *   neighborhood: 'Lozenets',
 *   coordinates: { lat: 42.6977, lng: 23.3219 },
 *   distance: 5
 * };
 * ```
 */
export interface LocationFilter {
    city?: string;
    neighborhood?: string;
    postalCode?: string;
    distance?: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
/**
 * Search filters for property listings
 * @interface SearchFilters
 * @description Comprehensive filtering options for property discovery across multiple criteria
 * @property {PropertyType} [type] - Property type filter (apartment, house, commercial, etc.)
 * @property {SearchPriceRange} [priceRange] - Price range constraints
 * @property {SizeRange} [sizeRange] - Size range constraints
 * @property {YearRange} [yearRange] - Construction year range constraints
 * @property {Object} [bedrooms] - Bedroom count filtering
 * @property {number} bedrooms.min - Minimum number of bedrooms
 * @property {number} [bedrooms.max] - Maximum number of bedrooms (optional)
 * @property {Object} [bathrooms] - Bathroom count filtering
 * @property {number} bathrooms.min - Minimum number of bathrooms
 * @property {number} [bathrooms.max] - Maximum number of bathrooms (optional)
 * @property {PropertyFeature[]} [features] - Required property features and amenities
 * @property {boolean} [hasGarage] - Filter properties with garage
 * @property {boolean} [hasParking] - Filter properties with parking
 * @property {boolean} [isFurnished] - Filter furnished properties
 * @property {boolean} [allowsPets] - Filter pet-friendly properties
 * @property {LocationFilter} [location] - Geographic location filters
 * @property {boolean} [isFeatured] - Filter featured listings
 * @property {string} [agentId] - Filter by specific agent
 * @property {'active' | 'pending' | 'sold' | 'rented'} [status] - Listing status filter
 * @example
 * ```typescript
 * const filters: SearchFilters = {
 *   type: PropertyType.APARTMENT,
 *   priceRange: { min: 100000, max: 300000, currency: 'EUR' },
 *   sizeRange: { min: 80, max: 150, unit: 'sqm' },
 *   bedrooms: { min: 2, max: 4 },
 *   bathrooms: { min: 1, max: 2 },
 *   features: [PropertyFeature.BALCONY, PropertyFeature.GARAGE],
 *   location: { city: 'Sofia', neighborhood: 'Lozenets' },
 *   isFurnished: true,
 *   status: 'active'
 * };
 * ```
 */
export interface SearchFilters {
    type?: PropertyType;
    priceRange?: SearchPriceRange;
    sizeRange?: SizeRange;
    yearRange?: YearRange;
    bedrooms?: {
        min: number;
        max?: number;
    };
    bathrooms?: {
        min: number;
        max?: number;
    };
    features?: PropertyFeature[];
    hasGarage?: boolean;
    hasParking?: boolean;
    isFurnished?: boolean;
    allowsPets?: boolean;
    location?: LocationFilter;
    isFeatured?: boolean;
    agentId?: string;
    status?: 'active' | 'pending' | 'sold' | 'rented';
}
/**
 * Sort options for search results
 * @enum {string} SearchSortOption
 * @description Available sorting criteria for property search results
 * @property {string} PRICE_ASC - Sort by price ascending (lowest first)
 * @property {string} PRICE_DESC - Sort by price descending (highest first)
 * @property {string} SIZE_ASC - Sort by property size ascending
 * @property {string} SIZE_DESC - Sort by property size descending
 * @property {string} DATE_DESC - Sort by listing date descending (newest first)
 * @property {string} DATE_ASC - Sort by listing date ascending (oldest first)
 * @property {string} DISTANCE_ASC - Sort by distance from search center ascending
 * @property {string} FEATURED_FIRST - Prioritize featured listings
 * @property {string} POPULARITY_DESC - Sort by popularity/views descending
 */
export declare enum SearchSortOption {
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    SIZE_ASC = "size_asc",
    SIZE_DESC = "size_desc",
    DATE_DESC = "date_desc",
    DATE_ASC = "date_asc",
    DISTANCE_ASC = "distance_asc",
    FEATURED_FIRST = "featured_first",
    POPULARITY_DESC = "popularity_desc"
}
/**
 * Pagination parameters
 * @interface PaginationParams
 * @description Pagination configuration for search result management
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {number} offset - Number of items to skip (calculated automatically)
 * @example
 * ```typescript
 * const pagination: PaginationParams = { page: 1, limit: 20, offset: 0 };
 * ```
 */
export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}
/**
 * Search query parameters
 * @interface SearchQuery
 * @description Complete search query structure including text search, filters, sorting, and pagination
 * @property {string} [query] - Full-text search string for property titles and descriptions
 * @property {SearchFilters} filters - Comprehensive property filtering criteria
 * @property {SearchSortOption} sort - Sorting preference for results
 * @property {PaginationParams} pagination - Pagination configuration
 * @example
 * ```typescript
 * const searchQuery: SearchQuery = {
 *   query: 'luxury apartment sofia',
 *   filters: {
 *     type: PropertyType.APARTMENT,
 *     priceRange: { min: 200000, max: 500000, currency: 'EUR' },
 *     location: { city: 'Sofia' }
 *   },
 *   sort: SearchSortOption.PRICE_DESC,
 *   pagination: { page: 1, limit: 20, offset: 0 }
 * };
 * ```
 */
export interface SearchQuery {
    query?: string;
    filters: SearchFilters;
    sort: SearchSortOption;
    pagination: PaginationParams;
}
/**
 * Search result item
 * @interface SearchResult
 * @description Individual property listing in search results with essential information
 * @property {string} id - Unique property identifier
 * @property {string} title - Property listing title
 * @property {string} description - Brief property description
 * @property {number} price - Property price in specified currency
 * @property {string} currency - Currency code (BGN, EUR, USD)
 * @property {PropertyType} type - Property type classification
 * @property {number} size - Property size in square meters
 * @property {number} bedrooms - Number of bedrooms
 * @property {number} bathrooms - Number of bathrooms
 * @property {Location} location - Complete location information
 * @property {string[]} images - Array of property image URLs
 * @property {string} agentId - Listing agent identifier
 * @property {boolean} isFeatured - Whether listing is featured/promoted
 * @property {number} [distance] - Distance from search center in kilometers
 * @property {number} [relevanceScore] - Search relevance score (0-1 scale)
 * @example
 * ```typescript
 * const searchResult: SearchResult = {
 *   id: 'listing-123',
 *   title: 'Luxury 3-Bedroom Apartment in Lozenets',
 *   description: 'Spacious modern apartment with panoramic views',
 *   price: 350000,
 *   currency: 'EUR',
 *   type: PropertyType.APARTMENT,
 *   size: 120,
 *   bedrooms: 3,
 *   bathrooms: 2,
 *   location: {
 *     address: '123 Main St, Sofia',
 *     city: 'Sofia',
 *     country: 'Bulgaria',
 *     coordinates: { latitude: 42.6977, longitude: 23.3219 }
 *   },
 *   images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
 *   agentId: 'agent-456',
 *   isFeatured: true,
 *   distance: 2.5,
 *   relevanceScore: 0.95
 * };
 * ```
 */
export interface SearchResult {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    type: PropertyType;
    size: number;
    bedrooms: number;
    bathrooms: number;
    location: Location;
    images: string[];
    agentId: string;
    isFeatured: boolean;
    distance?: number;
    relevanceScore?: number;
}
/**
 * Search response structure
 * @interface SearchResponse
 * @description Complete response structure for property search queries
 * @property {SearchResult[]} results - Array of matching property listings
 * @property {number} total - Total number of matching listings
 * @property {number} page - Current page number
 * @property {number} limit - Number of items per page
 * @property {number} totalPages - Total number of available pages
 * @property {boolean} hasNext - Whether next page is available
 * @property {boolean} hasPrev - Whether previous page is available
 * @example
 * ```typescript
 * const response: SearchResponse = {
 *   results: [searchResult1, searchResult2],
 *   total: 45,
 *   page: 1,
 *   limit: 20,
 *   totalPages: 3,
 *   hasNext: true,
 *   hasPrev: false
 * };
 * ```
 */
export interface SearchResponse {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
/**
 * Saved search criteria
 * @interface SavedSearch
 * @description User-saved search configuration for repeated searches and notifications
 * @property {string} id - Unique saved search identifier
 * @property {string} userId - Owner user identifier
 * @property {string} name - Descriptive name for the saved search
 * @property {SearchQuery} query - Complete search query configuration
 * @property {boolean} isActive - Whether saved search is currently active
 * @property {boolean} notificationEnabled - Enable notifications for new matching listings
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @example
 * ```typescript
 * const savedSearch: SavedSearch = {
 *   id: 'saved-789',
 *   userId: 'user-123',
 *   name: 'Luxury Apartments in Sofia',
 *   query: searchQuery,
 *   isActive: true,
 *   notificationEnabled: true,
 *   createdAt: new Date('2024-01-15'),
 *   updatedAt: new Date('2024-12-01')
 * };
 * ```
 */
export interface SavedSearch {
    id: string;
    userId: string;
    name: string;
    query: SearchQuery;
    isActive: boolean;
    notificationEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Search suggestions for autocomplete
 * @interface SearchSuggestion
 * @description Autocomplete suggestions for search input enhancement
 * @property {'city' | 'neighborhood' | 'agent' | 'property'} type - Type of suggestion
 * @property {string} value - Actual search value to use
 * @property {string} label - Display label for the suggestion
 * @property {Record<string, any>} [metadata] - Additional context data
 * @example
 * ```typescript
 * const suggestion: SearchSuggestion = {
 *   type: 'neighborhood',
 *   value: 'Lozenets',
 *   label: 'Lozenets, Sofia',
 *   metadata: { city: 'Sofia', listingCount: 45 }
 * };
 * ```
 */
export interface SearchSuggestion {
    type: 'city' | 'neighborhood' | 'agent' | 'property';
    value: string;
    label: string;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=search.d.ts.map