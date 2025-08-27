"use strict";
/**
 * Property listing types for the real estate platform
 * @module types/listing
 * @description
 * Defines all types related to property listings including property types,
 * features, specifications, and listing management interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingSortOption = exports.PropertyFeature = exports.BuildingType = exports.OwnershipType = exports.HeatingType = exports.ListingType = exports.ListingStatus = exports.PropertyType = void 0;
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
var PropertyType;
(function (PropertyType) {
    PropertyType["HOUSE"] = "HOUSE";
    PropertyType["APARTMENT"] = "APARTMENT";
    PropertyType["VILLA"] = "VILLA";
    PropertyType["LAND"] = "LAND";
    PropertyType["OFFICE"] = "OFFICE";
    PropertyType["COMMERCIAL"] = "COMMERCIAL";
    PropertyType["INDUSTRIAL"] = "INDUSTRIAL";
    PropertyType["PENTHOUSE"] = "PENTHOUSE";
    PropertyType["STUDIO"] = "STUDIO";
    PropertyType["DUPLEX"] = "DUPLEX";
    PropertyType["LOFT"] = "LOFT";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
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
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["ACTIVE"] = "ACTIVE";
    ListingStatus["RESERVED"] = "RESERVED";
    ListingStatus["SOLD"] = "SOLD";
    ListingStatus["INACTIVE"] = "INACTIVE";
    ListingStatus["UNDER_CONSTRUCTION"] = "UNDER_CONSTRUCTION";
})(ListingStatus || (exports.ListingStatus = ListingStatus = {}));
/**
 * Types of listing transactions
 * @enum {string} ListingType
 */
var ListingType;
(function (ListingType) {
    ListingType["SALE"] = "SALE";
    ListingType["RENT"] = "RENT";
    ListingType["LEASE"] = "LEASE";
    ListingType["AUCTION"] = "AUCTION";
})(ListingType || (exports.ListingType = ListingType = {}));
/**
 * Heating system types
 * @enum {string} HeatingType
 */
var HeatingType;
(function (HeatingType) {
    HeatingType["NONE"] = "NONE";
    HeatingType["CENTRAL"] = "CENTRAL";
    HeatingType["ELECTRIC"] = "ELECTRIC";
    HeatingType["GAS"] = "GAS";
    HeatingType["WOOD"] = "WOOD";
    HeatingType["SOLAR"] = "SOLAR";
    HeatingType["HEATPUMP"] = "HEATPUMP";
})(HeatingType || (exports.HeatingType = HeatingType = {}));
/**
 * Property ownership types
 * @enum {string} OwnershipType
 */
var OwnershipType;
(function (OwnershipType) {
    OwnershipType["FREEHOLD"] = "FREEHOLD";
    OwnershipType["LEASEHOLD"] = "LEASEHOLD";
    OwnershipType["COOPERATIVE"] = "COOPERATIVE";
})(OwnershipType || (exports.OwnershipType = OwnershipType = {}));
/**
 * Building construction types
 * @enum {string} BuildingType
 */
var BuildingType;
(function (BuildingType) {
    BuildingType["PANEL"] = "PANEL";
    BuildingType["BRICK"] = "BRICK";
    BuildingType["NEW_BUILD"] = "NEW_BUILD";
    BuildingType["MONOLITHIC"] = "MONOLITHIC";
    BuildingType["WOOD"] = "WOOD";
    BuildingType["PREFAB"] = "PREFAB";
})(BuildingType || (exports.BuildingType = BuildingType = {}));
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
var PropertyFeature;
(function (PropertyFeature) {
    PropertyFeature["BALCONY"] = "balcony";
    PropertyFeature["GARDEN"] = "garden";
    PropertyFeature["PARKING"] = "parking";
    PropertyFeature["POOL"] = "pool";
    PropertyFeature["ELEVATOR"] = "elevator";
    PropertyFeature["AIR_CONDITIONING"] = "air_conditioning";
    PropertyFeature["HEATING"] = "heating";
    PropertyFeature["SECURITY_SYSTEM"] = "security_system";
    PropertyFeature["INTERNET"] = "internet";
    PropertyFeature["FURNISHED"] = "furnished";
    PropertyFeature["PETS_ALLOWED"] = "pets_allowed";
})(PropertyFeature || (exports.PropertyFeature = PropertyFeature = {}));
/**
 * Sort options for listing results
 */
var ListingSortOption;
(function (ListingSortOption) {
    ListingSortOption["PRICE_ASC"] = "price_asc";
    ListingSortOption["PRICE_DESC"] = "price_desc";
    ListingSortOption["DATE_ASC"] = "date_asc";
    ListingSortOption["DATE_DESC"] = "date_desc";
    ListingSortOption["SIZE_ASC"] = "size_asc";
    ListingSortOption["SIZE_DESC"] = "size_desc";
    ListingSortOption["VIEWS_DESC"] = "views_desc";
    ListingSortOption["FEATURED_FIRST"] = "featured_first";
})(ListingSortOption || (exports.ListingSortOption = ListingSortOption = {}));
//# sourceMappingURL=listing.js.map