# Validation Utilities Documentation

This directory contains comprehensive validation utilities for the property website shared package, including type guards, validators, and utility functions for runtime type checking and data sanitization.

## Overview

The validation utilities are organized into:

- **Core utilities** (`index.ts`): Basic validation functions and utilities
- **Type guards** (`typeGuards.ts`): Runtime type checking using Zod schemas
- **Documentation** (`README.md`): This file

## Core Utilities (index.ts)

### Phone Validation

```typescript
import { validateBulgarianPhone, BULGARIAN_PHONE_REGEX } from '@property-website/shared/validators';

// Validate Bulgarian phone numbers
validateBulgarianPhone('+359888123456'); // true
validateBulgarianPhone('0888123456'); // true
validateBulgarianPhone('invalid'); // false
```

### Multilingual Content Validation

```typescript
import { validateMultilingualContent, getLocalizedText } from '@property-website/shared/validators';

const content = {
  en: 'Beautiful apartment',
  bg: 'Хубав апартамент'
};

// Validate multilingual content
validateMultilingualContent(content, ['en', 'bg']); // true
validateMultilingualContent(content, ['en', 'bg', 'ru']); // false (missing Russian)

// Get localized text with fallback
getLocalizedText(content, 'bg', 'en'); // 'Хубав апартамент'
getLocalizedText(content, 'ru', 'en'); // 'Beautiful apartment' (fallback)
```

### Currency and Price Utilities

```typescript
import { PriceConverter } from '@property-website/shared/validators';

// Convert prices between currencies
const priceInEUR = PriceConverter.toEur(1000, 'BGN'); // Convert BGN to EUR
const convertedPrice = PriceConverter.convert(1000, 'BGN', 'USD'); // Convert BGN to USD

// Format price for display
PriceConverter.format(150000, 'EUR', 'en-US'); // "€150,000.00"
PriceConverter.format(150000, 'EUR', 'bg-BG'); // "150 000,00 €"
```

### URL Slug Generation

```typescript
import { createSlug } from '@property-website/shared/validators';

createSlug('Luxury Apartment in Sofia Center'); // "luxury-apartment-in-sofia-center"
createSlug('Апартамент в центъра на София'); // "апартамент-в-центъра-на-софия"
```

### Input Sanitization

```typescript
import { sanitizeInput, validateEmail, validateUUID } from '@property-website/shared/validators';

// Sanitize user input
sanitizeInput('<script>alert("XSS")</script>Hello'); // "&lt;script&gt;alert("XSS")&lt;/script&gt;Hello"

// Validate email and UUID
validateEmail('user@example.com'); // true
validateUUID('123e4567-e89b-12d3-a456-426614174000'); // true
```

### Date Utilities

```typescript
import { DateUtils } from '@property-website/shared/validators';

const date = new Date('2024-12-25');

DateUtils.format(date, 'en-US'); // "December 25, 2024"
DateUtils.format(date, 'bg-BG'); // "25 декември 2024 г."

DateUtils.isFuture(date); // Check if date is in future
DateUtils.daysBetween(new Date('2024-01-01'), new Date('2024-12-31')); // 365
```

## Type Guards (typeGuards.ts)

The type guards provide runtime type checking for all domain objects using Zod schemas.

### Basic Usage

```typescript
import { isListing, validateListing, safeValidateListing } from '@property-website/shared/validators';

const data = { /* listing data */ };

// Type guard (returns boolean)
if (isListing(data)) {
  // TypeScript knows data is a Listing here
  console.log(data.title.en); // Safe access
}

// Validator (throws on invalid)
try {
  const listing = validateListing(data);
  // listing is now a validated Listing object
} catch (error) {
  console.error('Invalid listing:', error);
}

// Safe validator (returns result object)
const result = safeValidateListing(data);
if (result.success) {
  const listing = result.data;
  // Safe to use listing
} else {
  console.error('Validation errors:', result.error);
}
```

### Available Type Guards

