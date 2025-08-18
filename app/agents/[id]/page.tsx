import { getListings, type Listing, resolveAssetUrl } from "@/lib/api";
import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";

export default async function AgentListingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listings = await getListings({ agentId: id, limit: 60 });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 text-center">
        <div className="inline-block rounded-full bg-gray-100 text-gray-700 text-xs px-3 py-1 mb-2">Agent</div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Agent's Properties</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((l) => (
          <Link key={l.id} href={`/listings/${l.slug}`} className="block border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="relative h-40 w-full overflow-hidden">
              <img src={resolveAssetUrl(l.images?.[0])} alt={l.title?.en || l.slug} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
              <div className="text-gray-900 font-semibold">{l.price} {l.currency}</div>
              <div className="text-gray-900 font-medium truncate">{l.title?.en || l.slug}</div>
              <div className="text-gray-600 text-sm truncate">{l.location?.name?.en}</div>
              <div className="text-gray-700 text-sm flex items-center gap-6 pt-1">
                <span className="inline-flex items-center gap-1"><Bed className="h-4 w-4" /> {l.bedrooms ?? 0}</span>
                <span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" /> {l.bathrooms ?? 0}</span>
                <span className="inline-flex items-center gap-1"><Ruler className="h-4 w-4" /> {l.size ?? 0} m²</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


