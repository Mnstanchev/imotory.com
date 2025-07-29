# Shared Utilities and Types

This folder contains shared code that can be used by both the frontend and backend Next.js applications.

## Structure

```
shared/
├── types/          # TypeScript interfaces and types
├── utils/          # Utility functions
├── constants/      # Shared constants
├── components/     # Shared React components (future)
├── hooks/          # Shared React hooks (future)
└── index.ts        # Main export file
```

## Usage

### Import Methods

You can import from shared in multiple ways:

```typescript
// Method 1: Import everything from main index
import { Property, User, formatPrice, API_ENDPOINTS } from '@shared';

// Method 2: Import from specific modules
import { Property, User } from '@shared/types';
import { formatPrice, validateEmail } from '@shared/utils';
import { API_ENDPOINTS, PROPERTY_STATUS } from '@shared/constants';

// Method 3: Import specific items from main index
import { formatPrice } from '@shared';
```

### Frontend Usage Example

```typescript
// In a React component
import React from 'react';
import { Property, formatPrice, PROPERTY_STATUS } from '@shared';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div>
      <h3>{property.title}</h3>
      <p>Price: {formatPrice(property.price)}</p>
      <p>Status: {property.status === PROPERTY_STATUS.AVAILABLE ? 'Available' : 'Not Available'}</p>
    </div>
  );
}
```

### Backend Usage Example

```typescript
// In an API route
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, validateEmail } from '@shared';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  if (!validateEmail(email)) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid email format'
    };
    return NextResponse.json(response, { status: 400 });
  }
  
  // Process valid email...
}
```

## Available Exports

### Types
- `User` - User interface
- `Property` - Property interface  
- `ApiResponse<T>` - Generic API response interface

### Utilities
- `formatPrice(price: number)` - Format price as currency
- `formatDate(date: Date | string)` - Format date for display
- `generateSlug(title: string)` - Generate URL-friendly slug
- `validateEmail(email: string)` - Validate email format
- `truncateText(text: string, maxLength: number)` - Truncate text with ellipsis

### Constants
- `API_ENDPOINTS` - API endpoint paths
- `PROPERTY_TYPES` - Property type constants
- `PROPERTY_STATUS` - Property status constants
- `USER_ROLES` - User role constants
- `VALIDATION_RULES` - Validation constraints
- `PAGINATION` - Pagination defaults

## Development

When adding new shared code:

1. Add your types to `types/index.ts`
2. Add your utilities to `utils/index.ts`  
3. Add your constants to `constants/index.ts`
4. Export from the main `index.ts` file
5. Update this README with new exports

## Path Mapping

Both frontend and backend are configured with TypeScript path mapping:

- `@shared` - Maps to the shared folder root
- `@shared/*` - Maps to specific shared subfolders

This is configured in each app's `tsconfig.json` and `next.config.ts` files. 