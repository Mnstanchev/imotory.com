// Example of using shared utilities in frontend
import React from 'react';
import { Property, User, formatPrice, formatDate } from '@shared';
import { API_ENDPOINTS, PROPERTY_STATUS } from '@shared/constants';
import { validateEmail } from '@shared/utils';

// Example component using shared types and utilities
export default function ExampleUsage() {
  // Using shared types
  const sampleProperty: Property = {
    id: '1',
    title: 'Beautiful Family Home',
    description: 'A wonderful place to call home',
    price: 450000,
    location: {
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    images: [],
    features: ['garage', 'garden'],
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: 'house',
    status: 'available',
    agentId: 'agent1',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const sampleUser: User = {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <div className="p-6">
      <h1>Frontend Example - Using Shared Code</h1>
      
      <div className="mt-4">
        <h2>Property Information:</h2>
        <p>Title: {sampleProperty.title}</p>
        <p>Price: {formatPrice(sampleProperty.price)}</p>
        <p>Created: {formatDate(sampleProperty.createdAt)}</p>
        <p>Status: {sampleProperty.status === PROPERTY_STATUS.AVAILABLE ? 'Available' : 'Not Available'}</p>
      </div>

      <div className="mt-4">
        <h2>User Information:</h2>
        <p>Name: {sampleUser.name}</p>
        <p>Email: {sampleUser.email}</p>
        <p>Valid Email: {validateEmail(sampleUser.email) ? 'Yes' : 'No'}</p>
      </div>

      <div className="mt-4">
        <h2>API Endpoints:</h2>
        <ul>
          <li>Properties: {API_ENDPOINTS.PROPERTIES}</li>
          <li>Users: {API_ENDPOINTS.USERS}</li>
          <li>Auth: {API_ENDPOINTS.AUTH}</li>
        </ul>
      </div>
    </div>
  );
} 