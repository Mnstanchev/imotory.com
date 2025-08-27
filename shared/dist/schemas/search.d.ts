/**
 * Zod schemas for search and filtering validation
 */
import { z } from 'zod';
/**
 * Zod schema for price range validation
 */
export declare const SearchPriceRangeSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
}, z.core.$strip>;
/**
 * Zod schema for size range validation
 */
export declare const SizeRangeSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
    unit: z.ZodEnum<{
        sqm: "sqm";
        sqft: "sqft";
        acre: "acre";
    }>;
}, z.core.$strip>;
/**
 * Zod schema for year range validation
 */
export declare const YearRangeSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
}, z.core.$strip>;
/**
 * Zod schema for location-based search filters
 */
export declare const LocationFilterSchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    neighborhood: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    distance: z.ZodOptional<z.ZodNumber>;
    coordinates: z.ZodOptional<z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Zod schema for room count validation
 */
export declare const RoomCountSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Zod schema for search filters validation
 */
export declare const SearchFiltersSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>>;
    priceRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        currency: z.ZodEnum<{
            BGN: "BGN";
            EUR: "EUR";
            USD: "USD";
        }>;
    }, z.core.$strip>>;
    sizeRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        unit: z.ZodEnum<{
            sqm: "sqm";
            sqft: "sqft";
            acre: "acre";
        }>;
    }, z.core.$strip>>;
    yearRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
    bedrooms: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    bathrooms: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodOptional<z.ZodNumber>;
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
    hasGarage: z.ZodOptional<z.ZodBoolean>;
    hasParking: z.ZodOptional<z.ZodBoolean>;
    isFurnished: z.ZodOptional<z.ZodBoolean>;
    allowsPets: z.ZodOptional<z.ZodBoolean>;
    location: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        neighborhood: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        distance: z.ZodOptional<z.ZodNumber>;
        coordinates: z.ZodOptional<z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    agentId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        active: "active";
        sold: "sold";
        rented: "rented";
    }>>;
}, z.core.$strip>;
/**
 * Zod schema for search sort options
 */
export declare const SearchSortOptionSchema: z.ZodEnum<{
    price_asc: "price_asc";
    price_desc: "price_desc";
    date_asc: "date_asc";
    date_desc: "date_desc";
    size_asc: "size_asc";
    size_desc: "size_desc";
    featured_first: "featured_first";
    distance_asc: "distance_asc";
    popularity_desc: "popularity_desc";
}>;
/**
 * Zod schema for pagination parameters
 */
export declare const PaginationParamsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Zod schema for search query validation
 */
export declare const SearchQuerySchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    filters: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<{
            house: "house";
            apartment: "apartment";
            villa: "villa";
            office: "office";
            commercial: "commercial";
            land: "land";
        }>>;
        priceRange: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            currency: z.ZodEnum<{
                BGN: "BGN";
                EUR: "EUR";
                USD: "USD";
            }>;
        }, z.core.$strip>>;
        sizeRange: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            unit: z.ZodEnum<{
                sqm: "sqm";
                sqft: "sqft";
                acre: "acre";
            }>;
        }, z.core.$strip>>;
        yearRange: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, z.core.$strip>>;
        bedrooms: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        bathrooms: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodOptional<z.ZodNumber>;
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
        hasGarage: z.ZodOptional<z.ZodBoolean>;
        hasParking: z.ZodOptional<z.ZodBoolean>;
        isFurnished: z.ZodOptional<z.ZodBoolean>;
        allowsPets: z.ZodOptional<z.ZodBoolean>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            neighborhood: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
            distance: z.ZodOptional<z.ZodNumber>;
            coordinates: z.ZodOptional<z.ZodObject<{
                lat: z.ZodNumber;
                lng: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        isFeatured: z.ZodOptional<z.ZodBoolean>;
        agentId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            active: "active";
            sold: "sold";
            rented: "rented";
        }>>;
    }, z.core.$strip>;
    sort: z.ZodDefault<z.ZodEnum<{
        price_asc: "price_asc";
        price_desc: "price_desc";
        date_asc: "date_asc";
        date_desc: "date_desc";
        size_asc: "size_asc";
        size_desc: "size_desc";
        featured_first: "featured_first";
        distance_asc: "distance_asc";
        popularity_desc: "popularity_desc";
    }>>;
    pagination: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Zod schema for search result item
 */
