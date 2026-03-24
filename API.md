# Backend API Documentation

## Listings API

### **Base URL**: `http://localhost:3001/api`

### **GET /api/listings**
Get all listings with filtering, sorting, and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (`createdAt`, `price`, `viewCount`, `title`)
- `sortOrder` (string): Sort direction (`asc`, `desc`)
- `propertyType` (string): Property type filter
- `listingType` (string): Listing type filter (`SALE`, `RENT`)
- `categoryId` (uuid): Category ID filter
- `agentId` (uuid): Agent ID filter
- `locationId` (uuid): Location ID filter
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `minBedrooms` (number): Minimum bedrooms filter
- `maxBedrooms` (number): Maximum bedrooms filter
- `isActive` (boolean): Active status filter
- `isFeatured` (boolean): Featured status filter

**Example Response:**
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": "cm123...",
        "title": { "en": "Modern Apartment", "bg": "Модерен апартамент" },
        "description": { "en": "Beautiful modern apartment...", "bg": "Красив модерен апартамент..." },
        "price": 150000,
        "currency": "EUR",
        "propertyType": "APARTMENT",
        "listingType": "SALE",
        "bedrooms": 2,
        "bathrooms": 1,
        "size": 85,
        "features": ["parking", "balcony", "elevator"],
        "images": ["https://cloudinary.com/image1.jpg"],
        "slug": "modern-apartment-sofia",
        "viewCount": 125,
        "isActive": true,
        "isFeatured": false,
        "category": { "id": "cat123...", "name": { "en": "Apartments" }, "slug": "apartments" },
        "agent": { "id": "agent123...", "name": { "en": "John Doe" }, "email": "john@example.com" },
        "location": { "id": "loc123...", "name": { "en": "Sofia" }, "slug": "sofia" },
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### **POST /api/listings**
Create a new listing (admin only).

**Authentication Required**: Bearer token with ADMIN or SUPERADMIN role

**Request Body:**
```json
{
  "title": {
    "en": "Modern Apartment",
    "bg": "Модерен апартамент",
    "ru": "Современная квартира"
  },
  "description": {
    "en": "Beautiful modern apartment in the city center",
    "bg": "Красив модерен апартамент в центъра на града",
    "ru": "Красивая современная квартира в центре города"
  },
  "price": 150000,
  "currency": "EUR",
  "propertyType": "APARTMENT",
  "listingType": "SALE",
  "categoryId": "cat123...",
  "agentId": "agent123...",
  "locationId": "loc123...",
  "bedrooms": 2,
  "bathrooms": 1,
  "size": 85,
  "floor": 5,
  "totalFloors": 8,
  "yearBuilt": 2020,
  "features": ["parking", "balcony", "elevator"],
  "images": ["https://cloudinary.com/image1.jpg"]
}
```

### **GET /api/listings/[id]**
Get a single listing by ID.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cm123...",
    "title": { "en": "Modern Apartment", "bg": "Модерен апартамент" },
    "description": { "en": "Beautiful modern apartment...", "bg": "Красив модерен апартамент..." },
    "price": 150000,
    "currency": "EUR",
    "propertyType": "APARTMENT",
    "listingType": "SALE",
    "bedrooms": 2,
    "bathrooms": 1,
    "size": 85,
    "floor": 5,
    "totalFloors": 8,
    "yearBuilt": 2020,
    "features": ["parking", "balcony", "elevator"],
    "images": ["https://cloudinary.com/image1.jpg"],
    "slug": "modern-apartment-sofia",
    "viewCount": 125,
    "isActive": true,
    "isFeatured": false,
    "category": { "id": "cat123...", "name": { "en": "Apartments" }, "slug": "apartments" },
    "agent": { "id": "agent123...", "name": { "en": "John Doe" }, "email": "john@example.com" },
    "location": { "id": "loc123...", "name": { "en": "Sofia" }, "slug": "sofia", "parent": null },
    "_count": {
      "favorites": 12,
      "bookings": 3
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### **PUT /api/listings/[id]**
Update a listing (admin only).

**Authentication Required**: Bearer token with ADMIN or SUPERADMIN role

**Request Body:** Same as POST but all fields optional

### **DELETE /api/listings/[id]**
Delete a listing (admin only).

**Authentication Required**: Bearer token with ADMIN or SUPERADMIN role

**Example Response:**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

### **GET /api/listings/agent/[agentId]**
Get all listings by a specific agent.

**Query Parameters:** Same as GET /api/listings

**Example Response:**
```json
{
  "success": true,
  "data": {
    "listings": [...],
    "agent": {
      "id": "agent123...",
      "name": { "en": "John Doe" },
      "email": "john@example.com",
      "phone": "+359888123456",
      "avatar": "https://cloudinary.com/avatar.jpg",
      "isActive": true
    },
    "pagination": { /* same as above */ }
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Authentication

Use NextAuth.js with Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

Required roles:
- **ADMIN** or **SUPERADMIN** for POST, PUT, DELETE operations
- **USER** or higher for GET operations

## Multilingual Support

All text fields support Bulgarian (bg), English (en), and Russian (ru):
```json
{
  "title": {
    "en": "Modern Apartment",
    "bg": "Модерен апартамент",
    "ru": "Современная квартира"
  }
}
```