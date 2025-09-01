"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite, type Listing, resolveAssetUrl, getFirstValidImage } from "../lib/api";
import { trackListingClick, trackGuestFavorite } from "../lib/analytics";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      className={`h-5 w-5 ${filled ? "text-white" : "text-gray-900"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h12a6 6 0 0 1 6 6v3H3v-9Zm0 0V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Zm4-6a3 3 0 0 1 6 0v6" />
    </svg>
  );
}

function SquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" strokeWidth={1.5} />
    </svg>
  );
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { getLocalizedText } = useLanguage();
  const [isFav, setIsFav] = useState(false);

  const addMut = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await addFavorite(id);
      } catch (e: any) {
        // If unauthorized, log guest favorite with Sofia time and mark local state
        if (e && typeof e.message === 'string' && e.message.toLowerCase().includes('failed to add favorite')) {
          const sofiaTime = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
          trackGuestFavorite(id, sofiaTime);
          // persist locally so heart stays filled for guest during session
          try {
            const key = 'guest_favorites';
            const current = JSON.parse(localStorage.getItem(key) || '[]');
            if (!current.includes(id)) {
              current.push(id);
              localStorage.setItem(key, JSON.stringify(current));
            }
          } catch {}
          return { guest: true } as any;
        }
        throw e;
      }
    },
    onMutate: () => setIsFav(true),
    onError: () => setIsFav(false),
  });
  const remMut = useMutation({
    mutationFn: (id: string) => removeFavorite(id),
    onMutate: () => setIsFav(false),
    onError: () => {
      // keep UI as not-favorited if removal failed (guest case)
    },
  });

  const cover = resolveAssetUrl(getFirstValidImage(listing.images), { listingId: listing.id, entityType: 'listing' });

  const qc = useQueryClient();

  // Initialize guest favorite state from local storage
  useEffect(() => {
    try {
      const key = 'guest_favorites';
      const cur = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(cur) && cur.includes(listing.id)) {
        setIsFav(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);
  const clickMut = useMutation({
    mutationFn: () => {
      trackListingClick(listing.id);
      return Promise.resolve({});
    },
    onMutate: async () => {
      // Optimistically bump a lightweight cache key for admin insight if open
      qc.setQueryData(['analytics-preview'], (old: any) => ({
        ...(old || {}),
        listingClicks: ((old?.listingClicks ?? 0) + 1),
      }));
    },
  });

  return (
    <Link href={`/listings/${listing.slug}`} onMouseDown={() => clickMut.mutate()} className="block border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden">
      <div className="relative">
        <img src={cover} alt={getLocalizedText(listing.title) || listing.slug} className="h-48 w-full object-cover" />
        <button
          aria-label="Toggle favorite"
          className={`absolute top-2 right-2 rounded-full p-2 border ${
            isFav ? "bg-gray-900 text-white hover:bg-gray-800" : "border-gray-200 bg-white text-gray-900"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isFav) {
              // remove from server if logged in; always clear local marker
              remMut.mutate(listing.id);
              try {
                const key = 'guest_favorites';
                const cur = JSON.parse(localStorage.getItem(key) || '[]');
                const next = Array.isArray(cur) ? cur.filter((x: string) => x !== listing.id) : [];
                localStorage.setItem(key, JSON.stringify(next));
              } catch {}
            } else {
              addMut.mutate(listing.id);
            }
          }}
        >
          <HeartIcon filled={isFav} />
        </button>
        {getLocalizedText(listing.location?.name) && (
          <div className="absolute bottom-2 left-2 bg-white/90 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 flex items-center gap-1">
            <PinIcon />
            <span>{getLocalizedText(listing.location?.name)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-gray-900 font-semibold mb-2 truncate" title={getLocalizedText(listing.title) || listing.slug}>
          {getLocalizedText(listing.title) || listing.slug}
        </div>
        <div className="flex items-center gap-6 text-gray-700 text-sm">
          <div className="flex items-center gap-1">
            <BedIcon />
            <span>{listing.bedrooms ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <BathIcon />
            <span>{listing.bathrooms ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <SquareIcon />
            <span>{listing.size ?? 0} m²</span>
          </div>
        </div>

        <div className="my-4 border-t border-gray-200" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={resolveAssetUrl(listing.agent?.avatar)}
              alt={listing.agent?.name?.en || "Agent"}
              className="h-8 w-8 rounded-full border border-gray-200 object-cover"
            />
            <span className="text-gray-700 text-sm">{listing.agent?.name?.en || "Agent"}</span>
          </div>
          <div className="text-gray-900 font-bold text-lg">
            {listing.price} {listing.currency}
          </div>
        </div>
      </div>
    </Link>
  );
}


