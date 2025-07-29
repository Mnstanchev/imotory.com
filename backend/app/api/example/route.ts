// Example API route using shared utilities in backend
import { NextRequest, NextResponse } from 'next/server';
import { Property, User, ApiResponse, formatPrice, validateEmail } from '@shared';
import { API_ENDPOINTS, PROPERTY_STATUS, USER_ROLES } from '@shared/constants';

// Example API route using shared types and utilities
export async function GET(request: NextRequest) {
  try {
    // Using shared types
    const sampleProperty: Property = {
      id: '1',
      title: 'Backend Generated Property',
      description: 'This property was created by the backend',
      price: 325000,
      location: {
        address: '456 Backend Ave',
        city: 'Server City',
        state: 'TX',
        zipCode: '54321',
        coordinates: { lat: 29.7604, lng: -95.3698 }
      },
      images: [],
      features: ['api-generated', 'backend-created'],
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1200,
      type: 'apartment',
      status: 'available',
      agentId: 'backend-agent',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const sampleUser: User = {
      id: '2',
      email: 'backend@example.com',
      name: 'Backend User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Using shared utilities
    const formattedPrice = formatPrice(sampleProperty.price);
    const isEmailValid = validateEmail(sampleUser.email);

    // Using shared response type
    const response: ApiResponse<{
      property: Property;
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
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to process request',
      message: 'An error occurred while processing the example request'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Example of validating email using shared utility
    if (body.email && !validateEmail(body.email)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'POST request processed successfully using shared validation'
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to process POST request',
      message: 'An error occurred while processing the POST request'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 