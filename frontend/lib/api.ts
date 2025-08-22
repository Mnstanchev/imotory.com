export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

export type Listing = {
  id: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  price: number;
  currency: string;
  slug: string;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  images?: string[];
  location?: { id: string; name: Record<string, string>; slug: string };
  agent?: { id: string; name: Record<string, string>; avatar?: string; phone?: string; email?: string };
  listingType?: string;
  propertyType?: string;
  latitude?: number;
  longitude?: number;
  livingRooms?: number;
  kitchens?: number;
  address?: string;
  postalCode?: string;
  features?: string[];
  airConditioning?: boolean;
  balcony?: boolean;
  buildingCondition?: string;
  buildingType?: string;
  elevator?: boolean;
  furnished?: boolean;
  garage?: boolean;
  gardenSize?: number;
  heatingType?: string;
  maintenanceFee?: number;
  mortgagePossible?: boolean;
  ownershipType?: string;
  parkingSpots?: number;
  pool?: boolean;
  pricePerSqM?: number;
  tags?: string[];
  terraceSize?: number;
  videoUrl?: string;
  virtualTourUrl?: string;
};

type ListingsEnvelope =
  | { success?: boolean; data?: { listings: Listing[]; pagination?: any } }
  | { listings: Listing[]; pagination?: any };

export async function getListings(params: Record<string, string | number | boolean | undefined> = {}) {
  const url = new URL(`${API_BASE}/listings`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  const json = (await res.json()) as ListingsEnvelope as any;
  const listings = (json?.data?.listings ?? json?.listings ?? []) as Listing[];
  return Array.isArray(listings) ? listings : [];
}

export function getFeaturedListings() {
  return getListings({ limit: 12 }).then((ls) => ls.filter((l) => l.isFeatured));
}

export function getLatestListings() {
  return getListings({ limit: 12 });
}

export function resolveAssetUrl(path?: string) {
  // Handle null, undefined, empty string, or whitespace-only strings
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return "/next.svg";
  }

  // Trim whitespace
  path = path.trim();

  // Handle absolute URLs (Vercel Blob, external URLs)
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // Handle data URLs (base64 fallbacks)
  if (path.startsWith('data:')) {
    return path;
  }

  // Handle local paths - construct full URL
  const baseApi = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";
  const origin = baseApi.replace(/\/?api\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

// Helper function to get the first valid image from an array
export function getFirstValidImage(images?: string[]): string | undefined {
  return images?.find(img => img && typeof img === 'string' && img.trim() !== '');
}

export async function getListing(id: string) {
  const res = await fetch(`${API_BASE}/listings/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listing");
  const json = await res.json();
  return json as Listing;
}

export async function getListingBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/listings/slug/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listing by slug");
  const json = await res.json();
  return json as Listing;
}

export async function logListingEvent(listingId: string, type: 'LISTING_CLICK' | 'AGENT_CONTACT_CLICK' | 'CONTACT_SUBMIT') {
  const res = await fetch(`${API_BASE}/listings/${listingId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
    // ensure the request is not canceled by navigation
    keepalive: true as any,
  });
  if (!res.ok) throw new Error('Failed to log event');
  return res.json();
}

export function beaconListingEvent(listingId: string, type: 'LISTING_CLICK' | 'AGENT_CONTACT_CLICK' | 'CONTACT_SUBMIT') {
  try {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const url = `${API_BASE}/listings/${listingId}`;
      const blob = new Blob([JSON.stringify({ type })], { type: 'application/json' });
      (navigator as any).sendBeacon(url, blob);
    } else {
      // fall back to keepalive fetch
      logListingEvent(listingId, type).catch(() => {});
    }
  } catch {}
}

export async function getListingTypes() {
  const res = await fetch(`${API_BASE}/listing-types`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listing types");
  const json = await res.json();
  return json.data?.listingTypes ?? [];
}

export async function getPropertyTypes() {
  const res = await fetch(`${API_BASE}/property-types`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch property types");
  const json = await res.json();
  return json.data?.propertyTypes ?? [];
}

export async function searchLocations(query: string) {
  const url = new URL(`${API_BASE}/locations`);
  if (query) url.searchParams.set("search", query);
  // fetch more suggestions for autocomplete
  url.searchParams.set("limit", "100");
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to search locations");
  const json = await res.json();
  return json.data?.locations ?? [];
}

export async function addFavorite(listingId: string) {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
}

export async function removeFavorite(listingId: string) {
  const url = new URL(`${API_BASE}/favorites`);
  url.searchParams.set("listingId", listingId);
  const res = await fetch(url.toString(), { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}

// Optional helper: explicitly log guest favorites to dedicated endpoint
export async function logGuestFavorite(listingId: string, sofiaTime: string) {
  await fetch(`${API_BASE}/favorites/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingId, sofiaTime }),
    // allow without credentials for guests
  }).catch(() => {});
}

export async function createBooking(payload: {
  listingId: string;
  visitType: 'VIEWING' | 'INSPECTION' | 'CONSULTATION';
  scheduledAt: string; // ISO
  duration: number; // minutes
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message?: string;
}) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}


