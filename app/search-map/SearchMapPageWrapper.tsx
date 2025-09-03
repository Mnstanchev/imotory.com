"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    terraceSizeMin: undefined,
    terraceSizeMax: undefined,
    features: undefined,
    tags: undefined,
  });
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Debug wrapper for setSelectedId
  const handleSelectListing = (id: string) => {
    console.log('handleSelectListing called with id:', id); // Debug log
    setSelectedId(id);
  };
  const [selectedRegionNames, setSelectedRegionNames] = useState<string[]>([]);

  const { data: listings = [] } = useQuery({
    queryKey: ["explore"],
    queryFn: () => getListings({ limit: 200 }),
  });

  const { data: propertyTypes = [] } = useQuery({
    queryKey: ["property-types"],
    queryFn: () => getPropertyTypes(),
  });

  const { data: listingTypes = [] } = useQuery({
    queryKey: ["listing-types"],
    queryFn: () => getListingTypes(),
  });

  // If a specific location is selected in URL, fetch a broader locations list to resolve its human name
  const { data: allLocations = [] } = useQuery({
    queryKey: ["all-locations"],
    queryFn: () => searchLocations(""),
    enabled: Boolean(filters.locationId || (filters as any).locationIds?.length),
  });

  // Narrow dependencies for the sync effect below to only the relevant filter fields
  const locationId = (filters as any).locationId as string | undefined;
  const locationIds = (filters as any).locationIds as string[] | undefined;

  // Keep map highlight in sync when location filter chips change (including X removal)
  useEffect(() => {
    const idsArr = Array.isArray(locationIds) ? (locationIds as string[]) : [];
    const single = locationId ? [String(locationId)] : [];
    const targetIds = idsArr.length ? idsArr : single;
    if (!targetIds.length) {
      // Only clear if something is actually selected to avoid infinite re-renders
      setSelectedRegionNames((prev) => (prev.length ? [] : prev));
      return;
    }
    const idToName: Record<string, string> = {};
    // From current listings (prefer EN for matching GeoJSON shapeName)
    for (const l of listings as any[]) {
      const id = l?.location?.id as string | undefined;
      const nameEn = l?.location?.name?.en as string | undefined;
      if (id && nameEn && !idToName[id]) idToName[id] = nameEn;
    }
    // From loaded locations (fallback when there are zero listings)
    for (const loc of (allLocations as any[])) {
      const id = String(loc?.id ?? "");
      const nameEn = (loc?.name?.en as string) || (loc?.label?.en as string) || (loc?.slug as string);
      if (id && nameEn && !idToName[id]) idToName[id] = nameEn;
    }
    const names = targetIds.map((id) => idToName[id]).filter(Boolean) as string[];
    // Avoid state churn by only updating when value actually changes
    setSelectedRegionNames((prev) => {
      if (prev.length === names.length && prev.every((v, i) => v === names[i])) return prev;
      return names;
    });
  }, [locationId, locationIds, listings, allLocations]);

  // When regions selection changes on the map, resolve each to our best matching Location in DB
  async function handleRegionsChange(regionNames: string[]) {
    setSelectedRegionNames(regionNames);
    if (!regionNames.length) {
      setFilters((prev) => ({ ...prev, locationIds: undefined, locationId: undefined }));
      return;
    }
    try {
      const norm = (s: string) => s.trim().toLowerCase();
      const results = await Promise.all(
        regionNames.map(async (name) => {
          try {
            const candidates = await searchLocations(name);
            if (Array.isArray(candidates) && candidates.length) {
              const exact = candidates.find((c: any) => {
                const n = c?.name || {};
                return [n.en, n.bg, n.ru, c?.slug].filter(Boolean).some((v: string) => norm(String(v)) === norm(name));
              });
              const best = exact || candidates.sort((a: any, b: any) => ((b?._count?.listings || 0) - (a?._count?.listings || 0)))[0];
              return best?.id ? String(best.id) : undefined;
            }
          } catch {}
          return undefined;
        })
      );
      const ids = Array.from(new Set(results.filter(Boolean) as string[]));
      setFilters((prev) => ({ ...prev, locationIds: ids, locationId: undefined }));
    } catch {}
  }

  // Initialize filters from URL query params (supports home search handoff)
  useEffect(() => {
    if (!searchParams) return;
    const nextFilters: Record<string, any> = {};
    const listingType = searchParams.get("listingType") || undefined;
    const propertyType = searchParams.get("propertyType") || undefined;
    const minPrice = searchParams.get("minPrice") || undefined;
    const maxPrice = searchParams.get("maxPrice") || undefined;
    const locationId = searchParams.get("locationId") || undefined;
    if (listingType) nextFilters.listingType = listingType;
    if (propertyType) nextFilters.propertyType = propertyType;
    if (minPrice) nextFilters.minPrice = minPrice;
    if (maxPrice) nextFilters.maxPrice = maxPrice;
    if (locationId) nextFilters.locationId = locationId;
    if (Object.keys(nextFilters).length) setFilters((prev) => ({ ...prev, ...nextFilters }));
  }, [searchParams]);

  const priceBounds = useMemo(() => {
    if (!listings.length) return { min: 0, max: 10000 };
    const nums = listings.map((l) => Number(l.price)).filter((n) => !isNaN(n));
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { min: Math.floor(min), max: Math.ceil(max) };
  }, [listings]);

  const sizeBounds = useMemo(() => {
    const vals = listings.map((l) => Number(l.size ?? 0)).filter((n) => n > 0);
    if (!vals.length) return { min: 0, max: 500 };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [listings]);

  const ppsmBounds = useMemo(() => {
    const vals = listings.map((l) => Number(l.pricePerSqM ?? 0)).filter((n) => n > 0);
    if (!vals.length) return { min: 0, max: 5000 };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [listings]);

  const yearBounds = useMemo(() => {
    const vals = listings.map((l) => Number(l.yearBuilt ?? 0)).filter((n) => n > 1800);
    if (!vals.length) return { min: 1950, max: new Date().getFullYear() };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [listings]);

  const currencies = useMemo(() => {
    const set = new Set(listings.map((l) => l.currency).filter(Boolean));
    return Array.from(set) as string[];
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      if (filters.listingType && l.listingType !== filters.listingType) return false;
      if ((filters as any).locationId && (l as any).location?.id !== (filters as any).locationId) return false;
      if (Array.isArray((filters as any).locationIds) && (filters as any).locationIds.length) {
        const ok = (filters as any).locationIds.includes((l as any).location?.id);
        if (!ok) return false;
      }
      if (filters.currency && l.currency !== filters.currency) return false;
      if (filters.bedrooms && (l.bedrooms ?? 0) < Number(filters.bedrooms)) return false;
      if (filters.beds && (l.bedrooms ?? 0) < Number(filters.beds)) return false;
      if (filters.bathrooms && (l.bathrooms ?? 0) < Number(filters.bathrooms)) return false;
      if (filters.minPrice && Number(l.price) < Number(filters.minPrice)) return false;
      if (filters.maxPrice && Number(l.price) > Number(filters.maxPrice)) return false;
      if (filters.sizeMin && (l.size ?? 0) < Number(filters.sizeMin)) return false;
      if (filters.sizeMax && (l.size ?? 0) > Number(filters.sizeMax)) return false;
      if (filters.floor && (l.floor ?? 0) < Number(filters.floor)) return false;
      if (filters.totalFloors && (l.totalFloors ?? 0) < Number(filters.totalFloors)) return false;
      if (filters.yearBuiltMin && (l.yearBuilt ?? 0) < Number(filters.yearBuiltMin)) return false;
      if (filters.yearBuiltMax && (l.yearBuilt ?? 0) > Number(filters.yearBuiltMax)) return false;
      if (filters.buildingType && (l as any).buildingType !== filters.buildingType) return false;
      if (filters.buildingCondition && (l as any).buildingCondition !== filters.buildingCondition) return false;
      if (filters.heatingType && (l as any).heatingType !== filters.heatingType) return false;
      if (filters.ownershipType && (l as any).ownershipType !== filters.ownershipType) return false;
      if (filters.kitchens && (l.kitchens ?? 0) < Number(filters.kitchens)) return false;
      if (filters.livingRooms && (l.livingRooms ?? 0) < Number(filters.livingRooms)) return false;
      if (filters.maintenanceFeeMax && Number((l as any).maintenanceFee ?? 0) > Number(filters.maintenanceFeeMax)) return false;
      if (filters.mortgagePossible && !(l as any).mortgagePossible) return false;
      if (filters.parkingSpots && (l.parkingSpots ?? 0) < Number(filters.parkingSpots)) return false;
      if (filters.pricePerSqMMin && Number((l as any).pricePerSqM ?? 0) < Number(filters.pricePerSqMMin)) return false;
      if (filters.pricePerSqMMax && Number((l as any).pricePerSqM ?? 0) > Number(filters.pricePerSqMMax)) return false;
      if (filters.gardenSizeMin && (l.gardenSize ?? 0) < Number(filters.gardenSizeMin)) return false;
      if (filters.gardenSizeMax && (l.gardenSize ?? 0) > Number(filters.gardenSizeMax)) return false;
      if (filters.terraceSizeMin && (l.terraceSize ?? 0) < Number(filters.terraceSizeMin)) return false;
      if (filters.terraceSizeMax && (l.terraceSize ?? 0) > Number(filters.terraceSizeMax)) return false;
      if (filters.garage && !l.features?.includes("garage") && !(l as any).garage) return false;
      if (filters.balcony && !(l as any).balcony) return false;
      if (filters.pool && !(l as any).pool) return false;
      if (filters.elevator && !(l as any).elevator) return false;
      if (filters.furnished && !(l as any).furnished) return false;
      if (filters.airConditioning && !(l as any).airConditioning) return false;
      if (filters.features) {
        const toks = String(filters.features)
          .split(/[,\s]+/)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        if (toks.length) {
          const hasAny = (l.features ?? []).some((f) => toks.includes(String(f).toLowerCase()));
          if (!hasAny) return false;
        }
      }
      if (filters.tags) {
        const toks = String(filters.tags)
          .split(/[,\s]+/)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        if (toks.length) {
          const hasAny = ((l as any).tags ?? []).some((f: string) => toks.includes(String(f).toLowerCase()));
          if (!hasAny) return false;
        }
      }
      return true;
    });
  }, [listings, filters]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [mobileView, setMobileView] = useState<'listings' | 'map'>('listings'); // Default to listings on mobile

  return (
    <div className="w-full h-[calc(100vh-0px)] relative">
      {/* Desktop Grid Layout */}
      <div className="hidden lg:grid h-full grid-cols-[320px_minmax(520px,1fr)_minmax(480px,1fr)]">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          propertyTypes={propertyTypes}
          listingTypes={listingTypes}
          priceBounds={priceBounds}
          sizeBounds={sizeBounds}
          yearBounds={yearBounds}
          currencies={currencies}
          ppsmBounds={ppsmBounds}
          t={t}
          currentLanguage={currentLanguage}
        />
        <MainList
          listings={filteredListings}
          filters={filters}
          setFilters={setFilters}
          view={view}
          setView={setView}
          selectedId={selectedId}
          t={t}
          currentLanguage={currentLanguage}
          allLocations={allLocations as any[]}
        />
        <MapView
          listings={filteredListings}
          onSelectListing={handleSelectListing}
          selectedId={selectedId}
          onSelectRegions={handleRegionsChange}
          selectedRegionNames={selectedRegionNames}
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Mobile Control Bar - Below Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg py-3 px-4 hover:bg-gray-800 relative"
              aria-label="Toggle filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">Filters</span>
              {Object.values(filters).filter(v => v !== undefined && v !== "").length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== undefined && v !== "").length}
                </span>
              )}
            </button>

            {/* Map/Listings Toggle Button */}
            <button
              onClick={() => setMobileView(mobileView === 'listings' ? 'map' : 'listings')}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white rounded-lg py-3 px-4 hover:bg-gray-800 relative"
              aria-label={mobileView === 'listings' ? 'Show map' : 'Show listings'}
            >
              {mobileView === 'listings' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="font-medium">Map</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="font-medium">Listings</span>
                  {filteredListings.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {filteredListings.length > 99 ? '99+' : filteredListings.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileView === 'listings' ? (
            <div className="h-full w-full overflow-hidden">
              <MobileMainList
                listings={filteredListings}
                filters={filters}
                setFilters={setFilters}
                view={view}
                setView={setView}
                selectedId={selectedId}
                t={t}
                currentLanguage={currentLanguage}
                allLocations={allLocations as any[]}
              />
            </div>
                           ) : (
                   <div className="relative h-full">
                     <MapView
                       listings={filteredListings}
                       onSelectListing={handleSelectListing}
                       selectedId={selectedId}
                       onSelectRegions={handleRegionsChange}
                       selectedRegionNames={selectedRegionNames}
                     />
                     <MobileMapCarousel
                       listings={filteredListings}
                       selectedId={selectedId}
                       onSelectListing={handleSelectListing}
                       currentLanguage={currentLanguage}
                     />
                   </div>
                 )}
        </div>

                       {/* Mobile Sidebar Overlay */}
               {showSidebar && (
                 <>
                   <div
                     className="fixed inset-0 bg-black bg-opacity-50 z-20"
                     onClick={() => setShowSidebar(false)}
                   />
                   <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-30 bg-white overflow-hidden">
                     <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                       <h2 className="text-lg font-semibold text-black">Filters</h2>
                       <button
                         onClick={() => setShowSidebar(false)}
                         className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                       >
                         <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     </div>
                     <div className="overflow-auto h-[calc(100%-60px)] w-full">
                       <MobileSidebar
                         filters={filters}
                         setFilters={setFilters}
                         propertyTypes={propertyTypes}
                         listingTypes={listingTypes}
                         priceBounds={priceBounds}
                         sizeBounds={sizeBounds}
                         yearBounds={yearBounds}
                         currencies={currencies}
                         ppsmBounds={ppsmBounds}
                         t={t}
                         currentLanguage={currentLanguage}
                       />
                     </div>
                   </div>
                 </>
               )}
      </div>
    </div>
  );
}

