'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Listing {
  id: string;
  title: { en: string; bg?: string; ru?: string };
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  isActive: boolean;
  agent: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    email: string;
    phone: string;
    avatar?: string;
    isActive: boolean;
  };
  location: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    slug: string;
    type: string;
  };
  category: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    slug: string;
  };
  createdAt: string;
  slug: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
}

interface ListingsResponse {
  listings: Listing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseListingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  agentId?: string;
  categoryId?: string;
  locationId?: string;
}

// Query key factory
const listingsKeys = {
  all: ['listings'] as const,
  lists: () => [...listingsKeys.all, 'list'] as const,
  list: (params: UseListingsParams) => [...listingsKeys.lists(), params] as const,
  details: () => [...listingsKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingsKeys.details(), id] as const,
};

// Fetch listings hook
export function useListings({ page = 1, limit = 10, search = '', status, agentId, categoryId, locationId }: UseListingsParams = {}) {
  return useQuery({
    queryKey: listingsKeys.list({ page, limit, search, status, agentId, categoryId, locationId }),
    queryFn: async (): Promise<ListingsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
        ...(agentId && { agentId }),
        ...(categoryId && { categoryId }),
        ...(locationId && { locationId }),
      });

      const response = await fetch(`/api/listings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const result = await response.json();
      return result.data || result;
    },
  });
}

// Create listing mutation
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: any) => {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() });
      toast.success('Listing created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create listing');
      console.error('Create listing error:', error);
    },
  });
}

// Update listing mutation
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Listing> }) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: listingsKeys.lists() });

      const previousListings = queryClient.getQueriesData({ queryKey: listingsKeys.lists() });

      queryClient.setQueriesData({ queryKey: listingsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          listings: old.listings.map((listing: Listing) =>
            listing.id === id ? { ...listing, ...data } : listing
          ),
        };
      });

      return { previousListings };
    },
    onError: (err, variables, context) => {
      if (context?.previousListings) {
        context.previousListings.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update listing');
      console.error('Update listing error:', err);
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Listing updated successfully');
    },
  });
}

// Delete listing mutation
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      return { id };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listingsKeys.lists() });

      const previousListings = queryClient.getQueriesData({ queryKey: listingsKeys.lists() });

      queryClient.setQueriesData({ queryKey: listingsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          listings: old.listings.filter((listing: Listing) => listing.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        };
      });

      return { previousListings };
    },
    onError: (err, variables, context) => {
      if (context?.previousListings) {
        context.previousListings.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete listing');
      console.error('Delete listing error:', err);
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Listing deleted successfully');
    },
  });
}

// Toggle listing status mutation
export function useToggleListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing status');
      }

      return response.json();
    },
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: listingsKeys.lists() });

      const previousListings = queryClient.getQueriesData({ queryKey: listingsKeys.lists() });

      queryClient.setQueriesData({ queryKey: listingsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          listings: old.listings.map((listing: Listing) =>
            listing.id === id ? { ...listing, isActive } : listing
          ),
        };
      });

      return { previousListings };
    },
    onError: (err, variables, context) => {
      if (context?.previousListings) {
        context.previousListings.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update listing status');
      console.error('Toggle listing status error:', err);
      queryClient.invalidateQueries({ queryKey: listingsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Listing status updated');
    },
  });
}