import { z } from 'zod';
import { PropertyType, ListingType, HeatingType, OwnershipType, BuildingType, ListingStatus } from '@prisma/client';

const multilingualString = z.object({
  bg: z.string().min(1, 'Bulgarian translation is required'),
  en: z.string().optional(),
  ru: z.string().optional(),
});

const multilingualStringArray = z.object({
  bg: z.array(z.string()).default([]),
  en: z.array(z.string()).optional().default([]),
  ru: z.array(z.string()).optional().default([]),
});

export const createListingSchema = z.object({
  title: multilingualString,
  description: multilingualString,
  price: z.number().positive('Price must be positive'),
  pricePerSqM: z.number().positive('Price per sqm must be positive').optional(),
  currency: z.string().default('EUR'),
  
  propertyType: z.nativeEnum(PropertyType),
  listingType: z.nativeEnum(ListingType),
  
  locationId: z.string().min(1, 'Location is required'),
  categoryId: z.string().min(1, 'Category is required'),
  agentId: z.string().min(1, 'Agent is required'),
  
  // Address and coordinates
  address: multilingualString.optional(),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  // Room details
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  livingRooms: z.number().int().min(0).optional(),
  kitchens: z.number().int().min(0).optional(),
  parkingSpots: z.number().int().min(0).optional(),
  
  // Amenities (boolean)
  garage: z.boolean().optional(),
  balcony: z.boolean().optional(),
  pool: z.boolean().optional(),
  elevator: z.boolean().optional(),
  furnished: z.boolean().optional(),
  
  // Outdoor spaces
  gardenSize: z.number().int().min(0).optional(),
  terraceSize: z.number().int().min(0).optional(),
  
  // Property details
  size: z.number().int().min(0).optional(),
  floor: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(0).optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  
  // Building information
  buildingType: z.nativeEnum(BuildingType).optional(),
  buildingCondition: multilingualString.optional(),
  maintenanceFee: z.number().min(0).optional(),
  
  // Climate control
  heatingType: z.nativeEnum(HeatingType).optional(),
  airConditioning: z.boolean().optional(),
  
  // Ownership
  ownershipType: z.nativeEnum(OwnershipType).optional(),
  mortgagePossible: z.boolean().optional(),
  
  // Status and availability
  status: z.nativeEnum(ListingStatus).default('ACTIVE'),
  availableFrom: z.string().datetime().optional(),
  
  // Media and features
  features: multilingualStringArray.default({ bg: [], en: [], ru: [] }),
  tags: multilingualStringArray.default({ bg: [], en: [], ru: [] }),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().url().optional(),
  virtualTourUrl: z.string().url().optional(),
  
  // Visibility settings
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateListingSchema = createListingSchema.partial().extend({
  id: z.string().min(1, 'Listing ID is required'),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;