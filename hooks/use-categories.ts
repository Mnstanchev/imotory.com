'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  slug: string;
  description?: { en?: string; bg?: string; ru?: string };
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    listings: number;
  };
}

interface CategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Query key factory
const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: (params: UseCategoriesParams) => [...categoriesKeys.lists(), params] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
};

// Fetch categories hook
export function useCategories({ page = 1, limit = 10, search = '' }: UseCategoriesParams = {}) {
  return useQuery({
    queryKey: categoriesKeys.list({ page, limit, search }),
    queryFn: async (): Promise<CategoriesResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/categories?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      return result.data || result;
    },
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: any) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create category');
      console.error('Create category error:', error);
    },
  });
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: categoriesKeys.lists() });

      const previousCategories = queryClient.getQueriesData({ queryKey: categoriesKeys.lists() });

      queryClient.setQueriesData({ queryKey: categoriesKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          categories: old.categories.map((category: Category) =>
            category.id === id ? { ...category, ...data } : category
          ),
        };
      });

      return { previousCategories };
    },
    onError: (err, variables, context) => {
      if (context?.previousCategories) {
        context.previousCategories.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update category');
      console.error('Update category error:', err);
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
    },
  });
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      return { id };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoriesKeys.lists() });

      const previousCategories = queryClient.getQueriesData({ queryKey: categoriesKeys.lists() });

      queryClient.setQueriesData({ queryKey: categoriesKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          categories: old.categories.filter((category: Category) => category.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        };
      });

      return { previousCategories };
    },
    onError: (err, variables, context) => {
      if (context?.previousCategories) {
        context.previousCategories.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete category');
      console.error('Delete category error:', err);
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
    },
  });
}

// Toggle category status mutation
export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category status');
      }

      return response.json();
    },
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: categoriesKeys.lists() });

      const previousCategories = queryClient.getQueriesData({ queryKey: categoriesKeys.lists() });

      queryClient.setQueriesData({ queryKey: categoriesKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          categories: old.categories.map((category: Category) =>
            category.id === id ? { ...category, isActive } : category
          ),
        };
      });

      return { previousCategories };
    },
    onError: (err, variables, context) => {
      if (context?.previousCategories) {
        context.previousCategories.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update category status');
      console.error('Toggle category status error:', err);
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Category status updated');
    },
  });
}