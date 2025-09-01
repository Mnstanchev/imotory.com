"use client";

import Link from "next/link";
import { type Listing, resolveAssetUrl, getFirstValidImage } from "@/lib/api";
import { Bath, Bed, Ruler, ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function LatestListings({ listings }: { listings: Listing[] }) {
  const { t, getLocalizedText } = useLanguage();
  const items = (listings || []).slice(0, 6);
  if (!items.length) return null;
  const banner = (lt?: string) => {
    const v = String(lt || "").toUpperCase();
    if (v.includes("RENT")) return t('contact_form.rent');
    if (v.includes("SALE") || v.includes("BUY")) return t('contact_form.buy');
    return v ? v : t('contact_form.buy');
  };
  return (
    <section className="mt-10">
      <div className="mb-6 text-center">
        <div className="inline-block rounded-full bg-gray-100 text-gray-700 text-xs px-3 py-1 mb-2">{t('home.latest')}</div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('nav.explore')}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((l) => (
          <Link key={l.id} href={`/listings/${l.slug}`} className="block border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="relative h-40 w-full overflow-hidden">
              {/* image */}
              <img src={resolveAssetUrl(getFirstValidImage(l.images), { listingId: l.id, entityType: 'listing' })} alt={getLocalizedText(l.title) || l.slug} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 rounded-full bg-white/90 border border-gray-200 px-2 py-0.5 text-xs text-gray-900">
                {banner(l.listingType)}
              </div>
            </div>
            <div className="p-3 space-y-1">
              <div className="text-gray-900 font-semibold">{l.price} {l.currency}</div>
              <div className="text-gray-900 font-medium truncate" title={getLocalizedText(l.title) || l.slug}>
                {getLocalizedText(l.title) || l.slug}
              </div>
              <div className="text-gray-600 text-sm truncate inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {getLocalizedText(l.location?.name)}</div>
              <div className="text-gray-700 text-sm flex items-center gap-6 pt-1">
                <span className="inline-flex items-center gap-1"><Bed className="h-4 w-4" /> {l.bedrooms ?? 0}</span>
                <span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" /> {l.bathrooms ?? 0}</span>
                <span className="inline-flex items-center gap-1"><Ruler className="h-4 w-4" /> {l.size ?? 0} m²</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Link href="/search-map" className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-800">
          {t('nav.explore')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}


