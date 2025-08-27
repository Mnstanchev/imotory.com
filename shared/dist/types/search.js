"use strict";
/**
 * Search and filtering types for property listings
 * @module types/search
 * @description
 * Defines all search-related types including filters, sorting, pagination, and search results
 * for property discovery and listing management across the platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSortOption = void 0;
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
var SearchSortOption;
(function (SearchSortOption) {
    SearchSortOption["PRICE_ASC"] = "price_asc";
    SearchSortOption["PRICE_DESC"] = "price_desc";
    SearchSortOption["SIZE_ASC"] = "size_asc";
    SearchSortOption["SIZE_DESC"] = "size_desc";
    SearchSortOption["DATE_DESC"] = "date_desc";
    SearchSortOption["DATE_ASC"] = "date_asc";
    SearchSortOption["DISTANCE_ASC"] = "distance_asc";
    SearchSortOption["FEATURED_FIRST"] = "featured_first";
    SearchSortOption["POPULARITY_DESC"] = "popularity_desc";
})(SearchSortOption || (exports.SearchSortOption = SearchSortOption = {}));
//# sourceMappingURL=search.js.map