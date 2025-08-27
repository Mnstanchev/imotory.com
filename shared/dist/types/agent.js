"use strict";
/**
 * Agent-related types for the property platform
 * @module types/agent
 * @description
 * Defines all types related to real estate agents including profiles, metrics,
 * performance tracking, and agent management interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSortOption = void 0;
/**
 * Agent sort options
 * @enum {string} AgentSortOption
 * @description Available sorting options for agent listings
 * @property {string} NAME_ASC - Sort by name in ascending order
 * @property {string} NAME_DESC - Sort by name in descending order
 * @property {string} RATING_ASC - Sort by rating in ascending order
 * @property {string} RATING_DESC - Sort by rating in descending order
 * @property {string} EXPERIENCE_ASC - Sort by experience in ascending order
 * @property {string} EXPERIENCE_DESC - Sort by experience in descending order
 * @property {string} LISTINGS_COUNT_ASC - Sort by listings count in ascending order
 * @property {string} LISTINGS_COUNT_DESC - Sort by listings count in descending order
 */
var AgentSortOption;
(function (AgentSortOption) {
    AgentSortOption["NAME_ASC"] = "name_asc";
    AgentSortOption["NAME_DESC"] = "name_desc";
    AgentSortOption["RATING_ASC"] = "rating_asc";
    AgentSortOption["RATING_DESC"] = "rating_desc";
    AgentSortOption["EXPERIENCE_ASC"] = "experience_asc";
    AgentSortOption["EXPERIENCE_DESC"] = "experience_desc";
    AgentSortOption["LISTINGS_COUNT_ASC"] = "listings_count_asc";
    AgentSortOption["LISTINGS_COUNT_DESC"] = "listings_count_desc";
})(AgentSortOption || (exports.AgentSortOption = AgentSortOption = {}));
//# sourceMappingURL=agent.js.map