export declare const SearchResultSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodString;
    type: z.ZodEnum<{
        house: "house";
        apartment: "apartment";
        villa: "villa";
        office: "office";
        commercial: "commercial";
        land: "land";
    }>;
    size: z.ZodNumber;
    bedrooms: z.ZodNumber;
    bathrooms: z.ZodNumber;
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
    images: z.ZodArray<z.ZodString>;
    agentId: z.ZodString;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    distance: z.ZodOptional<z.ZodNumber>;
    relevanceScore: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Zod schema for search response
 */
export declare const SearchResponseSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        price: z.ZodNumber;
        currency: z.ZodString;
        type: z.ZodEnum<{
            house: "house";
            apartment: "apartment";
            villa: "villa";
            office: "office";
            commercial: "commercial";
            land: "land";
        }>;
        size: z.ZodNumber;
        bedrooms: z.ZodNumber;
        bathrooms: z.ZodNumber;
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
        images: z.ZodArray<z.ZodString>;
        agentId: z.ZodString;
        isFeatured: z.ZodDefault<z.ZodBoolean>;
        distance: z.ZodOptional<z.ZodNumber>;
        relevanceScore: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNext: z.ZodBoolean;
    hasPrev: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Zod schema for saved search
 */
export declare const SavedSearchSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    query: z.ZodObject<{
        query: z.ZodOptional<z.ZodString>;
        filters: z.ZodObject<{
            type: z.ZodOptional<z.ZodEnum<{
                house: "house";
                apartment: "apartment";
                villa: "villa";
                office: "office";
                commercial: "commercial";
                land: "land";
            }>>;
            priceRange: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                currency: z.ZodEnum<{
                    BGN: "BGN";
                    EUR: "EUR";
                    USD: "USD";
                }>;
            }, z.core.$strip>>;
            sizeRange: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                unit: z.ZodEnum<{
                    sqm: "sqm";
                    sqft: "sqft";
                    acre: "acre";
                }>;
            }, z.core.$strip>>;
            yearRange: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
            }, z.core.$strip>>;
            bedrooms: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            bathrooms: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodOptional<z.ZodNumber>;
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
            hasGarage: z.ZodOptional<z.ZodBoolean>;
            hasParking: z.ZodOptional<z.ZodBoolean>;
            isFurnished: z.ZodOptional<z.ZodBoolean>;
            allowsPets: z.ZodOptional<z.ZodBoolean>;
            location: z.ZodOptional<z.ZodObject<{
                city: z.ZodOptional<z.ZodString>;
                neighborhood: z.ZodOptional<z.ZodString>;
                postalCode: z.ZodOptional<z.ZodString>;
                distance: z.ZodOptional<z.ZodNumber>;
                coordinates: z.ZodOptional<z.ZodObject<{
                    lat: z.ZodNumber;
                    lng: z.ZodNumber;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
            isFeatured: z.ZodOptional<z.ZodBoolean>;
            agentId: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                active: "active";
                sold: "sold";
                rented: "rented";
            }>>;
        }, z.core.$strip>;
        sort: z.ZodDefault<z.ZodEnum<{
            price_asc: "price_asc";
            price_desc: "price_desc";
            date_asc: "date_asc";
            date_desc: "date_desc";
            size_asc: "size_asc";
            size_desc: "size_desc";
            featured_first: "featured_first";
            distance_asc: "distance_asc";
            popularity_desc: "popularity_desc";
        }>>;
        pagination: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            offset: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    notificationEnabled: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDefault<z.ZodDate>;
    updatedAt: z.ZodDefault<z.ZodDate>;
}, z.core.$strip>;
/**
 * Zod schema for search suggestions
 */
export declare const SearchSuggestionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        agent: "agent";
        city: "city";
        neighborhood: "neighborhood";
        property: "property";
    }>;
    value: z.ZodString;
    label: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
//# sourceMappingURL=search.d.ts.map