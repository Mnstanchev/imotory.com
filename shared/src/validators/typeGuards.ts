/**
 * Type guard functions for runtime type validation using Zod schemas
 * Provides runtime type checking for all domain objects
 */

import { z } from 'zod';

// Import all schemas for validation
import {
  MultilingualTextSchema,
  CurrencySchema,
  LanguageSchema
} from '../schemas/common';

import {
  PropertyTypeSchema,
  ListingStatusSchema,
  PropertyFeatureSchema
} from '../schemas/listing';

import {
  ListingSchema,
  ListingFiltersSchema,
  ListingSortOptionSchema,
  CreateListingInputSchema,
  UpdateListingInputSchema
} from '../schemas/listing';

import {
  AgentSchema,
  CreateAgentInputSchema,
  UpdateAgentInputSchema,
  AgentFiltersSchema
} from '../schemas/agent';

import {
  UserSchema,
  UpdateUserProfileInputSchema,
  UserFiltersSchema,
  LoginCredentialsSchema,
  RegisterUserInputSchema
} from '../schemas/user';

import {
  BookingSchema,
  CreateBookingInputSchema,
  UpdateBookingInputSchema,
  BookingFiltersSchema,
  VisitTypeSchema,
  BookingStatusSchema,
  ContactInfoSchema
} from '../schemas/booking';

import {
  SearchFiltersSchema,
  SearchResultSchema,
  SearchSortOptionSchema,
  SearchPriceRangeSchema,
  SizeRangeSchema,
  YearRangeSchema
} from '../schemas/search';

import {
  AlertSchema,
  CreateAlertInputSchema,
  AlertFiltersSchema,
  AlertTypeSchema,
  AlertPrioritySchema,
  NotificationPreferencesSchema
} from '../schemas/alert';

import {
  ContactFormSchema,
  ExtendedContactFormSchema,
  NewsletterSubscriptionSchema,
  ContactFormFiltersSchema,
  SubscriptionFiltersSchema,
  ContactLanguageSchema,
  ContactCategorySchema,
  ContactUrgencySchema,
  ContactMethodSchema,
  BestTimeSchema,
  TimelineSchema,
  BudgetSchema
} from '../schemas/contact';

/**
 * Generic type guard function creator
 * @param schema - Zod schema to validate against
 * @returns Type guard function for the given schema
 */
function createTypeGuard<T>(schema: z.ZodSchema<T>) {
  return (value: unknown): value is T => {
    try {
      schema.parse(value);
      return true;
    } catch {
      return false;
    }
  };
}

/**
 * Generic validation function creator
 * @param schema - Zod schema to validate against
 * @returns Validation function that returns parsed object or throws error
 */
function createValidator<T>(schema: z.ZodSchema<T>) {
  return (value: unknown): T => {
    return schema.parse(value);
  };
}

/**
 * Generic safe validation function creator
 * @param schema - Zod schema to validate against
 * @returns Safe validation function that returns result object
 */
function createSafeValidator<T>(schema: z.ZodSchema<T>) {
  return (value: unknown) => {
    return schema.safeParse(value);
  };
}

// Common type guards
export const isMultilingualText = createTypeGuard(MultilingualTextSchema);
export const isCurrency = createTypeGuard(CurrencySchema);
export const isLanguage = createTypeGuard(LanguageSchema);
export const isPropertyType = createTypeGuard(PropertyTypeSchema);
export const isListingStatus = createTypeGuard(ListingStatusSchema);
export const isPropertyFeature = createTypeGuard(PropertyFeatureSchema);

// Listing type guards
export const isListing = createTypeGuard(ListingSchema);
export const isListingFilters = createTypeGuard(ListingFiltersSchema);
export const isListingSortOption = createTypeGuard(ListingSortOptionSchema);
export const isCreateListingInput = createTypeGuard(CreateListingInputSchema);
export const isUpdateListingInput = createTypeGuard(UpdateListingInputSchema);

// Agent type guards
export const isAgent = createTypeGuard(AgentSchema);
export const isCreateAgentInput = createTypeGuard(CreateAgentInputSchema);
export const isUpdateAgentInput = createTypeGuard(UpdateAgentInputSchema);
export const isAgentFilters = createTypeGuard(AgentFiltersSchema);

// User type guards
export const isUser = createTypeGuard(UserSchema);
export const isCreateUserInput = createTypeGuard(RegisterUserInputSchema);
export const isUpdateUserInput = createTypeGuard(UpdateUserProfileInputSchema);
export const isUserFilters = createTypeGuard(UserFiltersSchema);
export const isLoginInput = createTypeGuard(LoginCredentialsSchema);
export const isRegisterInput = createTypeGuard(RegisterUserInputSchema);

