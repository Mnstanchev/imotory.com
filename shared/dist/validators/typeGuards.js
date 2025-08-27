"use strict";
/**
 * Type guard functions for runtime type validation using Zod schemas
 * Provides runtime type checking for all domain objects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBestTime = exports.isContactMethod = exports.isContactUrgency = exports.isContactCategory = exports.isContactLanguage = exports.isSubscriptionFilters = exports.isContactFormFilters = exports.isNewsletterSubscription = exports.isExtendedContactForm = exports.isContactForm = exports.isNotificationPreferences = exports.isAlertPriority = exports.isAlertType = exports.isAlertFilters = exports.isCreateAlertInput = exports.isAlert = exports.isYearRange = exports.isSizeRange = exports.isPriceRange = exports.isSearchSortOption = exports.isSearchResult = exports.isSearchFilters = exports.isContactInfo = exports.isBookingStatus = exports.isVisitType = exports.isBookingFilters = exports.isUpdateBookingInput = exports.isCreateBookingInput = exports.isBooking = exports.isRegisterInput = exports.isLoginInput = exports.isUserFilters = exports.isUpdateUserInput = exports.isCreateUserInput = exports.isUser = exports.isAgentFilters = exports.isUpdateAgentInput = exports.isCreateAgentInput = exports.isAgent = exports.isUpdateListingInput = exports.isCreateListingInput = exports.isListingSortOption = exports.isListingFilters = exports.isListing = exports.isPropertyFeature = exports.isListingStatus = exports.isPropertyType = exports.isLanguage = exports.isCurrency = exports.isMultilingualText = void 0;
exports.isPartial = exports.hasRequiredProperties = exports.validateArray = exports.safeValidateNewsletterSubscription = exports.safeValidateContactForm = exports.safeValidateAlert = exports.safeValidateBooking = exports.safeValidateUser = exports.safeValidateAgent = exports.safeValidateListing = exports.safeValidateLanguage = exports.safeValidateCurrency = exports.safeValidateMultilingualText = exports.validateNewsletterSubscription = exports.validateContactForm = exports.validateAlert = exports.validateBooking = exports.validateUser = exports.validateAgent = exports.validateListing = exports.validateLanguage = exports.validateCurrency = exports.validateMultilingualText = exports.isBudget = exports.isTimeline = void 0;
// Import all schemas for validation
const common_1 = require("../schemas/common");
const listing_1 = require("../schemas/listing");
const listing_2 = require("../schemas/listing");
const agent_1 = require("../schemas/agent");
const user_1 = require("../schemas/user");
const booking_1 = require("../schemas/booking");
const search_1 = require("../schemas/search");
const alert_1 = require("../schemas/alert");
const contact_1 = require("../schemas/contact");
/**
 * Generic type guard function creator
 * @param schema - Zod schema to validate against
 * @returns Type guard function for the given schema
 */
function createTypeGuard(schema) {
    return (value) => {
        try {
            schema.parse(value);
            return true;
        }
        catch {
            return false;
        }
    };
}
/**
 * Generic validation function creator
 * @param schema - Zod schema to validate against
 * @returns Validation function that returns parsed object or throws error
 */
function createValidator(schema) {
    return (value) => {
        return schema.parse(value);
    };
}
/**
 * Generic safe validation function creator
 * @param schema - Zod schema to validate against
 * @returns Safe validation function that returns result object
 */
