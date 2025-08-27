/**
 * Property listing validation schemas
 */
import { z } from 'zod';
/**
 * Schema for property types
 */
export declare const PropertyTypeSchema: z.ZodEnum<{
    house: "house";
    apartment: "apartment";
    villa: "villa";
    office: "office";
    commercial: "commercial";
    land: "land";
}>;
/**
 * Schema for listing status
 */
export declare const ListingStatusSchema: z.ZodEnum<{
    pending: "pending";
    active: "active";
    sold: "sold";
    rented: "rented";
    inactive: "inactive";
}>;
/**
 * Schema for property features
 */
export declare const PropertyFeatureSchema: z.ZodEnum<{
    balcony: "balcony";
    garden: "garden";
    parking: "parking";
    pool: "pool";
    elevator: "elevator";
    air_conditioning: "air_conditioning";
    heating: "heating";
    security_system: "security_system";
    internet: "internet";
    furnished: "furnished";
    pets_allowed: "pets_allowed";
}>;
/**
 * Schema for property specifications
 */
export declare const PropertySpecsSchema: z.ZodObject<{
    bedrooms: z.ZodNumber;
    bathrooms: z.ZodNumber;
    size: z.ZodNumber;
    yearBuilt: z.ZodOptional<z.ZodNumber>;
    floors: z.ZodOptional<z.ZodNumber>;
    floor: z.ZodOptional<z.ZodNumber>;
    hasGarage: z.ZodBoolean;
    parkingSpaces: z.ZodOptional<z.ZodNumber>;
    energyRating: z.ZodOptional<z.ZodString>;
    constructionType: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for listing filters
 */
export declare const ListingFiltersSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        active: "active";
        sold: "sold";
        rented: "rented";
        inactive: "inactive";
    }>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    minSize: z.ZodOptional<z.ZodNumber>;
    maxSize: z.ZodOptional<z.ZodNumber>;
    minBedrooms: z.ZodOptional<z.ZodNumber>;
    maxBedrooms: z.ZodOptional<z.ZodNumber>;
    minBathrooms: z.ZodOptional<z.ZodNumber>;
    features: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        balcony: "balcony";
        garden: "garden";
        parking: "parking";
        pool: "pool";
        elevator: "elevator";
        air_conditioning: "air_conditioning";
        heating: "heating";
        security_system: "security_system";
        internet: "internet";
        furnished: "furnished";
        pets_allowed: "pets_allowed";
    }>>>;
    city: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodOptional<z.ZodString>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    agentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for listing sort options
 */
export declare const ListingSortOptionSchema: z.ZodEnum<{
    price_asc: "price_asc";
    price_desc: "price_desc";
    date_asc: "date_asc";
    date_desc: "date_desc";
    size_asc: "size_asc";
    size_desc: "size_desc";
    views_desc: "views_desc";
    featured_first: "featured_first";
}>;
/**
 * Schema for creating new listings
 */
