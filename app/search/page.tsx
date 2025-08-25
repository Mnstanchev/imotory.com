import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('search', 'bg');
}

"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getListings } from "../../lib/api";
import ListingCard from "../../components/ListingCard";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

function SearchContent() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const queryParams: Record<string, string> = {};
  params.forEach((v, k) => (queryParams[k] = v));

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["search", queryParams],
    queryFn: () => getListings(queryParams),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('hero.search')}</h1>
      {isLoading ? (
        <div className="text-gray-700">{t('home.loading')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l as any} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8"><div className="text-gray-700">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}

