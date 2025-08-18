"use client";

import { useLanguage } from "@/contexts/language-context";

export default function ListingHeader({
  title,
  location,
  rating,
  price,
  currency,
}: {
  title: any;
  location?: any;
  rating?: number;
  price: number;
  currency: string;
}) {
  const { currentLanguage } = useLanguage();
  const titleText = typeof title === 'string' ? title : (title?.[currentLanguage] || title?.en || title?.bg || title?.ru || '');
  const locationText = typeof location === 'string' ? location : (location?.[currentLanguage] || location?.en || location?.bg || location?.ru || '');
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">{titleText}</h1>
        <div className="mt-2 flex items-center gap-4 text-gray-700">
          {locationText && (
            <span className="inline-flex items-center gap-1">
              <PinIcon /> {locationText}
            </span>
          )}
          {typeof rating === "number" && (
            <span className="inline-flex items-center gap-1">
              <StarIcon /> {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-semibold text-gray-900">
          {price}
          <span className="ml-1 align-middle text-base text-gray-600">{currency}</span>
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.5-6-9a6 6 0 1 1 12 0c0 4.5-6 9-6 9Z" />
      <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-900">
      <path d="M12 .587l3.668 7.571L24 9.748l-6 5.847 1.417 8.26L12 19.771 4.583 23.855 6 15.595 0 9.748l8.332-1.59z" />
    </svg>
  );
}


