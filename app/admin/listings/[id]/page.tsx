'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface ListingDetails {
  id: string;
  title: { en: string; bg: string };
  description: { en: string; bg: string };
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  features: string[];
  images: string[];
  agent: {
    name: { en: string; bg: string };
    email: string;
    phone: string;
  };
  location: {
    name: { en: string; bg: string };
  };
  category: {
    name: { en: string; bg: string };
  };
}

export default function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParamsAndFetch = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      fetchListing(resolved.id);
    };
    resolveParamsAndFetch();
  }, [params]);

  const fetchListing = async (id: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listing');
      }
      const data = await response.json();
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{listing.title.en}</h1>
            <p className="text-gray-600 mt-1">{listing.title.bg}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/listings/${resolvedParams?.id}/edit`)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">English</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{listing.description.en}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Bulgarian</h3>
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{listing.description.bg}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Price</div>
                  <div className="text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: listing.currency,
                    }).format(listing.price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="text-gray-900">{listing.propertyType}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Listing Type</div>
                  <div className="text-gray-900">{listing.listingType}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Size</div>
                  <div className="text-gray-900">{listing.size ? `${listing.size}m²` : 'N/A'}</div>
                </div>
                {listing.bedrooms && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Bedrooms</div>
                    <div className="text-gray-900">{listing.bedrooms}</div>
                  </div>
                )}
                {listing.bathrooms && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Bathrooms</div>
                    <div className="text-gray-900">{listing.bathrooms}</div>
                  </div>
                )}
                {listing.floor && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Floor</div>
                    <div className="text-gray-900">{listing.floor}</div>
                  </div>
                )}
                {listing.totalFloors && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Floors</div>
                    <div className="text-gray-900">{listing.totalFloors}</div>
                  </div>
                )}
                {listing.yearBuilt && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Year Built</div>
                    <div className="text-gray-900">{listing.yearBuilt}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Location & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Location</div>
                <div className="text-gray-900">{listing.location.name.en}</div>
                <div className="text-gray-600 text-sm">{listing.location.name.bg}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="text-gray-900">{listing.category.name.en}</div>
                <div className="text-gray-600 text-sm">{listing.category.name.bg}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Agent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-gray-900">{listing.agent.name.en}</div>
                <div className="text-gray-600 text-sm">{listing.agent.name.bg}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Contact</div>
                <div className="text-gray-900">{listing.agent.email}</div>
                <div className="text-gray-600">{listing.agent.phone}</div>
              </div>
            </CardContent>
          </Card>

          {listing.features.length > 0 && (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {listing.images.length > 0 && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}