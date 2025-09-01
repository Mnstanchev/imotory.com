"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { getListings, type Listing, resolveAssetUrl, getFirstValidImage, getPropertyTypes, getListingTypes, searchLocations } from "../../lib/api";
import Link from "next/link";
import { trackGuestFavorite } from "../../lib/analytics";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;
mapboxgl.accessToken = MAPBOX_TOKEN || "";

// Disable Mapbox telemetry to prevent analytics requests
if (typeof window !== 'undefined') {
  mapboxgl.prewarm();
  (mapboxgl as any).getEventBuffer = () => ({ flush: () => {} });
}

function SearchMapContent() {
  const { t, currentLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, any>>({
    propertyType: undefined,
    listingType: undefined,
    currency: undefined,
    bedrooms: undefined,
    beds: undefined,
    bathrooms: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sizeMin: undefined,
    sizeMax: undefined,
    floor: undefined,
    totalFloors: undefined,
    yearBuiltMin: undefined,
    yearBuiltMax: undefined,
    garage: undefined,
    balcony: undefined,
    pool: undefined,
    elevator: undefined,
    furnished: undefined,
    airConditioning: undefined,
    buildingType: undefined,
    buildingCondition: undefined,
    heatingType: undefined,
    ownershipType: undefined,
    kitchens: undefined,
    livingRooms: undefined,
    maintenanceFeeMax: undefined,
    mortgagePossible: undefined,
    parkingSpots: undefined,
    pricePerSqMMin: undefined,
    pricePerSqMMax: undefined,
    gardenSizeMin: undefined,
    gardenSizeMax: undefined,
    golfCourseDistance: undefined,
    oceanDistance: undefined,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("priceAsc");
  const [showListings, setShowListings] = useState(true);

  // Location search
  const [locationQuery, setLocationQuery] = useState("");
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);

  const { data: locationResults = [] } = useQuery({
    queryKey: ["searchLocations", locationQuery],
    queryFn: () => searchLocations(locationQuery),
    enabled: locationQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: Record<string, any> = {};
    
    // Parse all search parameters
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        // Handle boolean values
        if (value === "true" || value === "false") {
          urlFilters[key] = value === "true";
        }
        // Handle numeric values
        else if (!isNaN(Number(value)) && value !== "") {
          urlFilters[key] = Number(value);
        }
        // Handle string values
        else {
          urlFilters[key] = value;
        }
      }
    }

    setFilters(urlFilters);
    
    // Set location query if present
    if (urlFilters.location) {
      setLocationQuery(urlFilters.location);
    }

    setLoading(false);
  }, [searchParams]);

  // Fetch listings
  const { data: listings = [], isLoading: isListingsLoading } = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
    enabled: !loading,
    staleTime: 30 * 1000,
  });

  // Fetch property types
  const { data: propertyTypes = [] } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: getPropertyTypes,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch listing types  
  const { data: listingTypes = [] } = useQuery({
    queryKey: ["listingTypes"],
    queryFn: getListingTypes,
    staleTime: 5 * 60 * 1000,
  });

  // Mapbox
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [25.4858, 42.7339], // Bulgaria center
      zoom: 6.5,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Update map markers
  useEffect(() => {
    if (!mapRef.current || !listings.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const markerEl = document.createElement("div");
      markerEl.className = "marker";
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        background: #1f2937;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `;
      markerEl.textContent = "€";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; max-width: 200px;">
          <img src="${resolveAssetUrl(getFirstValidImage(listing.images) || "", { listingId: listing.id, entityType: 'listing' })}" 
               alt="${listing.title?.[currentLanguage] || listing.title?.en || ""}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
            ${listing.title?.[currentLanguage] || listing.title?.en || ""}
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
            ${listing.location?.name?.[currentLanguage] || listing.location?.name?.en || ""}
          </p>
          <div style="font-size: 14px; font-weight: bold; color: #1f2937;">
            €${listing.price?.toLocaleString() || "N/A"}
          </div>
          <a href="/listings/${listing.slug}" 
             style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: #1f2937; color: white; text-decoration: none; border-radius: 3px; font-size: 12px;">
            ${t('view_details')}
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Fit map to markers if there are any
    if (listings.length > 0) {
      const validCoords = listings
        .filter(l => l.latitude && l.longitude)
        .map(l => [l.longitude!, l.latitude!] as [number, number]);

      if (validCoords.length > 0) {
        const bounds = validCoords.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(validCoords[0], validCoords[0]));

        mapRef.current?.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [listings, currentLanguage, t]);

  // Sort listings
  const sortedListings = useMemo(() => {
    if (!listings.length) return [];

    const sorted = [...listings].sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return (a.price || 0) - (b.price || 0);
        case "priceDesc":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return 0; // API doesn't provide createdAt, so no sorting
        case "oldest":
          return 0; // API doesn't provide createdAt, so no sorting
        case "sizeAsc":
          return (a.size || 0) - (b.size || 0);
        case "sizeDesc":
          return (b.size || 0) - (a.size || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [listings, sortBy]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? undefined : value
    }));
  };

  // Handle location selection
  const handleLocationSelect = (location: any) => {
    setLocationQuery(location.display_name);
    setFilters(prev => ({
      ...prev,
      location: location.display_name,
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    }));
    setIsLocationSearchOpen(false);

    // Center map on selected location
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [parseFloat(location.lon), parseFloat(location.lat)],
        zoom: 12,
      });
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (listingId: string) => {
    const isCurrentlyFavorited = favorites.includes(listingId);
    
    if (isCurrentlyFavorited) {
      setFavorites(prev => prev.filter(id => id !== listingId));
    } else {
      setFavorites(prev => [...prev, listingId]);
      await trackGuestFavorite(listingId, new Date().toLocaleString('en-GB', { timeZone: 'Europe/Sofia' }));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setLocationQuery("");
  };

  // Get active filter count
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== "").length;

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Location Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setIsLocationSearchOpen(true);
                  }}
                  onFocus={() => setIsLocationSearchOpen(true)}
                  placeholder={t('search_location')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                
                {/* Location Results */}
                {isLocationSearchOpen && locationQuery.length >= 2 && locationResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                    {locationResults.map((location: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-sm">{location.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {t('filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              {/* Listings Toggle */}
              <button
                onClick={() => setShowListings(!showListings)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {showListings ? t('hide_listings') : t('show_listings')}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('property_type')}</label>
                  <select
                    value={filters.propertyType || ""}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">{t('any')}</option>
                    {propertyTypes.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name?.[currentLanguage] || type.name?.en || type.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('listing_type')}</label>
                  <select
                    value={filters.listingType || ""}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">{t('any')}</option>
                    {listingTypes.map((type: any) => (
                      <option key={type.id} value={type.id}>
                        {type.name?.[currentLanguage] || type.name?.en || type.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_price')}</label>
                  <input
                    type="number"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="€"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_price')}</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="€"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>

                {/* Size Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_size')}</label>
                  <input
                    type="number"
                    value={filters.sizeMin || ""}
                    onChange={(e) => handleFilterChange('sizeMin', e.target.value)}
                    placeholder="m²"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_size')}</label>
                  <input
                    type="number"
                    value={filters.sizeMax || ""}
                    onChange={(e) => handleFilterChange('sizeMax', e.target.value)}
                    placeholder="m²"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('bedrooms')}</label>
                  <select
                    value={filters.bedrooms || ""}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">{t('any')}</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('bathrooms')}</label>
                  <select
                    value={filters.bathrooms || ""}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">{t('any')}</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {t('clear_all_filters')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listings Panel */}
      {showListings && (
        <div className="absolute top-4 right-4 bottom-4 w-80 z-10">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('listings')} ({sortedListings.length})
                </h2>
                <button
                  onClick={() => setShowListings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              >
                <option value="priceAsc">{t('price_low_to_high')}</option>
                <option value="priceDesc">{t('price_high_to_low')}</option>
                <option value="newest">{t('newest_first')}</option>
                <option value="oldest">{t('oldest_first')}</option>
                <option value="sizeAsc">{t('size_small_to_large')}</option>
                <option value="sizeDesc">{t('size_large_to_small')}</option>
              </select>
            </div>

            {/* Listings */}
            <div className="flex-1 overflow-y-auto p-4">
              {isListingsLoading ? (
                <div className="text-center py-8 text-gray-600">
                  {t('loading')}...
                </div>
              ) : sortedListings.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  {t('no_listings_found')}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedListings.map((listing) => (
                    <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/listings/${listing.slug}`}>
                        <div className="relative">
                          <img
                            src={resolveAssetUrl(getFirstValidImage(listing.images) || "", { listingId: listing.id, entityType: 'listing' })}
                            alt={listing.title?.[currentLanguage] || listing.title?.en || ""}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleFavoriteToggle(listing.id);
                            }}
                            className={`absolute top-2 right-2 p-1.5 rounded-full ${
                              favorites.includes(listing.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600'
                            } hover:scale-110 transition-transform`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>
                      </Link>

                      <div className="p-3">
                        <Link href={`/listings/${listing.slug}`}>
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {listing.title?.[currentLanguage] || listing.title?.en || ""}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {listing.location?.name?.[currentLanguage] || listing.location?.name?.en || ""}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-900">
                              €{listing.price?.toLocaleString() || "N/A"}
                            </div>
                            <div className="text-xs text-gray-600">
                              {listing.size}m²
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for location search */}
      {isLocationSearchOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsLocationSearchOpen(false)}
        />
      )}
    </div>
  );
}

export default function SearchMapPageClient() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
      <SearchMapContent />
    </Suspense>
  );
}
