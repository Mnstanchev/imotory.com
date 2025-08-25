"use client";
import HeroSearch from "../components/HeroSearch";
import Carousel from "../components/Carousel";
import ListingCard from "../components/ListingCard";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedListings, getLatestListings } from "../lib/api";
import ConciergeSection from "../components/ConciergeSection";
import InquirySection from "../components/InquirySection";
import { useLanguage } from "@/contexts/language-context";

export default function HomePageClient() {
  const { t } = useLanguage();
  const { data: featured = [], isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured"],
    queryFn: getFeaturedListings,
  });
  const { data: latest = [], isLoading: loadingLatest } = useQuery({
    queryKey: ["latest"],
    queryFn: getLatestListings,
  });

  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />

      <section id="featured" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('home.featured')}</h2>
        </div>
        {loadingFeatured ? (
          <div className="text-gray-700">{t('home.loading')}</div>
        ) : featured.length ? (
          <Carousel
            items={featured}
            ariaLabel={t('home.featured_aria')}
            renderItem={(l: any) => <ListingCard listing={l} />}
          />
        ) : (
          <div className="text-gray-600">{t('home.no_featured')}</div>
        )}
      </section>

      <section id="latest" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('home.latest')}</h2>
        </div>
        {loadingLatest ? (
          <div className="text-gray-700">{t('home.loading')}</div>
        ) : latest.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.slice(0, 6).map((l: any) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="text-gray-600">{t('home.no_latest')}</div>
        )}
      </section>

      <ConciergeSection />

      <InquirySection imageUrl="/test-bg-1.webp" />
    </div>
  );
}
