import Image from "next/image";
import { getListingBySlug, getListing } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";
import { generateListingMetadata } from "@/lib/metadata";
import ListingImages from "@/components/ListingImages";
import ListingHeader from "@/components/listing/ListingHeader";
import OverviewBadges from "@/components/listing/OverviewBadges";
import AgentCard from "@/components/listing/AgentCard";
import DetailsTable from "@/components/listing/DetailsTable";
import FeaturesChecklist from "@/components/listing/FeaturesChecklist";
import ContactForm from "@/components/listing/ContactForm";
import MapCard from "@/components/listing/MapCard";
import LatestListings from "@/components/LatestListings";
import { getLatestListings } from "@/lib/api";
import LocalizedListingSections from "@/components/listing/LocalizedListingSections";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    let listing;
    try {
      listing = await getListingBySlug(id);
    } catch {
      try {
        listing = await getListing(id);
      } catch {}
    }
    
    if (!listing) {
      return {
        title: 'Property Not Found | Imotory',
        description: 'The requested property could not be found.',
      };
    }
    
    return generateListingMetadata(listing, 'bg');
  } catch {
    return {
      title: 'Property | Imotory',
      description: 'View property details on Imotory.',
    };
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Treat incoming param as slug for SEO-friendly URLs and fall back to ID
    let listing;
    try {
      listing = await getListingBySlug(id);
    } catch {
      try {
        listing = await getListing(id);
      } catch {}
    }
    const latest = await getLatestListings();
    if (!listing) return notFound();
    // If accessed via raw ID, canonicalize to slug URL for SEO
    if (id !== listing.slug) {
      redirect(`/listings/${listing.slug}`);
    }
    const images = Array.isArray(listing.images) ? listing.images : [];
    const formatDisplayId = (raw?: string) => {
      if (!raw) return undefined;
      let hash = 0 >>> 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash * 31) + raw.charCodeAt(i)) >>> 0;
      }
      const num = hash % 10000; // 0000 - 9999
      return `#100${num.toString().padStart(4, "0")}`;
    };
    const displayId = formatDisplayId(listing.id);

    // Note: this is a Server Component. For translation of static labels, we will render keys directly from data; dynamic labels are handled in client components.
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ListingImages images={images} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ListingHeader
              title={listing.title}
              location={listing.location?.name}
              rating={undefined}
              price={listing.price}
              currency={listing.currency}
            />

            <LocalizedListingSections listing={listing} displayId={displayId} />

            <MapCard address={listing.address} lat={listing.latitude as any} lng={listing.longitude as any} />
          </div>
          <aside className="space-y-4">
            <AgentCard
              id={listing.agent?.id}
              name={listing.agent?.name?.en}
              avatar={listing.agent?.avatar}
              phone={listing.agent?.phone}
              email={listing.agent?.email}
              listingId={listing.id}
            />
            <ContactForm
              listingId={listing.id}
              agentId={listing.agent?.id}
              propertyTitle={listing.title}
              displayId={displayId}
            />
          </aside>
        </div>

        <div className="my-10 border-t border-gray-200" />
        <LatestListings listings={latest.slice(0,6)} />
      </div>
    );
  } catch {
    return notFound();
  }
}


