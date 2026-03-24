'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  slug: string;
  type: 'COUNTRY' | 'REGION' | 'MUNICIPALITY' | 'CITY' | 'NEIGHBORHOOD';
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    listings: number;
    children: number;
  };
  parent?: Location;
  children?: Location[];
}

interface LocationsResponse {
  locations: Location[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

// Query key factory - Added version to force cache invalidation after schema changes
const locationsKeys = {
  all: ['locations', 'v4'] as const, // bump to force refetch after schema/type changes
  lists: () => [...locationsKeys.all, 'list'] as const,
  list: (params: UseLocationsParams) => [...locationsKeys.lists(), params] as const,
  details: () => [...locationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...locationsKeys.details(), id] as const,
};

// Fetch locations hook
export function useLocations({ page = 1, limit = 10, search = '', type }: UseLocationsParams = {}) {
  return useQuery({
    queryKey: locationsKeys.list({ page, limit, search, type }),
    queryFn: async (): Promise<LocationsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(type && { type }),
      });

      const response = await fetch(`/api/locations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const result = await response.json();
      
      // Extract data properly - API returns { success: true, data: { locations: [...], pagination: {...} } }
      const data = result.data || result;
      return data;
    },
  });
}

// Create location mutation
export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locationData: any) => {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create location');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
      toast.success('Location created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create location');
      console.error('Create location error:', error);
    },
  });
}

// Update location mutation
export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Location> }) => {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: locationsKeys.lists() });

      const previousLocations = queryClient.getQueriesData({ queryKey: locationsKeys.lists() });

      queryClient.setQueriesData({ queryKey: locationsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          locations: old.locations.map((location: Location) =>
            location.id === id ? { ...location, ...data } : location
          ),
        };
      });

      return { previousLocations };
    },
    onError: (err, variables, context) => {
      if (context?.previousLocations) {
        context.previousLocations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update location');
      console.error('Update location error:', err);
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Location updated successfully');
    },
  });
}

// Delete location mutation
export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete location');
      }

      return { id };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: locationsKeys.lists() });

      const previousLocations = queryClient.getQueriesData({ queryKey: locationsKeys.lists() });

      queryClient.setQueriesData({ queryKey: locationsKeys.lists() }, (old: any) => {
        if (!old) return old;

        const updatedData = {
          ...old,
          locations: old.locations.filter((location: Location) => location.id !== id),
        };

        // Only update pagination if it exists
        if (old.pagination) {
          updatedData.pagination = {
            ...old.pagination,
            total: old.pagination.total - 1,
          };
        }

        return updatedData;
      });

      return { previousLocations };
    },
    onError: (err, variables, context) => {
      if (context?.previousLocations) {
        context.previousLocations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete location');
      console.error('Delete location error:', err);
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Location deleted successfully');
    },
  });
}

// Toggle location status mutation
export function useToggleLocationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update location status');
      }

      return response.json();
    },
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: locationsKeys.lists() });

      const previousLocations = queryClient.getQueriesData({ queryKey: locationsKeys.lists() });

      queryClient.setQueriesData({ queryKey: locationsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          locations: old.locations.map((location: Location) =>
            location.id === id ? { ...location, isActive } : location
          ),
        };
      });

      return { previousLocations };
    },
    onError: (err, variables, context) => {
      if (context?.previousLocations) {
        context.previousLocations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update location status');
      console.error('Toggle location status error:', err);
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Location status updated');
    },
  });
}