// Booking type guards
export const isBooking = createTypeGuard(BookingSchema);
export const isCreateBookingInput = createTypeGuard(CreateBookingInputSchema);
export const isUpdateBookingInput = createTypeGuard(UpdateBookingInputSchema);
export const isBookingFilters = createTypeGuard(BookingFiltersSchema);
export const isVisitType = createTypeGuard(VisitTypeSchema);
export const isBookingStatus = createTypeGuard(BookingStatusSchema);
export const isContactInfo = createTypeGuard(ContactInfoSchema);

// Search type guards
export const isSearchFilters = createTypeGuard(SearchFiltersSchema);
export const isSearchResult = createTypeGuard(SearchResultSchema);
export const isSearchSortOption = createTypeGuard(SearchSortOptionSchema);
export const isPriceRange = createTypeGuard(SearchPriceRangeSchema);
export const isSizeRange = createTypeGuard(SizeRangeSchema);
export const isYearRange = createTypeGuard(YearRangeSchema);

// Alert type guards
export const isAlert = createTypeGuard(AlertSchema);
export const isCreateAlertInput = createTypeGuard(CreateAlertInputSchema);
export const isAlertFilters = createTypeGuard(AlertFiltersSchema);
export const isAlertType = createTypeGuard(AlertTypeSchema);
export const isAlertPriority = createTypeGuard(AlertPrioritySchema);
export const isNotificationPreferences = createTypeGuard(NotificationPreferencesSchema);

// Contact type guards
export const isContactForm = createTypeGuard(ContactFormSchema);
export const isExtendedContactForm = createTypeGuard(ExtendedContactFormSchema);
export const isNewsletterSubscription = createTypeGuard(NewsletterSubscriptionSchema);
export const isContactFormFilters = createTypeGuard(ContactFormFiltersSchema);
export const isSubscriptionFilters = createTypeGuard(SubscriptionFiltersSchema);
export const isContactLanguage = createTypeGuard(ContactLanguageSchema);
export const isContactCategory = createTypeGuard(ContactCategorySchema);
export const isContactUrgency = createTypeGuard(ContactUrgencySchema);
export const isContactMethod = createTypeGuard(ContactMethodSchema);
export const isBestTime = createTypeGuard(BestTimeSchema);
export const isTimeline = createTypeGuard(TimelineSchema);
export const isBudget = createTypeGuard(BudgetSchema);

// Validation functions
export const validateMultilingualText = createValidator(MultilingualTextSchema);
export const validateCurrency = createValidator(CurrencySchema);
export const validateLanguage = createValidator(LanguageSchema);
export const validateListing = createValidator(ListingSchema);
export const validateAgent = createValidator(AgentSchema);
export const validateUser = createValidator(UserSchema);
export const validateBooking = createValidator(BookingSchema);
export const validateAlert = createValidator(AlertSchema);
export const validateContactForm = createValidator(ContactFormSchema);
export const validateNewsletterSubscription = createValidator(NewsletterSubscriptionSchema);

// Safe validation functions
export const safeValidateMultilingualText = createSafeValidator(MultilingualTextSchema);
export const safeValidateCurrency = createSafeValidator(CurrencySchema);
export const safeValidateLanguage = createSafeValidator(LanguageSchema);
export const safeValidateListing = createSafeValidator(ListingSchema);
export const safeValidateAgent = createSafeValidator(AgentSchema);
export const safeValidateUser = createSafeValidator(UserSchema);
export const safeValidateBooking = createSafeValidator(BookingSchema);
export const safeValidateAlert = createSafeValidator(AlertSchema);
export const safeValidateContactForm = createSafeValidator(ContactFormSchema);
export const safeValidateNewsletterSubscription = createSafeValidator(NewsletterSubscriptionSchema);

/**
 * Utility function to validate array of objects
 * @param items - Array of items to validate
 * @param typeGuard - Type guard function to use for validation
 * @returns Array of validation results
 */
export const validateArray = <T>(
  items: unknown[],
  typeGuard: (item: unknown) => item is T
): { valid: T[]; invalid: unknown[] } => {
  const valid: T[] = [];
  const invalid: unknown[] = [];

  for (const item of items) {
    if (typeGuard(item)) {
      valid.push(item);
    } else {
      invalid.push(item);
    }
  }

  return { valid, invalid };
};

/**
 * Utility function to validate object with specific properties
 * @param obj - Object to validate
 * @param requiredProps - Array of required property names
 * @returns true if object has all required properties
 */
export const hasRequiredProperties = (
  obj: unknown,
  requiredProps: string[]
): obj is Record<string, unknown> => {
  if (!obj || typeof obj !== 'object') return false;
  
  const object = obj as Record<string, unknown>;
  return requiredProps.every(prop => prop in object && object[prop] !== undefined);
};

/**
 * Type guard for partial object validation
 * Validates that an object contains at least the specified properties
 * @param obj - Object to validate
 * @param partialSchema - Zod schema for partial validation
 * @returns true if object matches partial schema
 */
export const isPartial = <T>(
  obj: unknown,
  partialSchema: z.ZodSchema<Partial<T>>
): obj is Partial<T> => {
  try {
    partialSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
};