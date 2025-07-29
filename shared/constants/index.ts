// Shared constants
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  PROPERTIES: '/api/properties',
  SEARCH: '/api/search',
  UPLOAD: '/api/upload',
} as const;

export const PROPERTY_TYPES = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
} as const;

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  SOLD: 'sold',
  DRAFT: 'draft',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user',
} as const;

export const VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  PROPERTY_TITLE_MAX_LENGTH: 200,
  PROPERTY_DESCRIPTION_MAX_LENGTH: 2000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const; 