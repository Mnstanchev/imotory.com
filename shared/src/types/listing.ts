/**
 * Property listing types for the real estate platform
 * @module types/listing
 * @description
 * Defines all types related to property listings including property types,
 * features, specifications, and listing management interfaces.
 */

import { MultilingualText, Location, Currency, Image } from './common';

/**
 * Types of properties available in the system
 * @enum {string} PropertyType
 * @description Defines the different types of properties that can be listed on the platform
 * @property {string} HOUSE - Detached or semi-detached residential house
 * @property {string} APARTMENT - Residential apartment or flat in a building
 * @property {string} VILLA - Luxury villa or mansion, typically standalone
 * @property {string} OFFICE - Commercial office space for business use
 * @property {string} COMMERCIAL - Commercial property (shops, restaurants, retail)
 * @property {string} LAND - Empty land or plot for development
 * @example
 * ```typescript
 * const propertyType: PropertyType = PropertyType.APARTMENT;
 * ```
 */
export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  LAND = 'LAND',
  OFFICE = 'OFFICE',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  PENTHOUSE = 'PENTHOUSE',
  STUDIO = 'STUDIO',
  DUPLEX = 'DUPLEX',
  LOFT = 'LOFT'
}

/**
 * Status of property listings for lifecycle management
 * @enum {string} ListingStatus
 * @description Tracks the current state of a property listing in the system
 * @property {string} ACTIVE - Publicly visible and searchable
 * @property {string} PENDING - Under review or awaiting approval
 * @property {string} SOLD - Property has been sold
 * @property {string} RENTED - Property has been rented
 * @property {string} INACTIVE - Hidden from search but not deleted
 * @example
 * ```typescript
 * const status: ListingStatus = ListingStatus.ACTIVE;
 * ```
 */
export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION'
}

/**
 * Types of listing transactions
 * @enum {string} ListingType
 */
export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
  LEASE = 'LEASE',
  AUCTION = 'AUCTION'
}

/**
 * Heating system types
 * @enum {string} HeatingType
 */
export enum HeatingType {
  NONE = 'NONE',
  CENTRAL = 'CENTRAL',
  ELECTRIC = 'ELECTRIC',
  GAS = 'GAS',
  WOOD = 'WOOD',
  SOLAR = 'SOLAR',
  HEATPUMP = 'HEATPUMP'
}

/**
 * Property ownership types
 * @enum {string} OwnershipType
 */
export enum OwnershipType {
  FREEHOLD = 'FREEHOLD',
  LEASEHOLD = 'LEASEHOLD',
  COOPERATIVE = 'COOPERATIVE'
}

/**
 * Building construction types
 * @enum {string} BuildingType
 */
export enum BuildingType {
  PANEL = 'PANEL',
  BRICK = 'BRICK',
  NEW_BUILD = 'NEW_BUILD',
  MONOLITHIC = 'MONOLITHIC',
  WOOD = 'WOOD',
  PREFAB = 'PREFAB'
}

/**
 * Features and amenities that properties can offer
 * @enum {string} PropertyFeature
 * @description Comprehensive list of searchable property features and amenities
 * @property {string} BALCONY - Property has a balcony
 * @property {string} GARDEN - Property includes a garden
 * @property {string} PARKING - Dedicated parking space available
 * @property {string} POOL - Swimming pool (private or building)
 * @property {string} ELEVATOR - Building has elevator/lift
 * @property {string} AIR_CONDITIONING - Climate control system
 * @property {string} HEATING - Central or individual heating
 * @property {string} SECURITY_SYSTEM - Security system or guard
 * @property {string} INTERNET - High-speed internet available
 * @property {string} FURNISHED - Property comes furnished
 * @property {string} PETS_ALLOWED - Pets are permitted
 * @example
 * ```typescript
 * const features: PropertyFeature[] = [
 *   PropertyFeature.BALCONY,
 *   PropertyFeature.PARKING,
 *   PropertyFeature.ELEVATOR
 * ];
 * ```
 */
export enum PropertyFeature {
  BALCONY = 'balcony',
  GARDEN = 'garden',
  PARKING = 'parking',
  POOL = 'pool',
  ELEVATOR = 'elevator',
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating',
  SECURITY_SYSTEM = 'security_system',
  INTERNET = 'internet',
  FURNISHED = 'furnished',
  PETS_ALLOWED = 'pets_allowed'
}

/**
 * Property specifications and technical details
 * @interface PropertySpecs
 * @description Detailed specifications for a property including size, rooms, and construction details
 * @property {number} bedrooms - Number of bedrooms (minimum: 0)
 * @property {number} bathrooms - Number of bathrooms (minimum: 0)
 * @property {number} size - Total living area in square meters (m²)
 * @property {number} [yearBuilt] - Year the property was constructed (optional)
 * @property {number} [floors] - Total number of floors in the building (for houses)
 * @property {number} [floor] - Floor number for apartments (ground floor = 1)
 * @property {boolean} hasGarage - Whether the property has a garage
 * @property {number} [parkingSpaces] - Number of dedicated parking spaces
 * @property {string} [energyRating] - Energy efficiency rating (A-G scale)
 * @property {string} [constructionType] - Type of construction (e.g., 'brick', 'panel', 'monolith')
 * @example
 * ```typescript
 * const specs: PropertySpecs = {
 *   bedrooms: 3,
 *   bathrooms: 2,
 *   size: 120,
 *   yearBuilt: 2020,
 *   floor: 5,
 *   hasGarage: true,
 *   parkingSpaces: 1,
 *   energyRating: 'A',
 *   constructionType: 'monolith'
 * };
 * ```
 */
export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  size: number; // in square meters
  yearBuilt?: number;
  floors?: number;
  floor?: number; // for apartments
  hasGarage: boolean;
  parkingSpaces?: number;
  energyRating?: string;
  constructionType?: string;
}

/**
 * Property listing interface
 */
export interface Listing {
  id: string;
  slug: string;
  title: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  price: number;
  currency: Currency;
  type: PropertyType;
  status: ListingStatus;
  specifications: PropertySpecs;
  features: PropertyFeature[];
  location: Location;
  images: Image[];
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
}

/**
 * Input type for creating new listings
 */
export interface CreateListingInput {
  title: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  price: number;
  currency: Currency;
  type: PropertyType;
  specifications: PropertySpecs;
  features: PropertyFeature[];
  location: Location;
  agentId: string;
  images: Image[];
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
}

/**
 * Input type for updating existing listings
 */
export type UpdateListingInput = Partial<CreateListingInput>;

/**
 * Search filters for property listings
 */
export interface ListingFilters {
  type?: PropertyType;
  status?: ListingStatus;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  features?: PropertyFeature[];
  city?: string;
  neighborhood?: string;
  isFeatured?: boolean;
  agentId?: string;
}

/**
 * Sort options for listing results
 */
export enum ListingSortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  SIZE_ASC = 'size_asc',
  SIZE_DESC = 'size_desc',
  VIEWS_DESC = 'views_desc',
  FEATURED_FIRST = 'featured_first'
}