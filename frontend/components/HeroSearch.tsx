"use client";

import { useQuery } from "@tanstack/react-query";
import { getListings, getPropertyTypes, searchLocations, API_BASE } from "../lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSearch() {
  const { t, getLocalizedText, currentLanguage } = useLanguage();
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationFieldRef = useRef<HTMLLabelElement | null>(null);
  const [listingBubble, setListingBubble] = useState<"BUY" | "RENT" | "SELL" | "">("");
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [sendingSell, setSendingSell] = useState(false);
  const [sellSent, setSellSent] = useState(false);
  const [sellError, setSellError] = useState<string | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(locationQuery), 250);
    return () => clearTimeout(id);
  }, [locationQuery]);

  const { data: propertyTypes = [] } = useQuery({ queryKey: ["propertyTypes"], queryFn: getPropertyTypes });
  const { data: allLocations = [] } = useQuery({ queryKey: ["allLocations"], queryFn: () => searchLocations("") });
  const { data: locationResults = [] } = useQuery({
    queryKey: ["locations", debounced],
    queryFn: () => searchLocations(debounced),
    enabled: debounced.length > 1,
  });

  const [filters, setFilters] = useState({
    listingType: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    locationId: "",
    currency: "EUR",
    budgetRange: "",
    // Advanced
    bedrooms: "",
    beds: "",
    bathrooms: "",
    sizeMin: "",
    sizeMax: "",
    floor: "",
    totalFloors: "",
    yearBuiltMin: "",
    yearBuiltMax: "",
    garage: false as boolean | string,
    balcony: false as boolean | string,
    pool: false as boolean | string,
    elevator: false as boolean | string,
    furnished: false as boolean | string,
    airConditioning: false as boolean | string,
    buildingType: "",
    ownershipType: "",
    heatingType: "",
    kitchens: "",
    livingRooms: "",
    maintenanceFeeMax: "",
    mortgagePossible: false as boolean | string,
    parkingSpots: "",
    pricePerSqMMin: "",
    pricePerSqMMax: "",
    gardenSizeMin: "",
    gardenSizeMax: "",
    terraceSizeMin: "",
    terraceSizeMax: "",
    tags: "",
  });

  const cityOptions = useMemo(() => (Array.isArray(allLocations) ? allLocations.filter((l: any) => l.type === "CITY") : []), [allLocations]);
  const municipalityOptions = useMemo(
    () => (Array.isArray(allLocations) ? allLocations.filter((l: any) => l.type === "MUNICIPALITY") : []),
    [allLocations]
  );

  const { data: matched = [] } = useQuery({
    queryKey: ["homeSearchCount", filters],
    queryFn: () =>
      getListings(
        Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, typeof v === "boolean" ? (v ? "true" : "") : v])
        ) as any
      ),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "boolean") {
        if (v) params.append(k, "true");
      } else if (v) {
        params.append(k, String(v));
      }
    });
    router.push(`/search-map?${params.toString()}`);
  };

  // Close Advanced on Escape
  useEffect(() => {
    if (!showAdvanced) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAdvanced(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAdvanced]);

  // Close location dropdown on outside click
  useEffect(() => {
    if (!showLocationDropdown) return;
    const onOutside = (e: MouseEvent | TouchEvent) => {
      const el = locationFieldRef.current;
      if (el && !el.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [showLocationDropdown]);

  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-gray-900">
          {t('hero_search.title_before_of')} <span className="italic text-gray-500">{t('hero_search.title_of')}</span>
          <br /> {t('hero_search.title_after_of')}
        </h1>
        <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
          {t('hero_search.subtitle')}
        </p>
        
      </div>
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-6xl relative z-10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.2fr_1.2fr_auto] items-end gap-3"
      >
        <label ref={locationFieldRef} className="block relative">
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setListingBubble("BUY");
                setFilters((f) => ({ ...f, listingType: "SALE" }));
              }}
              className={`${listingBubble === "BUY" ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"} h-7 px-3 rounded-full text-xs cursor-pointer`}
            >
              {t('hero_search.buy')}
            </button>
            <button
              type="button"
              onClick={() => {
                setListingBubble("RENT");
                setFilters((f) => ({ ...f, listingType: "RENT" }));
              }}
              className={`${listingBubble === "RENT" ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"} h-7 px-3 rounded-full text-xs cursor-pointer`}
            >
              {t('hero_search.rent')}
            </button>
            <button
              type="button"
              onClick={() => {
                setListingBubble("SELL");
                // Keep SALE as default filter for convenience, but open the sell modal
                setFilters((f) => ({ ...f, listingType: "SALE" }));
                setShowSellModal(true);
              }}
              className={`${listingBubble === "SELL" ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"} h-7 px-3 rounded-full text-xs cursor-pointer`}
            >
              {t('hero_search.sell')}
            </button>
          </div>
          
          <input
            className="mt-1 h-11 bg-gray-50 border border-gray-200 rounded-md px-3 text-gray-900 w-full placeholder:text-gray-500"
            placeholder={t('hero_search.location_placeholder')}
            value={locationQuery}
            onChange={(e) => {
              const val = e.target.value;
              setLocationQuery(val);
              setShowLocationDropdown(val.length > 1);
            }}
            onFocus={(e) => {
              setDebounced(e.currentTarget.value);
              setShowLocationDropdown(e.currentTarget.value.length > 1);
            }}
            onBlur={() => {
              // close when input loses focus (selection uses onMouseDown to avoid blur)
              setShowLocationDropdown(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowLocationDropdown(false);
            }}
          />
          {showLocationDropdown && Array.isArray(locationResults) && locationResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-md rounded-md max-h-64 overflow-auto z-20">
              {locationResults.map((loc: any) => {
                const name = getLocalizedText(loc?.name) || loc?.label || loc?.slug || "";
                const typeUpper = String(loc?.type || '').toUpperCase();
                return (
                  <button
                    type="button"
                    key={loc.id || name}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-between cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setFilters((f) => ({ ...f, locationId: String(loc.id || loc.value || "") }));
                      setLocationQuery(name);
                      setDebounced("");
                      setShowLocationDropdown(false);
                    }}
                  >
                    <span>{name}</span>
                    {typeUpper ? <span className="text-gray-500 text-xs uppercase">{t(`location_types.${typeUpper}`)}</span> : null}
                  </button>
                );
              })}
            </div>
          )}
        </label>

        <label className="block">
          <span className="block text-xs text-gray-600">{t('hero_search.type_label')}</span>
          <select
            className="mt-1 h-11 bg-gray-50 border border-gray-200 rounded-md px-3 text-gray-900 w-full"
            value={filters.propertyType}
            onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value }))}
          >
            <option value="">{t('search_map.any')}</option>
            {Array.isArray(propertyTypes) &&
              propertyTypes.map((pt: any) => {
                const optionKey = pt.value || pt.id;
                const localizedName = pt?.name?.[currentLanguage] || pt?.label?.[currentLanguage] || pt?.name?.en || pt?.label?.en || t(`enums.propertyType.${optionKey}`);
                return (
                  <option key={optionKey} value={optionKey}>
                    {localizedName}
                  </option>
                );
              })}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs text-gray-600">{t('hero_search.style_label')}</span>
          <select
            className="mt-1 h-11 bg-gray-50 border border-gray-200 rounded-md px-3 text-gray-900 w-full"
            value={String(filters.buildingType || "")}
            onChange={(e) => setFilters((f) => ({ ...f, buildingType: e.target.value }))}
          >
            <option value="">{t('search_map.any')}</option>
            {['PANEL','BRICK','NEW_BUILD','MONOLITHIC','WOOD','PREFAB'].map((o) => (
              <option key={o} value={o}>{t(`enums.buildingType.${o}`)}</option>
            ))}
          </select>
        </label>

        <div>
          <span className="block text-xs text-gray-600">{t('hero_search.budget_range')}</span>
          <PriceInputs
            min={Number(filters.minPrice) || 0}
            max={Number(filters.maxPrice) || 0}
            currency={filters.currency}
            onChange={(min, max) => setFilters((f) => ({ ...f, minPrice: String(min), maxPrice: String(max) }))}
          />
        </div>

        

        <div className="md:col-start-5">
          <span className="block text-xs text-gray-600">{t('search_map.size_sqm')}</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              className="h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-gray-900"
              placeholder="Min"
              inputMode="numeric"
              value={String(filters.sizeMin || "")}
              onChange={(e) => setFilters((f) => ({ ...f, sizeMin: e.target.value }))}
            />
            <input
              className="h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-gray-900"
              placeholder="Max"
              inputMode="numeric"
              value={String(filters.sizeMax || "")}
              onChange={(e) => setFilters((f) => ({ ...f, sizeMax: e.target.value }))}
            />
          </div>
        </div>

        <div className="md:col-start-6 flex items-center gap-3">
          <button type="submit" className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 h-10 inline-flex items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><circle cx="11" cy="11" r="7" strokeWidth={1.5}/><path d="M21 21l-3.6-3.6" strokeWidth={1.5}/></svg>
            {t('hero_search.search_property')}
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            aria-expanded={showAdvanced}
            className="bg-white text-gray-700 hover:text-gray-900 h-10 inline-flex items-center justify-center gap-2 underline-offset-2 hover:underline text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
              <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h8" />
            </svg>
            {t('hero_search.advanced')}
          </button>
        </div>

      </form>

      {showAdvanced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setShowAdvanced(false)} />
          <div role="dialog" aria-modal="true" className="relative bg-white border border-gray-200 shadow-xl rounded-md w-[90vw] max-w-5xl max-h-[80vh] overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-900 font-semibold">{t('hero_search.advanced_filters')}</div>
              <button onClick={() => setShowAdvanced(false)} className="text-gray-700 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <NumberField label={t('hero_search.bedrooms')} value={filters.bedrooms} onChange={(v) => setFilters((f) => ({ ...f, bedrooms: v }))} />
            <NumberField label={t('hero_search.beds')} value={filters.beds} onChange={(v) => setFilters((f) => ({ ...f, beds: v }))} />
            <NumberField label={t('hero_search.bathrooms')} value={filters.bathrooms} onChange={(v) => setFilters((f) => ({ ...f, bathrooms: v }))} />
            <NumberRange label={t('search_map.size_sqm')} minValue={filters.sizeMin} maxValue={filters.sizeMax} onMinChange={(v) => setFilters((f) => ({ ...f, sizeMin: v }))} onMaxChange={(v) => setFilters((f) => ({ ...f, sizeMax: v }))} />

            <NumberField label={t('hero_search.floor_min')} value={filters.floor} onChange={(v) => setFilters((f) => ({ ...f, floor: v }))} />
            <NumberField label={t('hero_search.total_floors_min')} value={filters.totalFloors} onChange={(v) => setFilters((f) => ({ ...f, totalFloors: v }))} />
            <NumberRange label={t('hero_search.year_built') } minValue={filters.yearBuiltMin} maxValue={filters.yearBuiltMax} onMinChange={(v) => setFilters((f) => ({ ...f, yearBuiltMin: v }))} onMaxChange={(v) => setFilters((f) => ({ ...f, yearBuiltMax: v }))} />
            <SelectField label={t('search_map.building_type')} enumKey="buildingType" value={String(filters.buildingType || "")} onChange={(v) => setFilters((f) => ({ ...f, buildingType: v }))} options={["PANEL", "BRICK", "NEW_BUILD", "MONOLITHIC", "WOOD", "PREFAB"]} />

            <SelectField label={t('search_map.ownership_type')} enumKey="ownershipType" value={String(filters.ownershipType || "")} onChange={(v) => setFilters((f) => ({ ...f, ownershipType: v }))} options={["FREEHOLD", "LEASEHOLD", "COOPERATIVE"]} />
            <SelectField label={t('search_map.heating_type')} enumKey="heatingType" value={String(filters.heatingType || "")} onChange={(v) => setFilters((f) => ({ ...f, heatingType: v }))} options={["NONE", "CENTRAL", "ELECTRIC", "GAS", "WOOD", "SOLAR", "HEATPUMP"]} />
            <NumberField label={t('hero_search.kitchens_min')} value={filters.kitchens} onChange={(v) => setFilters((f) => ({ ...f, kitchens: v }))} />
            <NumberField label={t('hero_search.living_rooms_min')} value={filters.livingRooms} onChange={(v) => setFilters((f) => ({ ...f, livingRooms: v }))} />

            <NumberField label={t('hero_search.maintenance_fee_max')} value={filters.maintenanceFeeMax} onChange={(v) => setFilters((f) => ({ ...f, maintenanceFeeMax: v }))} />
            <NumberField label={t('hero_search.parking_spots_min')} value={filters.parkingSpots} onChange={(v) => setFilters((f) => ({ ...f, parkingSpots: v }))} />
            <NumberRange label={t('search_map.price_per_sqm')} minValue={filters.pricePerSqMMin} maxValue={filters.pricePerSqMMax} onMinChange={(v) => setFilters((f) => ({ ...f, pricePerSqMMin: v }))} onMaxChange={(v) => setFilters((f) => ({ ...f, pricePerSqMMax: v }))} />
            <NumberRange label={t('search_map.garden_size')} minValue={filters.gardenSizeMin} maxValue={filters.gardenSizeMax} onMinChange={(v) => setFilters((f) => ({ ...f, gardenSizeMin: v }))} onMaxChange={(v) => setFilters((f) => ({ ...f, gardenSizeMax: v }))} />

            <NumberRange label={t('search_map.terrace_size')} minValue={filters.terraceSizeMin} maxValue={filters.terraceSizeMax} onMinChange={(v) => setFilters((f) => ({ ...f, terraceSizeMin: v }))} onMaxChange={(v) => setFilters((f) => ({ ...f, terraceSizeMax: v }))} />
            <CheckboxField label={t('hero_search.garage')} checked={!!filters.garage} onChange={(v) => setFilters((f) => ({ ...f, garage: v }))} />
            <CheckboxField label={t('listing.balcony')} checked={!!filters.balcony} onChange={(v) => setFilters((f) => ({ ...f, balcony: v }))} />
            <CheckboxField label={t('hero_search.pool')} checked={!!filters.pool} onChange={(v) => setFilters((f) => ({ ...f, pool: v }))} />

            <CheckboxField label={t('hero_search.elevator')} checked={!!filters.elevator} onChange={(v) => setFilters((f) => ({ ...f, elevator: v }))} />
            <CheckboxField label={t('hero_search.furnished')} checked={!!filters.furnished} onChange={(v) => setFilters((f) => ({ ...f, furnished: v }))} />
            <CheckboxField label={t('listing.air_conditioning')} checked={!!filters.airConditioning} onChange={(v) => setFilters((f) => ({ ...f, airConditioning: v }))} />
            <CheckboxField label={t('listing.mortgage_possible')} checked={!!filters.mortgagePossible} onChange={(v) => setFilters((f) => ({ ...f, mortgagePossible: v }))} />

            <div className="md:col-span-4">
              <label className="block text-sm text-gray-700">{t('listing.tags')}</label>
              <input
                className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-700"
                placeholder={t('hero_search.tags_placeholder')}
                value={String(filters.tags || "")}
                onChange={(e) => setFilters((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f,
                  bedrooms: "", beds: "", bathrooms: "", sizeMin: "", sizeMax: "",
                  floor: "", totalFloors: "", yearBuiltMin: "", yearBuiltMax: "",
                  garage: false, balcony: false, pool: false, elevator: false, furnished: false, airConditioning: false,
                  buildingType: "", ownershipType: "", heatingType: "", kitchens: "", livingRooms: "",
                  maintenanceFeeMax: "", mortgagePossible: false, parkingSpots: "",
                  pricePerSqMMin: "", pricePerSqMMax: "", gardenSizeMin: "", gardenSizeMax: "",
                  terraceSizeMin: "", terraceSizeMax: "", tags: ""
                }))}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 rounded px-4 py-2"
              >
                {t('hero_search.clear_advanced')}
              </button>
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="bg-gray-900 text-white hover:bg-gray-800 rounded px-4 py-2"
              >
                {t('hero_search.done')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setShowSellModal(false)} />
          <div role="dialog" aria-modal="true" className="relative bg-white border border-gray-200 shadow-xl rounded-md w-[90vw] max-w-lg max-h-[80vh] overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-900 font-semibold">{t('hero_search.sell')}</div>
              <button onClick={() => setShowSellModal(false)} className="text-gray-700 hover:text-gray-900" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSendingSell(true);
                setSellError(null);
                try {
                  if (sellerName.trim().length < 2) throw new Error(t('contact_form.validations.full_name'));
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerEmail)) throw new Error(t('contact_form.validations.email'));
                  if (sellerMessage.trim().length < 10) throw new Error(t('contact_form.validations.message'));

                  const res = await fetch(`${API_BASE}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: sellerName,
                      email: sellerEmail,
                      phone: sellerPhone || undefined,
                      subject: 'Sell Property Request',
                      message: sellerMessage,
                    }),
                  });
                  if (!res.ok) {
                    let detail = t('contact_form.validations.failed');
                    try { const j = await res.json(); detail = j?.message || j?.error || detail; } catch {}
                    throw new Error(detail);
                  }
                  setSellSent(true);
                  setSellerName("");
                  setSellerEmail("");
                  setSellerPhone("");
                  setSellerMessage("");
                } catch (err: any) {
                  setSellError(err?.message || t('contact_form.error_generic'));
                } finally {
                  setSendingSell(false);
                }
              }}
              className="grid gap-3"
            >
              {sellSent ? (
                <div className="border border-gray-200 bg-gray-50 text-gray-900 rounded-md px-3 py-2">{t('inquiry.thank_you')}</div>
              ) : null}

              <label className="block">
                <span className="text-sm text-gray-700">{t('contact_form.full_name')}</span>
                <input
                  className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-900"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">{t('contact_form.email')}</span>
                <input
                  type="email"
                  className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-900"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">{t('contact_form.phone')}</span>
                <input
                  className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-900"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">{t('contact_form.message')}</span>
                <textarea
                  className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-900"
                  rows={5}
                  value={sellerMessage}
                  onChange={(e) => setSellerMessage(e.target.value)}
                  required
                />
              </label>

              {sellError ? <div className="text-sm text-red-600">{sellError}</div> : null}

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowSellModal(false)} className="border border-gray-200 hover:bg-gray-50 text-gray-700 rounded px-4 py-2">
                  {t('agent_card.cancel')}
                </button>
                <button disabled={sendingSell} className="bg-gray-900 text-white hover:bg-gray-800 rounded px-4 py-2">
                  {sendingSell ? t('inquiry.sending') : t('contact_form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="hidden md:block mx-auto max-w-8xl md:-mt-31 px-2">
        <div className="relative w-full h-[560px] rounded-xl overflow-hidden bg-gray-100 z-0">
          <Image src="/Home2.webp" alt="Modern minimalist home exterior" fill priority className="object-cover" />
        </div>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: string | number | undefined; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-700"
        inputMode="numeric"
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function NumberRange({ label, minValue, maxValue, onMinChange, onMaxChange }: { label: string; minValue: string | number | undefined; maxValue: string | number | undefined; onMinChange: (v: string) => void; onMaxChange: (v: string) => void }) {
  return (
    <div>
      <span className="block text-sm text-gray-700">{label}</span>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <input className="border border-gray-200 rounded px-3 py-2 text-gray-700" placeholder="Min" inputMode="numeric" value={String(minValue || "")} onChange={(e) => onMinChange(e.target.value)} />
        <input className="border border-gray-200 rounded px-3 py-2 text-gray-700" placeholder="Max" inputMode="numeric" value={String(maxValue || "")} onChange={(e) => onMaxChange(e.target.value)} />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, enumKey }: { label: string; value: string; onChange: (v: string) => void; options: string[]; enumKey?: 'buildingType' | 'ownershipType' | 'heatingType' }) {
  const { t } = useLanguage();
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <select className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-gray-700 bg-white" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t('search_map.any')}</option>
        {options.map((o) => (
          <option key={o} value={o}>{t(enumKey ? `enums.${enumKey}.${o}` : o.replace(/_/g, ' '))}</option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-gray-700">
      <input type="checkbox" className="h-4 w-4 border border-gray-300 rounded" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function PriceInputs({ min, max, currency, onChange }: { min: number; max: number; currency: string; onChange: (min: number, max: number) => void }) {
  const { t } = useLanguage();
  const fmt = (v: number | string) => {
    const n = Number(v || 0);
    return isNaN(n) ? "" : n.toString();
  };
  const symbol = currency === "USD" ? "$" : currency === "BGN" ? "лв" : "€";
  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="relative">
        <input
          className="h-10 w-32 border border-gray-200 rounded-md pl-16 pr-3 text-gray-900 bg-gray-50 placeholder:text-gray-500"
          placeholder="0"
          inputMode="numeric"
          value={fmt(min)}
          onChange={(e) => onChange(Number(e.target.value || 0), max)}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">{symbol} {t('hero_search.from')}</span>
      </div>
      <div className="relative">
        <input
          className="h-10 w-32 border border-gray-200 rounded-md pl-16 pr-3 text-gray-900 bg-gray-50 placeholder:text-gray-500"
          placeholder="0"
          inputMode="numeric"
          value={fmt(max)}
          onChange={(e) => onChange(min, Number(e.target.value || 0))}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">{symbol} {t('hero_search.to')}</span>
      </div>
    </div>
  );
}