#### Common Types
- `isMultilingualText`
- `isCurrency`
- `isLanguage`
- `isPropertyType`
- `isPropertyStatus`
- `isListingType`
- `isListingStatus`
- `isPropertyFeature`

#### Domain Objects
- `isListing` / `validateListing` / `safeValidateListing`
- `isAgent` / `validateAgent` / `safeValidateAgent`
- `isUser` / `validateUser` / `safeValidateUser`
- `isBooking` / `validateBooking` / `safeValidateBooking`
- `isAlert` / `validateAlert` / `safeValidateAlert`
- `isContactForm` / `validateContactForm` / `safeValidateContactForm`
- `isNewsletterSubscription` / `validateNewsletterSubscription` / `safeValidateNewsletterSubscription`

#### Input Validation
- `isCreateListingInput`
- `isUpdateListingInput`
- `isCreateAgentInput`
- `isUpdateAgentInput`
- `isCreateUserInput`
- `isUpdateUserInput`
- `isCreateBookingInput`
- `isUpdateBookingInput`
- `isCreateAlertInput`

#### Filter and Sort Options
- `isListingFilters`
- `isAgentFilters`
- `isUserFilters`
- `isBookingFilters`
- `isAlertFilters`
- `isContactFormFilters`
- `isSubscriptionFilters`

### Array Validation

```typescript
import { validateArray, isListing } from '@property-website/shared/validators';

const listings = [/* array of listing data */];
const { valid, invalid } = validateArray(listings, isListing);

console.log(`Valid: ${valid.length}, Invalid: ${invalid.length}`);
```

### Partial Object Validation

```typescript
import { hasRequiredProperties, isPartial } from '@property-website/shared/validators';

// Check if object has required properties
const obj = { title: { en: 'Test' } };
hasRequiredProperties(obj, ['title', 'price']); // false
hasRequiredProperties(obj, ['title']); // true

// Validate partial objects (useful for updates)
const partialListing = { price: 200000 };
const isValidPartial = isPartial(partialListing, ListingSchema.partial());
```

## Usage Examples

### API Request Validation

```typescript
import { validateCreateListingInput } from '@property-website/shared/validators';

app.post('/api/listings', (req, res) => {
  try {
    const listingData = validateCreateListingInput(req.body);
    // Process validated listing data
    res.json({ success: true, listing: listingData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Form Validation

```typescript
import { validateContactForm } from '@property-website/shared/validators';

const handleContactSubmit = (formData) => {
  const result = safeValidateContactForm(formData);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors
    };
  }
  
  return {
    valid: true,
    data: result.data
  };
};
```

### Database Query Results

```typescript
import { validateArray, isListing } from '@property-website/shared/validators';

const queryResults = await db.query('SELECT * FROM listings');
const { valid, invalid } = validateArray(queryResults, isListing);

if (invalid.length > 0) {
  console.warn(`Found ${invalid.length} invalid listings`);
}

return valid; // Validated listings
```

## Best Practices

1. **Always validate external input** - Use type guards for all data coming from external sources
2. **Use safe validators** - Prefer `safeValidateX` over `validateX` to avoid uncaught exceptions
3. **Validate arrays** - Use `validateArray` for bulk validation of collections
4. **Partial updates** - Use partial schemas for PATCH requests and updates
5. **Error handling** - Always handle validation errors appropriately in user interfaces
6. **Logging** - Log validation failures for debugging and monitoring

## Integration Examples

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateListingInputSchema } from '@property-website/shared/schemas';

const ListingForm = () => {
  const form = useForm({
    resolver: zodResolver(CreateListingInputSchema),
  });

  return /* form JSX */;
};
```

### Express.js Middleware

```typescript
import { validateCreateListingInput } from '@property-website/shared/validators';

const validateListingMiddleware = (req, res, next) => {
  try {
    req.validatedData = validateCreateListingInput(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

### Test Utilities

```typescript
import { isListing } from '@property-website/shared/validators';

describe('Listing API', () => {
  it('should create valid listing', () => {
    const listing = createTestListing();
    expect(isListing(listing)).toBe(true);
  });
});
```