function createSafeValidator(schema) {
    return (value) => {
        return schema.safeParse(value);
    };
}
// Common type guards
exports.isMultilingualText = createTypeGuard(common_1.MultilingualTextSchema);
exports.isCurrency = createTypeGuard(common_1.CurrencySchema);
exports.isLanguage = createTypeGuard(common_1.LanguageSchema);
exports.isPropertyType = createTypeGuard(listing_1.PropertyTypeSchema);
exports.isListingStatus = createTypeGuard(listing_1.ListingStatusSchema);
exports.isPropertyFeature = createTypeGuard(listing_1.PropertyFeatureSchema);
// Listing type guards
exports.isListing = createTypeGuard(listing_2.ListingSchema);
exports.isListingFilters = createTypeGuard(listing_2.ListingFiltersSchema);
exports.isListingSortOption = createTypeGuard(listing_2.ListingSortOptionSchema);
exports.isCreateListingInput = createTypeGuard(listing_2.CreateListingInputSchema);
exports.isUpdateListingInput = createTypeGuard(listing_2.UpdateListingInputSchema);
// Agent type guards
exports.isAgent = createTypeGuard(agent_1.AgentSchema);
exports.isCreateAgentInput = createTypeGuard(agent_1.CreateAgentInputSchema);
exports.isUpdateAgentInput = createTypeGuard(agent_1.UpdateAgentInputSchema);
exports.isAgentFilters = createTypeGuard(agent_1.AgentFiltersSchema);
// User type guards
exports.isUser = createTypeGuard(user_1.UserSchema);
exports.isCreateUserInput = createTypeGuard(user_1.RegisterUserInputSchema);
exports.isUpdateUserInput = createTypeGuard(user_1.UpdateUserProfileInputSchema);
exports.isUserFilters = createTypeGuard(user_1.UserFiltersSchema);
exports.isLoginInput = createTypeGuard(user_1.LoginCredentialsSchema);
exports.isRegisterInput = createTypeGuard(user_1.RegisterUserInputSchema);
// Booking type guards
exports.isBooking = createTypeGuard(booking_1.BookingSchema);
exports.isCreateBookingInput = createTypeGuard(booking_1.CreateBookingInputSchema);
exports.isUpdateBookingInput = createTypeGuard(booking_1.UpdateBookingInputSchema);
exports.isBookingFilters = createTypeGuard(booking_1.BookingFiltersSchema);
exports.isVisitType = createTypeGuard(booking_1.VisitTypeSchema);
exports.isBookingStatus = createTypeGuard(booking_1.BookingStatusSchema);
exports.isContactInfo = createTypeGuard(booking_1.ContactInfoSchema);
// Search type guards
exports.isSearchFilters = createTypeGuard(search_1.SearchFiltersSchema);
exports.isSearchResult = createTypeGuard(search_1.SearchResultSchema);
exports.isSearchSortOption = createTypeGuard(search_1.SearchSortOptionSchema);
exports.isPriceRange = createTypeGuard(search_1.SearchPriceRangeSchema);
exports.isSizeRange = createTypeGuard(search_1.SizeRangeSchema);
exports.isYearRange = createTypeGuard(search_1.YearRangeSchema);
// Alert type guards
exports.isAlert = createTypeGuard(alert_1.AlertSchema);
exports.isCreateAlertInput = createTypeGuard(alert_1.CreateAlertInputSchema);
exports.isAlertFilters = createTypeGuard(alert_1.AlertFiltersSchema);
exports.isAlertType = createTypeGuard(alert_1.AlertTypeSchema);
exports.isAlertPriority = createTypeGuard(alert_1.AlertPrioritySchema);
exports.isNotificationPreferences = createTypeGuard(alert_1.NotificationPreferencesSchema);
// Contact type guards
exports.isContactForm = createTypeGuard(contact_1.ContactFormSchema);
exports.isExtendedContactForm = createTypeGuard(contact_1.ExtendedContactFormSchema);
exports.isNewsletterSubscription = createTypeGuard(contact_1.NewsletterSubscriptionSchema);
exports.isContactFormFilters = createTypeGuard(contact_1.ContactFormFiltersSchema);
exports.isSubscriptionFilters = createTypeGuard(contact_1.SubscriptionFiltersSchema);
exports.isContactLanguage = createTypeGuard(contact_1.ContactLanguageSchema);
exports.isContactCategory = createTypeGuard(contact_1.ContactCategorySchema);
exports.isContactUrgency = createTypeGuard(contact_1.ContactUrgencySchema);
exports.isContactMethod = createTypeGuard(contact_1.ContactMethodSchema);
exports.isBestTime = createTypeGuard(contact_1.BestTimeSchema);
exports.isTimeline = createTypeGuard(contact_1.TimelineSchema);
exports.isBudget = createTypeGuard(contact_1.BudgetSchema);
// Validation functions
exports.validateMultilingualText = createValidator(common_1.MultilingualTextSchema);
exports.validateCurrency = createValidator(common_1.CurrencySchema);
exports.validateLanguage = createValidator(common_1.LanguageSchema);
exports.validateListing = createValidator(listing_2.ListingSchema);
exports.validateAgent = createValidator(agent_1.AgentSchema);
exports.validateUser = createValidator(user_1.UserSchema);
exports.validateBooking = createValidator(booking_1.BookingSchema);
exports.validateAlert = createValidator(alert_1.AlertSchema);
exports.validateContactForm = createValidator(contact_1.ContactFormSchema);
exports.validateNewsletterSubscription = createValidator(contact_1.NewsletterSubscriptionSchema);
// Safe validation functions
exports.safeValidateMultilingualText = createSafeValidator(common_1.MultilingualTextSchema);
exports.safeValidateCurrency = createSafeValidator(common_1.CurrencySchema);
exports.safeValidateLanguage = createSafeValidator(common_1.LanguageSchema);
exports.safeValidateListing = createSafeValidator(listing_2.ListingSchema);
exports.safeValidateAgent = createSafeValidator(agent_1.AgentSchema);
exports.safeValidateUser = createSafeValidator(user_1.UserSchema);
exports.safeValidateBooking = createSafeValidator(booking_1.BookingSchema);
exports.safeValidateAlert = createSafeValidator(alert_1.AlertSchema);
exports.safeValidateContactForm = createSafeValidator(contact_1.ContactFormSchema);
exports.safeValidateNewsletterSubscription = createSafeValidator(contact_1.NewsletterSubscriptionSchema);
/**
 * Utility function to validate array of objects
 * @param items - Array of items to validate
 * @param typeGuard - Type guard function to use for validation
 * @returns Array of validation results
 */
const validateArray = (items, typeGuard) => {
    const valid = [];
    const invalid = [];
    for (const item of items) {
        if (typeGuard(item)) {
            valid.push(item);
        }
        else {
            invalid.push(item);
        }
    }
    return { valid, invalid };
};
exports.validateArray = validateArray;
/**
 * Utility function to validate object with specific properties
 * @param obj - Object to validate
 * @param requiredProps - Array of required property names
 * @returns true if object has all required properties
 */
const hasRequiredProperties = (obj, requiredProps) => {
    if (!obj || typeof obj !== 'object')
        return false;
    const object = obj;
    return requiredProps.every(prop => prop in object && object[prop] !== undefined);
};
exports.hasRequiredProperties = hasRequiredProperties;
/**
 * Type guard for partial object validation
 * Validates that an object contains at least the specified properties
 * @param obj - Object to validate
 * @param partialSchema - Zod schema for partial validation
 * @returns true if object matches partial schema
 */
const isPartial = (obj, partialSchema) => {
    try {
        partialSchema.parse(obj);
        return true;
    }
    catch {
        return false;
    }
};
exports.isPartial = isPartial;
//# sourceMappingURL=typeGuards.js.map