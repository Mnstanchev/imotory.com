"use strict";
/**
 * User-related types for authentication and user management
 * @module types/user
 * @description
 * Defines all types related to user authentication, profiles, and access control
 * including roles, preferences, and authentication tokens.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSortOption = exports.UserRole = void 0;
/**
 * User roles for access control
 * @enum {string} UserRole
 * @description Defines user permission levels and access rights across the platform
 * @property {string} USER - Standard user with basic permissions (property search, favorites, bookings)
 * @property {string} AGENT - Real estate agent with listing management capabilities
 * @property {string} ADMIN - Administrative user with elevated permissions
 * @property {string} SUPER_ADMIN - Highest level with full system access
 * @example
 * ```typescript
 * const role: UserRole = UserRole.AGENT;
 * const canManageListings = role === UserRole.AGENT || role === UserRole.ADMIN;
 * ```
 */
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["AGENT"] = "agent";
    UserRole["ADMIN"] = "admin";
    UserRole["SUPER_ADMIN"] = "superadmin";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * User sort options
 * @enum {string} UserSortOption
 * @description Available sorting options for user listings
 * @property {string} NAME_ASC - Sort by name ascending
 * @property {string} NAME_DESC - Sort by name descending
 * @property {string} DATE_ASC - Sort by creation date ascending
 * @property {string} DATE_DESC - Sort by creation date descending
 * @property {string} ROLE_ASC - Sort by role ascending
 * @property {string} ROLE_DESC - Sort by role descending
 * @property {string} LAST_LOGIN_ASC - Sort by last login ascending
 * @property {string} LAST_LOGIN_DESC - Sort by last login descending
 */
var UserSortOption;
(function (UserSortOption) {
    UserSortOption["NAME_ASC"] = "name_asc";
    UserSortOption["NAME_DESC"] = "name_desc";
    UserSortOption["DATE_ASC"] = "date_asc";
    UserSortOption["DATE_DESC"] = "date_desc";
    UserSortOption["ROLE_ASC"] = "role_asc";
    UserSortOption["ROLE_DESC"] = "role_desc";
    UserSortOption["LAST_LOGIN_ASC"] = "last_login_asc";
    UserSortOption["LAST_LOGIN_DESC"] = "last_login_desc";
})(UserSortOption || (exports.UserSortOption = UserSortOption = {}));
//# sourceMappingURL=user.js.map