/**
 * Tests for listing schemas
 */

import { describe, it, expect } from '@jest/globals';
import { ListingSchema } from '../listing';

describe('Listing Schema Tests', () => {
  it('should validate a complete listing', () => {
    const validListing = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      slug: 'luxury-apartment-in-sofia',
      title: { en: 'Luxury apartment in Sofia', bg: 'Луксозен апартамент в София', ru: 'Роскошная квартира в Софии' },
      description: { en: 'Beautiful 3-bedroom apartment', bg: 'Хубав 3-стаен апартамент', ru: 'Красивая 3-комнатная квартира' },
      shortDescription: { en: 'Luxury 2BR apt', bg: 'Луксозен 2-стаен', ru: 'Роскошная 2-комнатная' },
      price: 250000,
      currency: 'EUR',
      type: 'apartment',
      status: 'active',
      specifications: {
        size: 120,
        bedrooms: 3,
        bathrooms: 2,
        hasGarage: false,
        yearBuilt: 2020
      },
      features: ['elevator', 'parking', 'balcony'],
      location: {
        address: '123 Main St',
        city: 'Sofia',
        country: 'Bulgaria',
        coordinates: { latitude: 42.6977, longitude: 23.3219 },
        localizedNames: {
          en: 'Sofia',
          bg: 'София',
          ru: 'София'
        }
      },
      images: [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          url: 'https://example.com/image1.jpg',
          alt: 'Living room',
          width: 1920,
          height: 1080,
          order: 1
        }
      ],
      agentId: '123e4567-e89b-12d3-a456-426614174001',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      viewCount: 150,
      isFeatured: false,
      isActive: true
    };

    const result = ListingSchema.safeParse(validListing);
    expect(result.success).toBe(true);
  });

  it('should reject invalid property type', () => {
    const invalidListing = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: { en: 'Test' },
      description: { en: 'Test' },
      price: 250000,
      currency: 'EUR',
      propertyType: 'invalid',
      listingType: 'sale',
      listingStatus: 'active',
      location: { address: '123 Test', city: 'Sofia', country: 'Bulgaria' },
      specifications: { size: 100, bedrooms: 2, bathrooms: 1, floor: 1, totalFloors: 5, yearBuilt: 2020 },
      images: [],
      agentId: '123'
    };

    const result = ListingSchema.safeParse(invalidListing);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const incompleteListing = {
      title: { en: 'Test' },
      price: 250000
    };

    const result = ListingSchema.safeParse(incompleteListing);
    expect(result.success).toBe(false);
  });
});