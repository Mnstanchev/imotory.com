// Example API route using shared utilities in backend
import { NextRequest, NextResponse } from 'next/server';
import { Listing, User, ApiResponse, validateEmail, PriceConverter, PropertyType, ListingStatus, UserRole } from '@shared';

// Mock constants for example purposes
const API_ENDPOINTS = { LISTINGS: '/api/listings' };
const PROPERTY_STATUS = { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE' };
const USER_ROLES = { ADMIN: 'ADMIN', USER: 'USER' };

// Example API route using shared types and utilities
export async function GET(request: NextRequest) {
  try {
    // Using shared types
    const sampleProperty: Listing = {
      id: '1',
      slug: 'backend-generated-property',
      title: { en: 'Backend Generated Property', bg: 'Генерирана от сървъра собственост' },
      description: { en: 'This property was created by the backend', bg: 'Тази собственост е създадена от сървъра' },
      shortDescription: { en: 'Backend property', bg: 'Собственост от сървъра' },
      price: 325000,
      currency: 'EUR',
      type: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      specifications: {
        bedrooms: 2,
        bathrooms: 1,
        size: 120,
        hasGarage: false
      },
      features: [],
      location: {
        address: '456 Backend Ave',
        city: 'Sofia',
        country: 'Bulgaria',
        coordinates: { latitude: 42.6977, longitude: 23.3219 },
        localizedNames: { en: 'Sofia Center', bg: 'Център на София' }
      },
      images: [],
      agentId: 'backend-agent',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      isFeatured: false,
      isActive: true
    };

    const sampleUser: User = {
      id: '2',
      email: 'backend@example.com',
      firstName: 'Backend',
      lastName: 'User',
      role: UserRole.ADMIN,
      preferences: {
        language: 'en',
        currency: 'EUR',
        notifications: { email: true, sms: false, push: true },
        savedSearches: true,
        newsletter: false,
        marketingEmails: false
      },
      isEmailVerified: true,
      isPhoneVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Using shared utilities
    const formattedPrice = PriceConverter.format(sampleProperty.price, sampleProperty.currency);
    const isEmailValid = validateEmail(sampleUser.email);

    // Using shared response type
    const response: ApiResponse<{
      property: Listing;
      user: User;
      metadata: {
        formattedPrice: string;
        isEmailValid: boolean;
        availableEndpoints: typeof API_ENDPOINTS;
        userRoles: typeof USER_ROLES;
      };
    }> = {
      success: true,
      data: {
        property: sampleProperty,
        user: sampleUser,
        metadata: {
          formattedPrice,
          isEmailValid,
          availableEndpoints: API_ENDPOINTS,
          userRoles: USER_ROLES,
        }
      },
      message: 'Successfully retrieved example data using shared utilities'
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      data: null,
      success: false,
      message: 'An error occurred while processing the example request',
      errors: [{
        code: 'INTERNAL_ERROR',
        message: 'Failed to process request'
      }]
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Example of validating email using shared utility
    if (body.email && !validateEmail(body.email)) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        message: 'Please provide a valid email address',
        errors: [{
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          field: 'email'
        }]
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<null> = {
      data: null,
      success: true,
      message: 'POST request processed successfully using shared validation'
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      data: null,
      success: false,
      message: 'An error occurred while processing the POST request',
      errors: [{
        code: 'INTERNAL_ERROR',
        message: 'Failed to process POST request'
      }]
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 