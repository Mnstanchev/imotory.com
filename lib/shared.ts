// Shared types and utilities

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL'
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  USER = 'USER'
}

export interface Listing {
  id: string;
  slug: string;
  title: { en: string; bg: string };
  description: { en: string; bg: string };
  shortDescription: { en: string; bg: string };
  price: number;
  currency: string;
  type: PropertyType;
  status: ListingStatus;
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: number;
    hasGarage: boolean;
  };
  features: string[];
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
    localizedNames: { en: string; bg: string };
  };
  images: string[];
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  preferences: {
    language: string;
    currency: string;
    notifications: { email: boolean; sms: boolean; push: boolean };
    savedSearches: boolean;
    newsletter: boolean;
    marketingEmails: boolean;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

export class PriceConverter {
  static format(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