export declare const CreateListingInputSchema: z.ZodObject<{
    title: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    description: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    shortDescription: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    price: z.ZodNumber;
    currency: z.ZodEnum<{
        BGN: "BGN";
        EUR: "EUR";
        USD: "USD";
    }>;
    type: z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>;
    specifications: z.ZodObject<{
        bedrooms: z.ZodNumber;
        bathrooms: z.ZodNumber;
        size: z.ZodNumber;
        yearBuilt: z.ZodOptional<z.ZodNumber>;
        floors: z.ZodOptional<z.ZodNumber>;
        floor: z.ZodOptional<z.ZodNumber>;
        hasGarage: z.ZodBoolean;
        parkingSpaces: z.ZodOptional<z.ZodNumber>;
        energyRating: z.ZodOptional<z.ZodString>;
        constructionType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    features: z.ZodArray<z.ZodEnum<{
        balcony: "balcony";
        garden: "garden";
        parking: "parking";
        pool: "pool";
        elevator: "elevator";
        air_conditioning: "air_conditioning";
        heating: "heating";
        security_system: "security_system";
        internet: "internet";
        furnished: "furnished";
        pets_allowed: "pets_allowed";
    }>>;
    location: z.ZodObject<{
        address: z.ZodString;
        city: z.ZodString;
        neighborhood: z.ZodOptional<z.ZodString>;
        country: z.ZodString;
        coordinates: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>;
        localizedNames: z.ZodObject<{
            en: z.ZodString;
            bg: z.ZodString;
            ru: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    agentId: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        order: z.ZodNumber;
    }, z.core.$strip>>;
    metaTitle: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    metaDescription: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Schema for updating existing listings
 */
export declare const UpdateListingInputSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    shortDescription: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    price: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<{
        BGN: "BGN";
        EUR: "EUR";
        USD: "USD";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>>;
    specifications: z.ZodOptional<z.ZodObject<{
        bedrooms: z.ZodNumber;
        bathrooms: z.ZodNumber;
        size: z.ZodNumber;
        yearBuilt: z.ZodOptional<z.ZodNumber>;
        floors: z.ZodOptional<z.ZodNumber>;
        floor: z.ZodOptional<z.ZodNumber>;
        hasGarage: z.ZodBoolean;
        parkingSpaces: z.ZodOptional<z.ZodNumber>;
        energyRating: z.ZodOptional<z.ZodString>;
        constructionType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    features: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        balcony: "balcony";
        garden: "garden";
        parking: "parking";
        pool: "pool";
        elevator: "elevator";
        air_conditioning: "air_conditioning";
        heating: "heating";
        security_system: "security_system";
        internet: "internet";
        furnished: "furnished";
        pets_allowed: "pets_allowed";
    }>>>;
    location: z.ZodOptional<z.ZodObject<{
        address: z.ZodString;
        city: z.ZodString;
        neighborhood: z.ZodOptional<z.ZodString>;
        country: z.ZodString;
        coordinates: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>;
        localizedNames: z.ZodObject<{
            en: z.ZodString;
            bg: z.ZodString;
            ru: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    agentId: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        order: z.ZodNumber;
    }, z.core.$strip>>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Schema for complete listing objects
 */
export declare const ListingSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    title: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    description: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    shortDescription: z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>;
    price: z.ZodNumber;
    currency: z.ZodEnum<{
        BGN: "BGN";
        EUR: "EUR";
        USD: "USD";
    }>;
    type: z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>;
    status: z.ZodEnum<{
        pending: "pending";
        active: "active";
        sold: "sold";
        rented: "rented";
        inactive: "inactive";
    }>;
    specifications: z.ZodObject<{
        bedrooms: z.ZodNumber;
        bathrooms: z.ZodNumber;
        size: z.ZodNumber;
        yearBuilt: z.ZodOptional<z.ZodNumber>;
        floors: z.ZodOptional<z.ZodNumber>;
        floor: z.ZodOptional<z.ZodNumber>;
        hasGarage: z.ZodBoolean;
        parkingSpaces: z.ZodOptional<z.ZodNumber>;
        energyRating: z.ZodOptional<z.ZodString>;
        constructionType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    features: z.ZodArray<z.ZodEnum<{
        balcony: "balcony";
        garden: "garden";
        parking: "parking";
        pool: "pool";
        elevator: "elevator";
        air_conditioning: "air_conditioning";
        heating: "heating";
        security_system: "security_system";
        internet: "internet";
        furnished: "furnished";
        pets_allowed: "pets_allowed";
    }>>;
    location: z.ZodObject<{
        address: z.ZodString;
        city: z.ZodString;
        neighborhood: z.ZodOptional<z.ZodString>;
        country: z.ZodString;
        coordinates: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, z.core.$strip>;
        localizedNames: z.ZodObject<{
            en: z.ZodString;
            bg: z.ZodString;
            ru: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodNumber;
        height: z.ZodNumber;
        order: z.ZodNumber;
    }, z.core.$strip>>;
    agentId: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    viewCount: z.ZodNumber;
    isFeatured: z.ZodBoolean;
    isActive: z.ZodBoolean;
    metaTitle: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
    metaDescription: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        bg: z.ZodString;
        ru: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=listing.d.ts.map