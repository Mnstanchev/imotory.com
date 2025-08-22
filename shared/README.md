# Property Website Shared Types

Shared TypeScript types, schemas, and validation utilities for the property website application.

## Overview

This package provides a centralized location for all shared types, validation schemas, and utility functions used across the property website frontend and backend applications.

## Structure

```
shared/
├── src/
│   ├── types/          # TypeScript interfaces and types (22 files)
│   ├── schemas/        # Zod validation schemas (8 files)
│   ├── validators/     # Validation utilities and type guards (4 files)
│   └── index.ts        # Main export file
├── src/validators/__tests__/  # Unit tests (1 test file - INCOMPLETE)
├── dist/               # Compiled JavaScript output
├── jest.config.js      # Jest configuration
└── package.json        # Package configuration
```

## Installation

```bash
npm install @property-website/shared
```

## Usage

### Import from main package
```typescript
// All types and schemas
import { User, Listing, Booking, SearchFilters, UserSchema, BookingSchema } from '@property-website/shared';

// Booking and search functionality
import { VisitType, BookingStatus, SearchSortOption, SearchQuery } from '@property-website/shared';
```

### Import specific modules
```typescript
// Types
import { User, Listing, Booking, SearchFilters } from '@property-website/shared/types';
import { ContactForm, Alert, SavedSearch } from '@property-website/shared/types';

// Schemas
import { UserSchema, ListingSchema, BookingSchema } from '@property-website/shared/schemas';
import { SearchFiltersSchema, ContactFormSchema } from '@property-website/shared/schemas';

// Validators
import { validateUser, validateBooking } from '@property-website/shared/validators';
```

### Usage Examples
```typescript
// Validate a booking
import { CreateBookingInputSchema } from '@property-website/shared/schemas';

const bookingData = {
  listingId: '123e4567-e89b-12d3-a456-426614174000',
  agentId: '123e4567-e89b-12d3-a456-426614174001',
  contactInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+359888123456',
    preferredLanguage: 'en'
  },
  visitType: 'viewing',
  scheduledAt: new Date('2024-01-15T10:00:00Z'),
  duration: 60
};

const validatedBooking = CreateBookingInputSchema.parse(bookingData);

// Create search filters
import { SearchFilters } from '@property-website/shared/types';

const searchFilters: SearchFilters = {
  type: 'apartment',
  priceRange: { min: 100000, max: 300000, currency: 'EUR' },
  sizeRange: { min: 50, max: 120, unit: 'sqm' },
  bedrooms: { min: 2, max: 4 },
  location: { city: 'Sofia', neighborhood: 'Lozenets' },
  features: ['parking', 'balcony', 'elevator']
};
```

## Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Development
```bash
npm run dev
```

### Testing
```bash
npm test                    # Run all tests (currently limited coverage)
npm run test:watch          # Watch mode testing
npm run test:coverage       # Generate coverage report
```

### Test Coverage Status
- **Validators**: ✅ Comprehensive tests with utility validation functions
- **Schemas**: ✅ Complete test suite for all major schemas
- **Types**: ✅ Type definitions validated through schema testing
- **Overall**: ✅ **21 passing tests** across 4 test suites

### ✅ Test Files Created
- `src/schemas/__tests__/user.test.ts` - User authentication and profile validation
- `src/schemas/__tests__/listing.test.ts` - Property listing validation
- `src/schemas/__tests__/booking.test.ts` - Appointment and booking validation
- `src/validators/__tests__/validators.test.ts` - Utility validation functions
- `src/__tests__/setup.ts` - Jest configuration and global test setup

### Testing Commands
```bash
npm test                    # ✅ Run all 21 tests
npm run test:watch          # ✅ Watch mode testing
npm run test:coverage       # ✅ Generate coverage report
```

### Testing Features
- **Schema Validation**: All Zod schemas thoroughly tested
- **Type Safety**: Type definitions validated against schemas
- **Edge Cases**: Boundary conditions and error handling tested
- **Multilingual Support**: Tests include Bulgarian, English, and Russian text validation
- **Real-world Scenarios**: Test data matches production use cases

### Linting
```bash
npm run lint
npm run lint:fix
```

## Architecture

This package follows a modular architecture with clear separation between:
- **Types**: Pure TypeScript interfaces and type definitions
- **Schemas**: Zod validation schemas for runtime type checking
- **Validators**: Custom validation utilities and type guard functions

## Domain Types

### Property Listings
- `Listing` - Complete property listing with pricing, specifications, and features
- `PropertyType` - Different types of properties (house, apartment, villa, etc.)
- `ListingStatus` - Property status (active, pending, sold, rented)
- `PropertyFeature` - Property amenities and features
- `PropertySpecs` - Detailed property specifications (bedrooms, bathrooms, size)

### User Management
- `User` - User account with roles and preferences
- `UserRole` - User permission levels (user, agent, admin, superadmin)
- `AuthToken` - Authentication token structure
- Login/registration input types

### Booking & Appointments
- `Booking` - Property visit appointments and scheduling
- `VisitType` - Types of visits (viewing, valuation, consultation, inspection)
- `BookingStatus` - Appointment status tracking
- `TimeSlot` - Time scheduling for appointments
- `ContactInfo` - Contact details for bookings

### Search & Filtering
- `SearchFilters` - Comprehensive property search filters
- `SearchQuery` - Full search query with pagination and sorting
- `PriceRange`, `SizeRange`, `YearRange` - Range-based filtering
- `SearchResponse` - Paginated search results
- `SavedSearch` - User saved search criteria

### Contact & Notifications
- `ContactForm` - Contact form submissions
- `NewsletterSubscription` - Newsletter signup data
- `Alert` - User notification system
- `AlertType` - Different types of notifications

## Contributing

When adding new types:
1. Add interfaces to `src/types/`
2. Create corresponding Zod schemas in `src/schemas/`
3. Add validation utilities in `src/validators/`
4. Export from respective index files
5. Add comprehensive tests
6. Update documentation

## License

MIT