function Sidebar({
  filters,
  setFilters,
  propertyTypes,
  listingTypes,
  priceBounds,
  sizeBounds,
  yearBounds,
  currencies,
  ppsmBounds,
  t,
  currentLanguage,
}: {
  filters: Record<string, any>;
  setFilters: (f: any) => void;
  propertyTypes: any[];
  listingTypes: any[];
  priceBounds: { min: number; max: number };
  sizeBounds: { min: number; max: number };
  yearBounds: { min: number; max: number };
  currencies: string[];
  ppsmBounds: { min: number; max: number };
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: string;
}) {
  const sectionKeys = [
    "propertyType","listingType","minPrice","maxPrice","currency","sizeMin","sizeMax","floor","totalFloors","yearBuiltMin","yearBuiltMax","bedrooms","beds","bathrooms","buildingType","buildingCondition","heatingType","ownershipType","kitchens","livingRooms","parkingSpots","maintenanceFeeMax","mortgagePossible","pricePerSqMMin","pricePerSqMMax","gardenSizeMin","gardenSizeMax","terraceSizeMin","terraceSizeMax","airConditioning","furnished","elevator","balcony","garage","pool","features","tags"
  ] as const;

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([k,v]) => (sectionKeys as readonly string[]).includes(k) && v !== undefined && v !== "").length;
  }, [filters]);

  const clearAll = () => {
    const cleared: Record<string, any> = {};
    for (const k of sectionKeys as readonly string[]) cleared[k] = undefined;
    setFilters({ ...filters, ...cleared });
  };
  const normalize = (items: any[], fallback: string[]) => {
    if (!items || !items.length) return fallback.map((v) => ({ value: v, label: t(`enums.propertyType.${v}`) || formatEnum(v) }));
    return items.map((it: any) => {
      const value = typeof it === "string" ? it : it.value ?? it.id ?? String(it);
      const label = typeof it === "string" ? (t(`enums.propertyType.${it}`) || formatEnum(it)) : it.label?.[currentLanguage] ?? it.label?.en ?? it.label ?? formatEnum(value);
      return { value, label };
    });
  };

  const ptOptions = normalize(propertyTypes, ["APARTMENT", "HOUSE", "VILLA", "STUDIO", "OFFICE", "COMMERCIAL"]);

  return (
    <aside className="border-r border-gray-200 bg-white p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-900 font-semibold">{t('search_map.filters')} {activeCount ? <span className="ml-2 text-gray-600 text-sm">({activeCount})</span> : null}</div>
        <button onClick={clearAll} className="text-gray-700 hover:text-gray-900 underline underline-offset-2 text-sm">{t('search_map.clear_all')}</button>
      </div>
      <div className="space-y-4">
        {/* Property Type */}
        <FilterSection title={t('search_map.property_type')}>
          <div className="grid grid-cols-2 gap-3">
            {ptOptions.map((pt) => {
              const active = filters.propertyType === pt.value;
              return (
                <button
                  key={pt.value}
                  onClick={() => setFilters({ ...filters, propertyType: active ? undefined : pt.value })}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                    active ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <TypeIcon />
                  <span className="text-black">{pt.label}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title={t('search_map.price_range')}>
          <div>
            <HistogramPlaceholder />
            <div className="mt-2 flex items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={(filters.minPrice as number) ?? priceBounds.min}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  className="w-full"
                />
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={(filters.maxPrice as number) ?? priceBounds.max}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <PriceInput
                value={(filters.minPrice as number) ?? priceBounds.min}
                onChange={(v) => setFilters({ ...filters, minPrice: v })}
              />
              <div className="text-gray-500 text-sm text-center">-</div>
              <PriceInput
                value={(filters.maxPrice as number) ?? priceBounds.max}
                onChange={(v) => setFilters({ ...filters, maxPrice: v })}
              />
            </div>
          </div>
        </FilterSection>

        {/* Currency */}
        {currencies.length ? (
          <FilterSection title={t('search_map.currency')}>
            <div className="flex flex-wrap gap-2">
              {currencies.map((c) => {
                const active = filters.currency === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, currency: active ? undefined : c })}
                    className={`rounded border px-2 py-1 text-sm ${
                      active ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        ) : null}

        {/* Size */}
        <FilterSection title={t('search_map.size_sqm')}>
          <DualRange
            min={sizeBounds.min}
            max={sizeBounds.max}
            valueMin={(filters.sizeMin as number) ?? sizeBounds.min}
            valueMax={(filters.sizeMax as number) ?? sizeBounds.max}
            onChange={(a, b) => setFilters({ ...filters, sizeMin: a, sizeMax: b })}
          />
        </FilterSection>

        {/* Floor and Total Floors */}
        <FilterSection title="">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={t('search_map.min_floor')} value={filters.floor as number} onChange={(v) => setFilters({ ...filters, floor: v })} />
          <NumberField
            label={t('search_map.min_total_floors')}
            value={filters.totalFloors as number}
            onChange={(v) => setFilters({ ...filters, totalFloors: v })}
          />
        </div>
        </FilterSection>

        {/* Year Built */}
        <FilterSection title={t('search_map.year_built')}>
          <DualRange
            min={yearBounds.min}
            max={yearBounds.max}
            valueMin={(filters.yearBuiltMin as number) ?? yearBounds.min}
            valueMax={(filters.yearBuiltMax as number) ?? yearBounds.max}
            onChange={(a, b) => setFilters({ ...filters, yearBuiltMin: a, yearBuiltMax: b })}
          />
        </FilterSection>

        {/* Rooms & Beds */}
        <FilterSection title={t('search_map.rooms_beds')}>
          <div className="space-y-4">
          <div>
            <div className="text-gray-700 text-sm">{t('listing.beds')}</div>
            <Chips
              options={[1, 2, 3, 4, 5]}
              value={filters.bedrooms as number}
              onChange={(v) => setFilters({ ...filters, bedrooms: v })}
            />
          </div>
          <div>
            <div className="text-gray-700 text-sm">{t('listing.beds')}</div>
            <Chips
              options={[1, 2, 3, 4, 5]}
              value={filters.beds as number}
              onChange={(v) => setFilters({ ...filters, beds: v })}
            />
          </div>
          <div>
            <div className="text-gray-700 text-sm">{t('listing.baths')}</div>
            <Chips
              options={[1, 2, 3, 4, 5]}
              value={filters.bathrooms as number}
              onChange={(v) => setFilters({ ...filters, bathrooms: v })}
            />
          </div>
        </div>
        </FilterSection>

        {/* Listing Type */}
        {normalize(listingTypes, []).length ? (
          <FilterSection title={t('search_map.listing_type')}>
            <div className="flex flex-wrap gap-2">
              {normalize(listingTypes, []).map((lt) => {
                const active = filters.listingType === lt.value;
                return (
                  <button
                    key={lt.value}
                    onClick={() => setFilters({ ...filters, listingType: active ? undefined : lt.value })}
                    className={`rounded border px-3 py-1 text-sm ${
                      active ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {lt.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        ) : null}

        {/* Amenities */}
        <FilterSection title={t('search_map.amenities')}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "airConditioning", label: t('search_map.air_conditioning') },
              { key: "furnished", label: t('search_map.furnished') },
              { key: "elevator", label: t('search_map.elevator') },
              { key: "balcony", label: t('search_map.balcony') },
              { key: "garage", label: t('search_map.garage') },
              { key: "pool", label: t('search_map.pool') },
            ].map((a) => (
              <label key={a.key} className="inline-flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={Boolean((filters as any)[a.key])}
                  onChange={(e) => setFilters({ ...filters, [a.key]: e.target.checked || undefined })}
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Building / Heating / Ownership */}
        <FilterSection title="">
        <div className="grid grid-cols-1 gap-3">
          <SelectField
            label={t('search_map.building_type')}
            options={["PANEL", "BRICK", "NEW_BUILD", "MONOLITHIC", "WOOD", "PREFAB"]}
            value={filters.buildingType as string}
            onChange={(v) => setFilters({ ...filters, buildingType: v })}
            enumGroup="buildingType"
            t={t}
          />
          <SelectField
            label={t('search_map.building_condition')}
            options={["NEW", "GOOD", "RENOVATED", "NEEDS_RENOVATION"]}
            value={filters.buildingCondition as string}
            onChange={(v) => setFilters({ ...filters, buildingCondition: v })}
            enumGroup="buildingCondition"
            t={t}
          />
          <SelectField
            label={t('search_map.heating_type')}
            options={["NONE", "CENTRAL", "ELECTRIC", "GAS", "WOOD", "SOLAR", "HEATPUMP"]}
            value={filters.heatingType as string}
            onChange={(v) => setFilters({ ...filters, heatingType: v })}
            enumGroup="heatingType"
            t={t}
          />
          <SelectField
            label={t('search_map.ownership_type')}
            options={["FREEHOLD", "LEASEHOLD", "COOPERATIVE"]}
            value={filters.ownershipType as string}
            onChange={(v) => setFilters({ ...filters, ownershipType: v })}
            enumGroup="ownershipType"
            t={t}
          />
        </div>
        </FilterSection>

        {/* Counts and fees */}
        <FilterSection title="">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label={`${t('listing.kitchens')} ≥`} value={filters.kitchens as number} onChange={(v) => setFilters({ ...filters, kitchens: v })} />
          <NumberField
            label={`${t('listing.rooms')} ≥`}
            value={filters.livingRooms as number}
            onChange={(v) => setFilters({ ...filters, livingRooms: v })}
          />
          <NumberField
            label={`${t('listing.parking_spots')} ≥`}
            value={filters.parkingSpots as number}
            onChange={(v) => setFilters({ ...filters, parkingSpots: v })}
          />
          <NumberField
            label={`${t('listing.maintenance_fee')} ≤`}
            value={filters.maintenanceFeeMax as number}
            onChange={(v) => setFilters({ ...filters, maintenanceFeeMax: v })}
          />
          <label className="inline-flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={Boolean(filters.mortgagePossible)}
              onChange={(e) => setFilters({ ...filters, mortgagePossible: e.target.checked || undefined })}
            />
            <span>{t('listing.mortgage_possible')}</span>
          </label>
        </div>
        </FilterSection>

        {/* Price per sq.m */}
        <FilterSection title={t('search_map.price_per_sqm')}>
          <DualRange
            min={ppsmBounds.min}
            max={ppsmBounds.max}
            valueMin={(filters.pricePerSqMMin as number) ?? ppsmBounds.min}
            valueMax={(filters.pricePerSqMMax as number) ?? ppsmBounds.max}
            onChange={(a, b) => setFilters({ ...filters, pricePerSqMMin: a, pricePerSqMMax: b })}
          />
        </FilterSection>

        {/* Outdoor sizes */}
        <FilterSection title={t('search_map.outdoor_areas')}>
          <div className="grid grid-cols-1 gap-3">
            <LabeledRange
              label={t('search_map.garden_size')}
              min={0}
              max={1000}
              valueMin={(filters.gardenSizeMin as number) ?? 0}
              valueMax={(filters.gardenSizeMax as number) ?? 1000}
              onChange={(a, b) => setFilters({ ...filters, gardenSizeMin: a, gardenSizeMax: b })}
            />
            <LabeledRange
              label={t('search_map.terrace_size')}
              min={0}
              max={300}
              valueMin={(filters.terraceSizeMin as number) ?? 0}
              valueMax={(filters.terraceSizeMax as number) ?? 300}
              onChange={(a, b) => setFilters({ ...filters, terraceSizeMin: a, terraceSizeMax: b })}
            />
          </div>
        </FilterSection>

        {/* Features / Tags */}
        <FilterSection title="">
        <div className="grid grid-cols-1 gap-3">
          <TextField label={t('search_map.features_placeholder')} value={(filters.features as string) ?? ""} onChange={(v) => setFilters({ ...filters, features: v || undefined })} />
          <TextField label={t('search_map.tags_placeholder')} value={(filters.tags as string) ?? ""} onChange={(v) => setFilters({ ...filters, tags: v || undefined })} />
        </div>
        </FilterSection>
      </div>
    </aside>
  );
}

function NumberField({ label, value, onChange }: { label: string; value?: number; onChange: (v?: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      />
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="text"
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Chips({ options, value, onChange }: { options: number[]; value?: number; onChange: (v?: number) => void }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            onClick={() => onChange(active ? undefined : n)}
            className={`rounded-md border px-3 py-2 text-sm ${
              active ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {n === 5 ? "5+" : n}
          </button>
        );
      })}
    </div>
  );
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900">
      <input
        type="number"
        className="w-full bg-white outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
      />
    </div>
  );
}

function HistogramPlaceholder() {
  // Simple monochrome bars to visually match the design without external libs
  const bars = Array.from({ length: 24 }, (_, i) => 6 + ((i * 13) % 24));
  return (
    <div className="h-16 w-full flex items-end gap-1">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-gray-200" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function DualRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (a: number, b: number) => void;
}) {
  return (
    <div className="mt-2">
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-gray-900 rounded"
          style={{
            marginLeft: `${((Math.min(valueMin, valueMax) - min) / (max - min)) * 100}%`,
            width: `${((Math.max(valueMin, valueMax) - Math.min(valueMin, valueMax)) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => onChange(Number(e.target.value), valueMax)}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => onChange(valueMin, Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mt-2">
        <PriceInput value={valueMin} onChange={(v) => onChange(v, valueMax)} />
        <div className="text-gray-500 text-sm text-center">-</div>
        <PriceInput value={valueMax} onChange={(v) => onChange(valueMin, v)} />
      </div>
    </div>
  );
}

function LabeledRange({
  label,
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (a: number, b: number) => void;
}) {
  return (
    <div>
      <div className="text-gray-700 text-sm">{label}</div>
      <DualRange min={min} max={max} valueMin={valueMin} valueMax={valueMax} onChange={onChange} />
    </div>
  );
}

function TypeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-gray-900">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z" />
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
    </svg>
  );
}

function SelectField({ label, options, value, onChange, enumGroup, t }: { label: string; options: string[]; value?: string; onChange: (v?: string) => void; enumGroup?: 'propertyType'|'buildingType'|'heatingType'|'ownershipType'|'buildingCondition'; t?: (k: string)=>string }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <select
        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 bg-white"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{t ? t('search_map.any') : 'Any'}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {enumGroup && t ? (t(`enums.${enumGroup}.${o}`) || formatEnum(o)) : formatEnum(o)}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatEnum(v: string | undefined | null) {
  const s = typeof v === "string" ? v : "";
  return s.replace(/_/g, " ").toLowerCase().replace(/(^.| \w)/g, (m) => m.toUpperCase());
}

function FullWidthDualRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  label,
  unit,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (a: number, b: number) => void;
  label: string;
  unit: string;
}) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  };

  return (
    <div className="w-full px-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-black text-sm font-medium">{label}</span>
        <span className="text-black text-xs">
          {formatValue(valueMin)}{unit} - {formatValue(valueMax)}{unit}
        </span>
      </div>
      
      <div className="relative px-2">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-black rounded-full"
            style={{
              marginLeft: `${((Math.min(valueMin, valueMax) - min) / (max - min)) * 100}%`,
              width: `${((Math.max(valueMin, valueMax) - Math.min(valueMin, valueMax)) / (max - min)) * 100}%`,
            }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => onChange(Number(e.target.value), valueMax)}
          className="absolute top-0 w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{
            WebkitAppearance: 'none',
            background: 'transparent',
            pointerEvents: 'all',
            zIndex: 1
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => onChange(valueMin, Number(e.target.value))}
          className="absolute top-0 w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{
            WebkitAppearance: 'none',
            background: 'transparent',
            pointerEvents: 'all',
            zIndex: 2
          }}
        />
      </div>
      
      <div className="flex items-center gap-2 mt-3 px-1">
        <input
          type="number"
          value={valueMin}
          onChange={(e) => onChange(Number(e.target.value || min), valueMax)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-black text-xs bg-white focus:ring-1 focus:ring-black focus:border-black min-w-0"
          placeholder="Min"
        />
        <span className="text-black text-xs flex-shrink-0">-</span>
        <input
          type="number"
          value={valueMax}
          onChange={(e) => onChange(valueMin, Number(e.target.value || max))}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-black text-xs bg-white focus:ring-1 focus:ring-black focus:border-black min-w-0"
          placeholder="Max"
        />
      </div>
      

    </div>
  );
}

function BlackChips({ options, value, onChange }: { options: number[]; value?: number; onChange: (v?: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            onClick={() => onChange(active ? undefined : n)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium min-w-[44px] ${
              active ? "bg-black text-white border-black" : "border-gray-300 text-black hover:bg-gray-50"
            }`}
          >
            {n === 5 ? "5+" : n}
          </button>
        );
      })}
    </div>
  );
}

function MobileMapCarousel({
  listings,
  selectedId,
  onSelectListing,
  currentLanguage,
}: {
  listings: Listing[];
  selectedId?: string | null;
  onSelectListing: (id: string) => void;
  currentLanguage: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update carousel position when selectedId changes
  useEffect(() => {
    console.log('Carousel useEffect triggered, selectedId:', selectedId); // Debug log
    if (selectedId) {
      const index = listings.findIndex(l => l.id === selectedId);
      console.log('Found listing index:', index, 'current index:', currentIndex); // Debug log
      if (index !== -1 && index !== currentIndex) {
        console.log('Scrolling to index:', index); // Debug log
        setCurrentIndex(index);
        // Scroll to the selected item
        if (carouselRef.current) {
          const itemWidth = 320; // Width of each carousel item
          const scrollLeft = index * itemWidth;
          carouselRef.current.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedId, listings, currentIndex]);

  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = 320;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < listings.length) {
        setCurrentIndex(newIndex);
        // Only call onSelectListing if the user manually scrolled (not programmatically)
        const listingId = listings[newIndex]?.id;
        if (listingId && listingId !== selectedId) {
          onSelectListing(listingId);
        }
      }
    }
  }, [currentIndex, listings, selectedId, onSelectListing]);

  // Throttled scroll handler
  const throttledHandleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(handleScroll, 100);
  }, [handleScroll]);

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  if (!listings.length) return null;

  // console.log('MobileMapCarousel render - selectedId:', selectedId, 'listings count:', listings.length); // Debug log

  return (
    <div className="absolute bottom-4 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-10">
      {/* Carousel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="text-black text-xs font-semibold">
          {currentIndex + 1} of {listings.length}
        </div>
        <div className="flex items-center gap-1">
          {listings.slice(Math.max(0, currentIndex - 2), Math.min(listings.length, currentIndex + 3)).map((_, i) => {
            const actualIndex = Math.max(0, currentIndex - 2) + i;
            return (
              <div
                key={actualIndex}
                className={`w-1.5 h-1.5 rounded-full ${
                  actualIndex === currentIndex ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Carousel Content */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={throttledHandleScroll}
      >
        {listings.map((listing, index) => {
          const isSelected = listing.id === selectedId;
          const img = resolveAssetUrl(getFirstValidImage(listing.images), { listingId: listing.id, entityType: 'listing' });
          
          return (
            <Link
              href={`/listings/${listing.slug}`}
              key={listing.id}
              className={`flex-shrink-0 snap-start ${isSelected ? 'ring-2 ring-black rounded-lg' : ''}`}
              style={{ width: '320px' }}
              onClick={() => onSelectListing(listing.id)}
            >
              <div className={`mx-1 bg-white rounded-lg overflow-hidden shadow-sm border ${
                isSelected ? 'border-black border-2' : 'border-gray-200'
              }`}>
                {/* Image */}
                <div className="relative h-24 w-full">
                  <img
                    src={img}
                    alt={(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug}
                    className="w-full h-full object-cover"
                  />
                  {/* Save button */}
                  <button
                    className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add save functionality here
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-2.5 w-2.5 text-black">
                      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.434-7-10a4 4 0 0 1 7-2.646A4 4 0 0 1 19 11c0 5.566-7 10-7 10Z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-2">
                  {/* Price and Title Row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-black font-bold text-sm">
                      {listing.price} {listing.currency}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div className="text-black font-medium text-xs leading-tight mb-1 line-clamp-1">
                    {(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug}
                  </div>

                  {/* Location */}
                  <div className="text-black text-xs mb-1 flex items-center gap-1">
                    <PinIcon />
                    <span className="truncate text-xs">
                      {(listing.location as any)?.name?.[currentLanguage as any] || (listing.location as any)?.name?.en || ""}
                    </span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-2 text-black text-xs">
                    <span className="inline-flex items-center gap-0.5">
                      <BedIcon /> {listing.bedrooms ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <BathIcon /> {listing.bathrooms ?? 0}
                    </span>
                    {listing.size && (
                      <span className="text-xs">{listing.size}m²</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string | React.ReactNode | ""; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-white">
      {title ? <div className="text-gray-900 font-semibold mb-2">{title}</div> : null}
      {children}
    </div>
  );
}

function MobileSidebar({
  filters,
  setFilters,
  propertyTypes,
  listingTypes,
  priceBounds,
  sizeBounds,
  yearBounds,
  currencies,
  ppsmBounds,
  t,
  currentLanguage,
}: {
  filters: Record<string, any>;
  setFilters: (f: any) => void;
  propertyTypes: any[];
  listingTypes: any[];
  priceBounds: { min: number; max: number };
  sizeBounds: { min: number; max: number };
  yearBounds: { min: number; max: number };
  currencies: string[];
  ppsmBounds: { min: number; max: number };
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: string;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['propertyType', 'price']));
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sectionKeys = [
    "propertyType","listingType","minPrice","maxPrice","currency","sizeMin","sizeMax","floor","totalFloors",
    "yearBuiltMin","yearBuiltMax","bedrooms","beds","bathrooms","buildingType","buildingCondition",
    "heatingType","ownershipType","kitchens","livingRooms","parkingSpots","maintenanceFeeMax",
    "mortgagePossible","pricePerSqMMin","pricePerSqMMax","gardenSizeMin","gardenSizeMax",
    "terraceSizeMin","terraceSizeMax","airConditioning","furnished","elevator","balcony",
    "garage","pool","features","tags","hasParking","allowsPets","isFeatured","videoUrl",
    "virtualTourUrl","postalCode","address"
  ] as const;

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([k,v]) => (sectionKeys as readonly string[]).includes(k) && v !== undefined && v !== "" && v !== false).length;
  }, [filters]);

  const clearAll = () => {
    const cleared: Record<string, any> = {};
    for (const k of sectionKeys as readonly string[]) cleared[k] = undefined;
    setFilters({ ...filters, ...cleared });
  };

  const normalize = (items: any[], fallback: string[]) => {
    if (!items || !items.length) return fallback.map((v) => ({ value: v, label: t(`enums.propertyType.${v}`) || formatEnum(v) }));
    return items.map((it: any) => {
      const value = typeof it === "string" ? it : it.value ?? it.id ?? String(it);
      const label = typeof it === "string" ? (t(`enums.propertyType.${it}`) || formatEnum(it)) : it.label?.[currentLanguage] ?? it.label?.en ?? it.label ?? formatEnum(value);
      return { value, label };
    });
  };

  const ptOptions = normalize(propertyTypes, ["APARTMENT", "HOUSE", "VILLA", "STUDIO", "OFFICE", "COMMERCIAL", "PENTHOUSE", "DUPLEX", "LOFT", "LAND", "INDUSTRIAL"]);

  const CollapsibleSection = ({ title, sectionKey, children, filterCount }: { title: string; sectionKey: string; children: React.ReactNode; filterCount?: number }) => {
    const isExpanded = expandedSections.has(sectionKey);
    return (
      <div className="border border-gray-200 rounded-md bg-white">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-black font-semibold">{title}</span>
            {filterCount && filterCount > 0 && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                {filterCount}
              </span>
            )}
          </div>
          <svg 
            className={`w-4 h-4 transition-transform text-black ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="px-3 pb-3">
            {children}
          </div>
        )}
      </div>
    );
  };

  const getSectionFilterCount = (sectionKey: string) => {
    switch (sectionKey) {
      case 'propertyType':
        return filters.propertyType ? 1 : 0;
      case 'price':
        return (filters.minPrice || filters.maxPrice) ? 1 : 0;
      case 'rooms':
        return [filters.bedrooms, filters.bathrooms, filters.livingRooms, filters.kitchens].filter(Boolean).length;
      case 'size':
        return (filters.sizeMin || filters.sizeMax) ? 1 : 0;
      case 'amenities':
        return [filters.airConditioning, filters.furnished, filters.elevator, filters.balcony, filters.garage, filters.pool, filters.hasParking, filters.allowsPets].filter(Boolean).length;
      case 'building':
        return [filters.buildingType, filters.buildingCondition, filters.heatingType, filters.ownershipType, filters.yearBuiltMin, filters.yearBuiltMax].filter(Boolean).length;
      case 'financial':
        return [filters.pricePerSqMMin, filters.pricePerSqMMax, filters.maintenanceFeeMax, filters.mortgagePossible].filter(Boolean).length;
      case 'outdoor':
        return [filters.gardenSizeMin, filters.gardenSizeMax, filters.terraceSizeMin, filters.terraceSizeMax].filter(Boolean).length;
      default:
        return 0;
    }
  };

  return (
    <div className="p-3 max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-black font-bold text-lg">Filters</span>
          {activeCount > 0 && (
            <span className="bg-black text-white text-sm px-3 py-1 rounded-full font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-black hover:text-gray-600 underline underline-offset-2 text-sm font-medium flex-shrink-0">
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Property Type */}
        <CollapsibleSection title="Property Type" sectionKey="propertyType" filterCount={getSectionFilterCount('propertyType')}>
          <div className="grid grid-cols-2 gap-2">
            {ptOptions.map((pt) => {
              const active = filters.propertyType === pt.value;
              return (
                <button
                  key={pt.value}
                  onClick={() => setFilters({ ...filters, propertyType: active ? undefined : pt.value })}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                    active ? "bg-black text-white border-black" : "bg-white border-gray-300 text-black hover:bg-gray-50"
                  }`}
                >
                  <TypeIcon />
                  <span>{pt.label}</span>
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Price Range" sectionKey="price" filterCount={getSectionFilterCount('price')}>
          <div className="space-y-4">
            <FullWidthDualRange
              min={priceBounds.min}
              max={priceBounds.max}
              valueMin={(filters.minPrice as number) ?? priceBounds.min}
              valueMax={(filters.maxPrice as number) ?? priceBounds.max}
              onChange={(a, b) => setFilters({ ...filters, minPrice: a, maxPrice: b })}
              label="Price"
              unit="€"
            />
          </div>
        </CollapsibleSection>

        {/* Rooms & Beds */}
        <CollapsibleSection title="Rooms & Beds" sectionKey="rooms" filterCount={getSectionFilterCount('rooms')}>
          <div className="space-y-4">
            <div>
              <div className="text-black text-sm font-medium mb-2">Bedrooms</div>
              <BlackChips
                options={[1, 2, 3, 4, 5]}
                value={filters.bedrooms as number}
                onChange={(v) => setFilters({ ...filters, bedrooms: v })}
              />
            </div>
            <div>
              <div className="text-black text-sm font-medium mb-2">Bathrooms</div>
              <BlackChips
                options={[1, 2, 3, 4, 5]}
                value={filters.bathrooms as number}
                onChange={(v) => setFilters({ ...filters, bathrooms: v })}
              />
            </div>
            <div>
              <div className="text-black text-sm font-medium mb-2">Living Rooms</div>
              <BlackChips
                options={[1, 2, 3, 4]}
                value={filters.livingRooms as number}
                onChange={(v) => setFilters({ ...filters, livingRooms: v })}
              />
            </div>
            <div>
              <div className="text-black text-sm font-medium mb-2">Kitchens</div>
              <BlackChips
                options={[1, 2, 3]}
                value={filters.kitchens as number}
                onChange={(v) => setFilters({ ...filters, kitchens: v })}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Size */}
        <CollapsibleSection title="Size (m²)" sectionKey="size" filterCount={getSectionFilterCount('size')}>
          <FullWidthDualRange
            min={sizeBounds.min}
            max={sizeBounds.max}
            valueMin={(filters.sizeMin as number) ?? sizeBounds.min}
            valueMax={(filters.sizeMax as number) ?? sizeBounds.max}
            onChange={(a, b) => setFilters({ ...filters, sizeMin: a, sizeMax: b })}
            label="Size"
            unit="m²"
          />
        </CollapsibleSection>

        {/* Listing Type */}
        {normalize(listingTypes, []).length ? (
          <CollapsibleSection title="Listing Type" sectionKey="listingType" filterCount={filters.listingType ? 1 : 0}>
            <div className="flex flex-wrap gap-2">
              {normalize(listingTypes, []).map((lt) => {
                const active = filters.listingType === lt.value;
                return (
                  <button
                    key={lt.value}
                    onClick={() => setFilters({ ...filters, listingType: active ? undefined : lt.value })}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                      active ? "bg-black text-white border-black" : "border-gray-300 text-black hover:bg-gray-50"
                    }`}
                  >
                    {lt.label}
                  </button>
                );
              })}
            </div>
          </CollapsibleSection>
        ) : null}

        {/* Amenities & Features */}
        <CollapsibleSection title="Amenities & Features" sectionKey="amenities" filterCount={getSectionFilterCount('amenities')}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "airConditioning", label: "Air Conditioning" },
              { key: "furnished", label: "Furnished" },
              { key: "elevator", label: "Elevator" },
              { key: "balcony", label: "Balcony" },
              { key: "garage", label: "Garage" },
              { key: "pool", label: "Pool" },
              { key: "hasParking", label: "Parking" },
              { key: "allowsPets", label: "Pets Allowed" },
            ].map((a) => (
              <label key={a.key} className="inline-flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  checked={Boolean((filters as any)[a.key])}
                  onChange={(e) => setFilters({ ...filters, [a.key]: e.target.checked || undefined })}
                />
                <span className="text-sm font-medium">{a.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Building Details */}
        <CollapsibleSection title="Building Details" sectionKey="building" filterCount={getSectionFilterCount('building')}>
          <div className="space-y-4">
            <div>
              <label className="block text-black text-sm font-medium mb-2">Building Type</label>
              <select
                value={filters.buildingType || ""}
                onChange={(e) => setFilters({ ...filters, buildingType: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Any</option>
                <option value="PANEL">Panel</option>
                <option value="BRICK">Brick</option>
                <option value="NEW_BUILD">New Build</option>
                <option value="MONOLITHIC">Monolithic</option>
                <option value="WOOD">Wood</option>
                <option value="PREFAB">Prefab</option>
              </select>
            </div>
            
            <div>
              <label className="block text-black text-sm font-medium mb-2">Building Condition</label>
              <select
                value={filters.buildingCondition || ""}
                onChange={(e) => setFilters({ ...filters, buildingCondition: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Any</option>
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="RENOVATED">Renovated</option>
                <option value="NEEDS_RENOVATION">Needs Renovation</option>
              </select>
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">Heating Type</label>
              <select
                value={filters.heatingType || ""}
                onChange={(e) => setFilters({ ...filters, heatingType: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Any</option>
                <option value="NONE">None</option>
                <option value="CENTRAL">Central</option>
                <option value="ELECTRIC">Electric</option>
                <option value="GAS">Gas</option>
                <option value="WOOD">Wood</option>
                <option value="SOLAR">Solar</option>
                <option value="HEATPUMP">Heat Pump</option>
              </select>
            </div>

            <FullWidthDualRange
              min={yearBounds.min}
              max={yearBounds.max}
              valueMin={(filters.yearBuiltMin as number) ?? yearBounds.min}
              valueMax={(filters.yearBuiltMax as number) ?? yearBounds.max}
              onChange={(a, b) => setFilters({ ...filters, yearBuiltMin: a, yearBuiltMax: b })}
              label="Year Built"
              unit=""
            />
          </div>
        </CollapsibleSection>

        {/* Financial Details */}
        <CollapsibleSection title="Financial Details" sectionKey="financial" filterCount={getSectionFilterCount('financial')}>
          <div className="space-y-4">
            <FullWidthDualRange
              min={ppsmBounds.min}
              max={ppsmBounds.max}
              valueMin={(filters.pricePerSqMMin as number) ?? ppsmBounds.min}
              valueMax={(filters.pricePerSqMMax as number) ?? ppsmBounds.max}
              onChange={(a, b) => setFilters({ ...filters, pricePerSqMMin: a, pricePerSqMMax: b })}
              label="Price per m²"
              unit="€/m²"
            />
            
            <div>
              <label className="block text-black text-sm font-medium mb-2">Max Maintenance Fee</label>
              <input
                type="number"
                value={filters.maintenanceFeeMax || ""}
                onChange={(e) => setFilters({ ...filters, maintenanceFeeMax: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="€"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                checked={Boolean(filters.mortgagePossible)}
                onChange={(e) => setFilters({ ...filters, mortgagePossible: e.target.checked || undefined })}
              />
              <span className="text-sm font-medium">Mortgage Possible</span>
            </label>
          </div>
        </CollapsibleSection>

        {/* Outdoor Areas */}
        <CollapsibleSection title="Outdoor Areas" sectionKey="outdoor" filterCount={getSectionFilterCount('outdoor')}>
          <div className="space-y-4">
            <FullWidthDualRange
              min={0}
              max={1000}
              valueMin={(filters.gardenSizeMin as number) ?? 0}
              valueMax={(filters.gardenSizeMax as number) ?? 1000}
              onChange={(a, b) => setFilters({ ...filters, gardenSizeMin: a, gardenSizeMax: b })}
              label="Garden Size"
              unit="m²"
            />
            
            <FullWidthDualRange
              min={0}
              max={300}
              valueMin={(filters.terraceSizeMin as number) ?? 0}
              valueMax={(filters.terraceSizeMax as number) ?? 300}
              onChange={(a, b) => setFilters({ ...filters, terraceSizeMin: a, terraceSizeMax: b })}
              label="Terrace Size"
              unit="m²"
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function MobileMainList({
  listings,
  filters,
  setFilters,
  view,
  setView,
  selectedId,
  t,
  currentLanguage,
  allLocations = [],
}: {
  listings: Listing[];
  filters: Record<string, any>;
  setFilters: (f: any) => void;
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
  selectedId?: string | null;
  t: (key: string)=>string;
  currentLanguage: string;
  allLocations?: any[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);
  
  // Reset to page 1 when listings change
  useEffect(() => {
    setCurrentPage(1);
  }, [listings.length]);
  const locationNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of listings) {
      const id = (l as any).location?.id as string | undefined;
      const name = ((l as any).location?.name?.[currentLanguage as any]) || ((l as any).location?.name?.en) || undefined;
      if (id && name && !map[id]) map[id] = name;
    }
    for (const loc of (allLocations as any[])) {
      const id = String((loc as any)?.id || (loc as any)?.value || "");
      const name = (loc as any)?.name?.[currentLanguage as any] || (loc as any)?.name?.en || (loc as any)?.label?.[currentLanguage as any] || (loc as any)?.label?.en || (loc as any)?.slug;
      if (id && name && !map[id]) map[id] = name;
    }
    return map;
  }, [listings, allLocations, currentLanguage]);

  const chips = (() => {
    const items: { key: string; label: string; group?: string; value?: string }[] = [];
    for (const [k, v] of Object.entries(filters)) {
      if (v === undefined || v === "") continue;
      if (k === 'locationIds' && Array.isArray(v)) {
        for (const id of v as string[]) {
          const label = locationNameById[String(id)] || String(id);
          items.push({ key: `locationIds:${id}`, label, group: 'locationIds', value: String(id) });
        }
        continue;
      }
      if (k === 'locationId') {
        const label = locationNameById[String(v)] || String(v);
        items.push({ key: k, label });
        continue;
      }
      if (k === 'listingType') {
        const keyUp = String(v).toUpperCase();
        const maybe = t ? t(`enums.listingType.${keyUp}`) : undefined;
        const label = maybe && maybe !== `enums.listingType.${keyUp}` ? maybe : formatEnum(keyUp);
        items.push({ key: k, label });
        continue;
      }
      items.push({ key: k, label: `${humanize(k)}: ${String(v)}` });
    }
    return items;
  })();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        {/* Active Filters */}
        {chips.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    if (c.group === 'locationIds' && c.value) {
                      const cur = Array.isArray((filters as any).locationIds) ? [...(filters as any).locationIds] : [];
                      const next = cur.filter((id) => id !== c.value);
                      setFilters({ ...filters, locationIds: next.length ? next : undefined });
                    } else {
                      setFilters({ ...filters, [c.key]: undefined });
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 text-black rounded-full px-3 py-1 shadow-sm hover:bg-gray-50"
                >
                  <span className="text-xs">{c.label}</span>
                  <span aria-hidden>×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("list")}
            className={`rounded border px-2 py-1 text-sm ${
              view === "list" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-black hover:bg-gray-50"
            }`}
          >
            {t('search_map.list')}
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded border px-2 py-1 text-sm ${
              view === "grid" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-black hover:bg-gray-50"
            }`}
          >
            {t('search_map.grid')}
          </button>
        </div>
      </div>

      {/* Scrollable Listings Container */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="py-4">
          {view === "list" ? (
            <div className="space-y-4">
              {currentListings.map((l) => (
                <div key={l.id} className={`${selectedId === l.id ? "bg-gray-50 rounded-lg p-2" : ""}`}>
                  <ListingRow listing={l} highlighted={selectedId === l.id} strongHighlight={selectedId === l.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {currentListings.map((l) => (
                <div key={l.id}>
                  <ListingCard listing={l} highlighted={selectedId === l.id} strongHighlight={selectedId === l.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer - Fixed */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-black">
              {startIndex + 1}-{Math.min(endIndex, listings.length)} of {listings.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? 'bg-gray-100 text-black cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Prev
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                                          className={`px-2 py-1 rounded-md text-sm min-w-[32px] ${
                      currentPage === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-black cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainList({
  listings,
  filters,
  setFilters,
  view,
  setView,
  selectedId,
  t,
  currentLanguage,
  allLocations = [],
}: {
  listings: Listing[];
  filters: Record<string, any>;
  setFilters: (f: any) => void;
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
  selectedId?: string | null;
  t: (key: string)=>string;
  currentLanguage: string;
  allLocations?: any[];
}) {
  const locationNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of listings) {
      const id = (l as any).location?.id as string | undefined;
      const name = ((l as any).location?.name?.[currentLanguage as any]) || ((l as any).location?.name?.en) || undefined;
      if (id && name && !map[id]) map[id] = name;
    }
    // Also use preloaded locations from search to resolve names when there are zero listings
    for (const loc of (allLocations as any[])) {
      const id = String((loc as any)?.id || (loc as any)?.value || "");
      const name = (loc as any)?.name?.[currentLanguage as any] || (loc as any)?.name?.en || (loc as any)?.label?.[currentLanguage as any] || (loc as any)?.label?.en || (loc as any)?.slug;
      if (id && name && !map[id]) map[id] = name;
    }
    return map;
  }, [listings, allLocations, currentLanguage]);

  const chips = (() => {
    const items: { key: string; label: string; group?: string; value?: string }[] = [];
    for (const [k, v] of Object.entries(filters)) {
      if (v === undefined || v === "") continue;
      if (k === 'locationIds' && Array.isArray(v)) {
        for (const id of v as string[]) {
          const label = locationNameById[String(id)] || String(id);
          items.push({ key: `locationIds:${id}`, label, group: 'locationIds', value: String(id) });
        }
        continue;
      }
      if (k === 'locationId') {
        const label = locationNameById[String(v)] || String(v);
        items.push({ key: k, label });
        continue;
      }
      if (k === 'listingType') {
        const keyUp = String(v).toUpperCase();
        const maybe = t ? t(`enums.listingType.${keyUp}`) : undefined;
        const label = maybe && maybe !== `enums.listingType.${keyUp}` ? maybe : formatEnum(keyUp);
        items.push({ key: k, label });
        continue;
      }
      items.push({ key: k, label: `${humanize(k)}: ${String(v)}` });
    }
    return items;
  })();

  // Scroll selected listing into view
  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById(`listing-${selectedId}`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedId]);

  return (
    <section className="border-r border-gray-200 bg-white overflow-auto">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">
          {listings.length} {t('search_map.places')}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                if (c.group === 'locationIds' && c.value) {
                  const cur = Array.isArray((filters as any).locationIds) ? [...(filters as any).locationIds] : [];
                  const next = cur.filter((id) => id !== c.value);
                  setFilters({ ...filters, locationIds: next.length ? next : undefined });
                } else {
                  setFilters({ ...filters, [c.key]: undefined });
                }
              }}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-black rounded-full px-3 py-1 shadow-sm hover:bg-gray-50"
            >
              <span>{c.label}</span>
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setView("list")}
            className={`rounded border px-2 py-1 text-sm ${
              view === "list" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-black hover:bg-gray-50"
            }`}
          >
            {t('search_map.list')}
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded border px-2 py-1 text-sm ${
              view === "grid" ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-black hover:bg-gray-50"
            }`}
          >
            {t('search_map.grid')}
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ul className="divide-y divide-gray-200">
          {listings.map((l) => (
            <li id={`listing-${l.id}`} key={l.id} className={`p-4 ${selectedId === l.id ? "bg-gray-50" : ""}`}>
              <ListingRow listing={l} highlighted={selectedId === l.id} strongHighlight={selectedId === l.id} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((l) => (
            <div key={l.id} className="">
              <ListingCard listing={l} highlighted={selectedId === l.id} strongHighlight={selectedId === l.id} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ListingRow({ listing, highlighted, strongHighlight }: { listing: Listing; highlighted?: boolean; strongHighlight?: boolean }) {
  const { t, currentLanguage } = useLanguage();
  const img = resolveAssetUrl(getFirstValidImage(listing.images), { listingId: listing.id, entityType: 'listing' });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      setSaved(Array.isArray(cur) && cur.includes(listing.id));
    } catch {}
  }, [listing.id]);
  return (
    <Link href={`/listings/${listing.slug}`} className={`flex gap-3 p-2 ${highlighted ? "ring-1 ring-gray-300 rounded-md" : ""} ${strongHighlight ? "border border-gray-900 rounded-md" : ""}`}>
      <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
        <img src={img} alt={(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug} className="w-full h-full object-cover" />
        <button
          aria-label="Save"
          className={`absolute top-1 right-1 rounded-full p-1 ${saved ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white/90 text-gray-900 hover:bg-white'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const sofiaTime = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
            trackGuestFavorite(listing.id, sofiaTime);
            try {
              const key = 'guest_favorites';
              const cur = JSON.parse(localStorage.getItem(key) || '[]');
              if (!cur.includes(listing.id)) {
                cur.push(listing.id);
                localStorage.setItem(key, JSON.stringify(cur));
              }
            } catch {}
            setSaved(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" className="h-3 w-3">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.434-7-10a4 4 0 0 1 7-2.646A4 4 0 0 1 19 11c0 5.566-7 10-7 10Z" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-w-0">
        {/* Title and Price Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-gray-900 font-medium text-sm leading-tight flex-1 line-clamp-2">
            {(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-gray-900 font-semibold text-sm">{listing.price} {listing.currency}</div>
          </div>
        </div>
        
        {/* Location */}
                <div className="text-black text-xs mb-1 flex items-center gap-1">
          <PinIcon />
          <span className="truncate">{(listing.location as any)?.name?.[currentLanguage as any] || (listing.location as any)?.name?.en || ""}</span>
        </div>

        {/* Property Details */}
        <div className="text-black text-xs flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <BedIcon /> {listing.bedrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <BathIcon /> {listing.bathrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <GuestsIcon /> {listing.livingRooms ?? 0}
          </span>
          {listing.size && (
            <span className="text-black">
              {listing.size}m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ListingCard({ listing, highlighted, strongHighlight }: { listing: Listing; highlighted?: boolean; strongHighlight?: boolean }) {
  const { t, currentLanguage } = useLanguage();
  const img = resolveAssetUrl(getFirstValidImage(listing.images), { listingId: listing.id, entityType: 'listing' });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      setSaved(Array.isArray(cur) && cur.includes(listing.id));
    } catch {}
  }, [listing.id]);
  return (
    <Link href={`/listings/${listing.slug}`} className={`block border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden ${highlighted ? "ring-1 ring-gray-300" : ""} ${strongHighlight ? "border-gray-900" : ""}`}>
      <div className="relative h-32 w-full overflow-hidden">
        <img src={img} alt={(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug} className="w-full h-full object-cover" />
        <button
          aria-label="Save"
          className={`absolute top-1 right-1 rounded-full p-1 ${saved ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white/90 text-gray-900 hover:bg-white'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const sofiaTime = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
            trackGuestFavorite(listing.id, sofiaTime);
            try {
              const key = 'guest_favorites';
              const cur = JSON.parse(localStorage.getItem(key) || '[]');
              if (!cur.includes(listing.id)) {
                cur.push(listing.id);
                localStorage.setItem(key, JSON.stringify(cur));
              }
            } catch {}
            setSaved(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" className="h-3 w-3">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.434-7-10a4 4 0 0 1 7-2.646A4 4 0 0 1 19 11c0 5.566-7 10-7 10Z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-gray-900 font-medium text-sm leading-tight flex-1 line-clamp-2">
            {(listing.title as any)?.[currentLanguage as any] || (listing.title as any)?.en || listing.slug}
          </div>
          <div className="text-gray-900 font-semibold text-sm shrink-0">
            {listing.price} {listing.currency}
          </div>
        </div>
        
                {/* Location */}
        <div className="text-black text-xs mb-2 flex items-center gap-1">
          <PinIcon />
          <span className="truncate">{(listing.location as any)?.name?.[currentLanguage as any] || (listing.location as any)?.name?.en || ""}</span>
        </div>

        {/* Property Details */}
        <div className="text-black text-xs flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <BedIcon /> {listing.bedrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <BathIcon /> {listing.bathrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <GuestsIcon /> {listing.livingRooms ?? 0}
          </span>
          {listing.size && (
            <span className="text-black">
              {listing.size}m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function humanize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

// Small monochrome inline icons
function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.5-6-9a6 6 0 1 1 12 0c0 4.5-6 9-6 9Z" />
      <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 10h12a6 6 0 0 1 6 6v3H3v-9Zm0 0V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 13h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Zm4-6a3 3 0 0 1 6 0v6" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 1 0-8 0m-5 5a7 7 0 1 1 14 0H3Zm9-13a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
    </svg>
  );
}

function MapView({ listings, onSelectListing, selectedId, onSelectRegions, selectedRegionNames }: { listings: Listing[]; onSelectListing: (id: string) => void; selectedId: string | null; onSelectRegions?: (names: string[]) => void; selectedRegionNames?: string[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const selectedNamesRef = useRef<Set<string>>(new Set());

  const [coordsMap, setCoordsMap] = useState<Record<string, [number, number]>>({});

  // Debug: Check coordinate status
  useEffect(() => {
    const withCoords = listings.filter(l => l.latitude && l.longitude);
    const withoutCoords = listings.filter(l => !l.latitude || !l.longitude);
    
  }, [listings]);

  // Geocode listings without coordinates using Mapbox
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    const withoutCoords = listings.filter((l) => !l.longitude || !l.latitude);
    if (!withoutCoords.length) {
      
      return;
    }
    
    

    (async () => {
      const updates: Record<string, [number, number]> = {};
      
      // No coordinate restrictions - trust the geocoding with "Bulgaria" context

      for (const l of withoutCoords) {
        // Build better search query with location context
        const anyAddr: any = l.address as any;
        const address = typeof anyAddr === 'string' ? anyAddr : (anyAddr?.en || anyAddr?.bg || anyAddr?.ru);
        const locationName = (l as any).location?.name?.en || (l as any).location?.name?.bg || (l as any).location?.name?.ru;
        const title = (l as any).title?.en || (l as any).title?.bg || (l as any).title?.ru;
        
        // Construct query with Bulgaria context for better accuracy
        let q = '';
        if (address && locationName) {
          q = `${address}, ${locationName}, Bulgaria`;
        } else if (address) {
          q = `${address}, Bulgaria`;
        } else if (locationName) {
          // Be more specific for Bulgarian Black Sea coast towns
          if (locationName.toLowerCase().includes('nesebar') || locationName.toLowerCase().includes('несебър')) {
            q = 'Nesebar, Burgas Province, Bulgaria, Black Sea coast';
          } else if (locationName.toLowerCase().includes('sozopol') || locationName.toLowerCase().includes('созопол')) {
            q = 'Sozopol, Burgas Province, Bulgaria, Black Sea coast';
          } else if (locationName.toLowerCase().includes('ravda') || locationName.toLowerCase().includes('равда')) {
            q = 'Ravda, Burgas Province, Bulgaria, Black Sea coast';
          } else if (locationName.toLowerCase().includes('sveti vlas') || locationName.toLowerCase().includes('свети влас')) {
            q = 'Sveti Vlas, Burgas Province, Bulgaria, Black Sea coast';
          } else {
            q = `${locationName}, Bulgaria`;
          }
        } else if (title) {
          q = `${title}, Bulgaria`;
        } else {
          q = (l as any).slug + ', Bulgaria';
        }

        if (!q) continue;

        try {
          // Add country code and bias towards Bulgaria
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?` +
            `limit=5&country=bg&access_token=${MAPBOX_TOKEN}&proximity=23.3219,42.6977`
          );
          const data = await res.json();
          
          // Use the first/best result from Mapbox (already filtered by country=bg)
          const feat = data?.features?.[0];
          if (feat?.center) {
            const [lng, lat] = feat.center;
            updates[l.id] = [lng, lat];
            
          }
        } catch (error) {
          console.error(`Geocoding error for ${l.id}: ${q}`, error);
        }
      }
      
      if (Object.keys(updates).length) {
       
        setCoordsMap((prev) => ({ ...prev, ...updates }));
      }
    })();
  }, [listings]);

  const points = useMemo(() => {
    return listings
      .map((l) => {
        const lng = l.longitude ?? coordsMap[l.id]?.[0];
        const lat = l.latitude ?? coordsMap[l.id]?.[1];
        
        // Skip if no coordinates available
        if (lng == null || lat == null) return null;
        
       
        
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: { id: l.id, title: l.title?.en || l.slug, price: `${l.price} ${l.currency}` },
        } as any;
      })
      .filter(Boolean) as any[];
  }, [listings, coordsMap]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    if (!MAPBOX_TOKEN) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.3219, 42.6977],
      zoom: 10,
    });
    mapRef.current = map;
    map.on("load", () => {
      setLoaded(true);
      // Force classic flat map and reduce globe/3D feel
      try {
        // Ensure Mercator projection (disables globe/earth view)
        (map as any).setProjection?.("mercator");
      } catch {}
      try {
        // Remove atmospheric fog if present
        (map as any).setFog?.({});
      } catch {}
      try {
        // Disable rotation interactions for a simpler UX
        map.dragRotate.disable();
        (map as any).touchZoomRotate?.disableRotation?.();
      } catch {}

      // Add Bulgaria municipalities (ADM2) boundaries beneath markers
      try {
        const geoUrlAdm2 = resolveAssetUrl("/geo/Bulgaria_ADM2.geojson");
        if (!map.getSource("bg-adm2")) {
          map.addSource("bg-adm2", { type: "geojson", data: geoUrlAdm2 });
        }
        if (!map.getLayer("bg-adm2-fill")) {
          map.addLayer({
            id: "bg-adm2-fill",
            type: "fill",
            source: "bg-adm2",
            paint: {
              "fill-color": "#F3F4F6",
              "fill-opacity": 0.15,
            },
          });
        }
        if (!map.getLayer("bg-adm2-outline")) {
          map.addLayer({
            id: "bg-adm2-outline",
            type: "line",
            source: "bg-adm2",
            paint: {
              "line-color": "#9CA3AF",
              "line-width": 1,
            },
          });
        }
        // Hover region highlight (subtle fill)
        if (!map.getLayer("bg-adm2-hover")) {
          map.addLayer({
            id: "bg-adm2-hover",
            type: "fill",
            source: "bg-adm2",
            paint: {
              "fill-color": "#E5E7EB", // gray-200
              "fill-opacity": 0.35,
            },
            filter: ["==", ["get", "shapeName"], "__none__"],
          });
        }

        // Selected region highlight layer (stronger fill + outline)
        if (!map.getLayer("bg-adm2-selected")) {
          map.addLayer({
            id: "bg-adm2-selected",
            type: "fill",
            source: "bg-adm2",
            paint: {
              "fill-color": "#111827", // gray-900
              "fill-opacity": 0.22,
            },
            filter: ["==", ["get", "shapeName"], "__none__"],
          });
        }
        if (!map.getLayer("bg-adm2-selected-outline")) {
          map.addLayer({
            id: "bg-adm2-selected-outline",
            type: "line",
            source: "bg-adm2",
            paint: {
              "line-color": "#111827", // gray-900
              "line-width": 2,
            },
            filter: ["==", ["get", "shapeName"], "__none__"],
          });
        }
        // Pointer cursor on hover
        const enter = () => { (map.getCanvas().style as any).cursor = "pointer"; };
        const leave = () => { (map.getCanvas().style as any).cursor = ""; };
        map.on("mouseenter", "bg-adm2-fill", enter);
        map.on("mouseleave", "bg-adm2-fill", leave);
        // Move hover filter with mouse
        map.on("mousemove", "bg-adm2-fill", (e: any) => {
          const feat = e?.features?.[0];
          const hoverName = feat?.properties?.shapeName as string | undefined;
          try { map.setFilter("bg-adm2-hover", hoverName ? ["==", ["get", "shapeName"], hoverName] : ["==", ["get", "shapeName"], "__none__"]); } catch {}
        });
        map.on("mouseleave", "bg-adm2-fill", () => {
          try { map.setFilter("bg-adm2-hover", ["==", ["get", "shapeName"], "__none__"]); } catch {}
        });
        // Click to select region
        const onRegionClick = (e: any) => {
          const feat = e?.features?.[0];
          const name = feat?.properties?.shapeName as string | undefined;
          if (!name) return;
          const cur = new Set(Array.from(selectedNamesRef.current || new Set<string>()));
          if (cur.has(name)) cur.delete(name); else cur.add(name);
          onSelectRegions?.(Array.from(cur));
        };
        map.on("click", "bg-adm2-fill", onRegionClick);
        map.on("click", "bg-adm2-outline", onRegionClick);
        // Click map background to clear selection
        map.on("click", (e: any) => {
          // If click is not on the ADM2 fill layer or listing layers, clear selection
          const regionLayers = ["bg-adm2-fill", "bg-adm2-outline"];
          const listingLayers = ["listings-layer", "listings-circle"];
          const regionFeatures = map.queryRenderedFeatures(e.point, { layers: regionLayers });
          const listingFeatures = map.queryRenderedFeatures(e.point, { layers: listingLayers });
          
          // Only clear region selection if we didn't click on a region or listing
          if ((!regionFeatures || !regionFeatures.length) && (!listingFeatures || !listingFeatures.length)) {
            try { map.setFilter("bg-adm2-selected", ["==", ["get", "shapeName"], "__none__"]); } catch {}
            try { map.setFilter("bg-adm2-selected-outline", ["==", ["get", "shapeName"], "__none__"]); } catch {}
            onSelectRegions?.([]);
            selectedNamesRef.current = new Set();
          }
        });
      } catch {}
    });
    // Initial nationwide view over Bulgaria
    const bulgariaBounds: [[number, number], [number, number]] = [[22.35, 41.22], [28.72, 44.22]];
    map.fitBounds(bulgariaBounds, { padding: 40, duration: 0 });
  }, []);

  // Keep map selection in sync when parent changes selection (support multi-select)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const names = Array.isArray(selectedRegionNames) ? selectedRegionNames : [];
    selectedNamesRef.current = new Set(names);
    try {
      if (names.length) {
        map.setFilter("bg-adm2-selected", ["in", ["get", "shapeName"], ["literal", names]] as any);
        map.setFilter("bg-adm2-selected-outline", ["in", ["get", "shapeName"], ["literal", names]] as any);
      } else {
        map.setFilter("bg-adm2-selected", ["==", ["get", "shapeName"], "__none__"]);
        map.setFilter("bg-adm2-selected-outline", ["==", ["get", "shapeName"], "__none__"]);
      }
    } catch {}
  }, [selectedRegionNames, loaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const sourceId = "listings-src";
    const layerId = "listings-layer";
    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({ type: "FeatureCollection", features: points as any });
    } else {
      map.addSource(sourceId, { type: "geojson", data: { type: "FeatureCollection", features: points as any } });
      // Add a simple circle layer as a reliable fallback so points are always visible
      if (!map.getLayer("listings-circle")) {
        map.addLayer({
          id: "listings-circle",
          type: "circle",
          source: sourceId,
          paint: {
            // Use a dark gray to match the monochrome palette (approx Tailwind gray-900)
            "circle-color": "#111827",
            "circle-radius": 6,
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 1
          }
        });
      }
      if (!map.getLayer(layerId)) {
        // Create a custom black pin with a long tail and an "I" label
        const svg = encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='40' viewBox='0 0 24 40'>
            <defs>
              <filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'>
                <feDropShadow dx='0' dy='1' stdDeviation='1' flood-color='rgba(0,0,0,0.25)'/>
              </filter>
            </defs>
            <path d='M12 39L12 22' stroke='black' stroke-width='2' />
            <path d='M12 2a8 8 0 0 0-8 8c0 5.5 8 11 8 11s8-5.5 8-11a8 8 0 0 0-8-8z' fill='black' filter='url(#shadow)'/>
            <text x='12' y='12' text-anchor='middle' dominant-baseline='central' font-family='Arial' font-size='10' fill='white'>I</text>
          </svg>`
        );
        const url = `data:image/svg+xml;charset=utf-8,${svg}`;
        map.loadImage(url, (err, image) => {
          if (!err && image) {
            if (!map.hasImage("custom-pin")) map.addImage("custom-pin", image as any, { sdf: false });
            map.addLayer({
              id: layerId,
              type: "symbol",
              source: sourceId,
              layout: {
                "icon-image": "custom-pin",
                "icon-size": 1,
                // Ensure visibility even when features collide
                "icon-allow-overlap": true,
                "icon-ignore-placement": true
              },
            });
          } else {
            // Fallback to custom pin or create a simple circle marker
            if (map.hasImage("custom-pin")) {
              map.addLayer({
                id: layerId,
                type: "symbol",
                source: sourceId,
                layout: {
                  "icon-image": "custom-pin",
                  "icon-allow-overlap": true,
                  "icon-ignore-placement": true
                }
              });
            } else {
              // Create a simple circle marker as final fallback
              map.addLayer({
                id: layerId,
                type: "circle",
                source: sourceId,
                paint: {
                  "circle-radius": 6,
                  "circle-color": "#FF5733",
                  "circle-stroke-color": "#fff",
                  "circle-stroke-width": 2
                }
              });
            }
          }
        });
      }
      // Pulse ring below the pin layer
      if (!map.getLayer("listings-pulse")) {
        const pulseLayer = {
          id: "listings-pulse",
          type: "circle" as const,
          source: sourceId,
          filter: ["==", ["get", "id"], "__none__"],
          paint: {
            // light grey pulse
            "circle-color": "#D1D5DB",
            "circle-radius": 14,
            "circle-opacity": 0,
            "circle-blur": 0.8,
          },
        };
        // If the pin layer exists, insert below it; otherwise, just add now (symbol may load async)
        if (map.getLayer(layerId)) {
          map.addLayer(pulseLayer, layerId);
        } else {
          map.addLayer(pulseLayer);
        }
      }
    }
    // Fit bounds to markers
    if (points.length) {
      const b = new mapboxgl.LngLatBounds();
      points.forEach((p: any) => b.extend(p.geometry.coordinates as [number, number]));
      map.fitBounds(b, { padding: 60, maxZoom: 13, duration: 500 });
    }
    // Click handling for pins and circles
    const handleClick = (e: any) => {
      const feature: any = e.features?.[0];
      if (!feature) {
        console.log('No feature found in click event'); // Debug log
        return;
      }
      const id = feature.properties?.id as string | undefined;
      if (!id) {
        console.log('No ID found in feature properties'); // Debug log
        return;
      }
      const price = feature.properties?.price as string | undefined;
      console.log('Map dot clicked, selecting listing:', id, 'feature:', feature); // Debug log
      onSelectListing(id);
      try {
        const [lng, lat] = feature.geometry?.coordinates as [number, number];
        map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 13), essential: true });
        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: false, offset: 12, className: "price-popup" })
          .setLngLat([lng, lat])
          .setHTML(`<div style="background:#111827;color:#fff;border-radius:8px;padding:6px 10px;font-size:12px;line-height:1.2;box-shadow:none;border:none">${price ?? ""}</div>`)
          .addTo(map);
      } catch (error) {
        console.log('Error in map click handler:', error); // Debug log
      }
    };
    // Add click handlers directly - layers should exist by now
    let handlersAdded = false;
    
    const addClickHandlers = () => {
      if (handlersAdded) return; // Prevent duplicate handlers
      
      if (map.getLayer(layerId)) {
        map.on("click", layerId, handleClick);
        console.log('Click handler added for', layerId); // Debug log
      }
      if (map.getLayer("listings-circle")) {
        map.on("click", "listings-circle", handleClick);
        console.log('Click handler added for listings-circle'); // Debug log
      }
      
      handlersAdded = true;
    };

    // Add a general map click handler to test if clicks are working at all
    const testClickHandler = (e: any) => {
      console.log('General map click detected at:', e.lngLat); // Debug log
      // Query features at click point
      const features = map.queryRenderedFeatures(e.point, { layers: [layerId, 'listings-circle'] });
      if (features && features.length > 0) {
        console.log('Listing features found:', features.map((f: any) => ({ layer: f.layer?.id, id: f.properties?.id }))); // Debug log
        // Manually trigger the handler if features are found
        const feature = features[0];
        if (feature && feature.properties?.id) {
          console.log('Manually triggering listing selection:', feature.properties.id);
          onSelectListing(feature.properties.id);
        }
      }
    };
    map.on('click', testClickHandler);

    // Try to add handlers immediately
    addClickHandlers();

    return () => {
      map.off("click", layerId, handleClick);
      map.off("click", "listings-circle", handleClick);
      map.off('click', testClickHandler);
    };
  }, [points, loaded]);

  // Animate and toggle pulse for selected pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    const pulseId = "listings-pulse";
    if (map.getLayer(pulseId)) {
      if (selectedId) {
        map.setFilter(pulseId, ["==", ["get", "id"], selectedId]);
      } else {
        map.setFilter(pulseId, ["==", ["get", "id"], "__none__"]);
      }
    }
    let raf = 0;
    let start = performance.now();
    const animate = () => {
      if (!selectedId || !map.getLayer(pulseId)) return;
      const t = ((performance.now() - start) % 1200) / 1200; // 0..1 over 1.2s
      const radius = 14 + t * 20; // 14 -> 34
      const opacity = 0.45 * (1 - t);
      map.setPaintProperty(pulseId, "circle-radius", radius);
      map.setPaintProperty(pulseId, "circle-opacity", opacity);
      raf = requestAnimationFrame(animate);
    };
    if (selectedId) raf = requestAnimationFrame(animate);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [loaded, selectedId]);

  if (!MAPBOX_TOKEN) {
    return (
      <div ref={mapContainer} className="w-full h-full flex items-center justify-center">
        <div className="bg-white border border-gray-200 text-gray-700 rounded-md px-4 py-2 shadow-sm">
          Set NEXT_PUBLIC_MAPBOX_TOKEN in frontend/.env.local and restart the dev server.
        </div>
      </div>
    );
  }
  return <div ref={mapContainer} className="w-full h-full" />;
}

export default function SearchMapPageWrapper() {
  return (
    <>
      <style jsx global>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 8px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 8px;
        }

        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          border: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
        <SearchMapContent />
      </Suspense>
    </>
  );
}
