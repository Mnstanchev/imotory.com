'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  email: string;
  phone: string;
  bio?: { en?: string; bg?: string; ru?: string };
  avatar?: string;
  socialLinks?: { [key: string]: string };
  isActive: boolean;
  createdAt: string;
  _count: {
    listings: number;
  };
}

interface AgentsResponse {
  agents: Agent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseAgentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Query key factory
const agentsKeys = {
  all: ['agents'] as const,
  lists: () => [...agentsKeys.all, 'list'] as const,
  list: (params: UseAgentsParams) => [...agentsKeys.lists(), params] as const,
  details: () => [...agentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentsKeys.details(), id] as const,
};

// Fetch agents hook
export function useAgents({ page = 1, limit = 10, search = '' }: UseAgentsParams = {}) {
  return useQuery({
    queryKey: agentsKeys.list({ page, limit, search }),
    queryFn: async (): Promise<AgentsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/agents?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const result = await response.json();
      return result.data || result; // Handle both wrapped and unwrapped responses
    },
  });
}

// Create agent mutation
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agentData: any) => {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create agent');
      }

      return response.json();
    },
    onSuccess: (newAgent) => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
      toast.success('Agent created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create agent');
      console.error('Create agent error:', error);
    },
  });
}

// Update agent mutation
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Agent> }) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: agentsKeys.lists() });

      // Snapshot the previous value
      const previousAgents = queryClient.getQueriesData({ queryKey: agentsKeys.lists() });

      // Optimistically update the agent in all relevant queries
      queryClient.setQueriesData({ queryKey: agentsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          agents: old.agents.map((agent: Agent) =>
            agent.id === id ? { ...agent, ...data } : agent
          ),
        };
      });

      return { previousAgents };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAgents) {
        context.previousAgents.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update agent');
      console.error('Update agent error:', err);
      // Only refetch on error to get the correct state
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Agent updated successfully');
      // Don't refetch on success - trust our optimistic update
    },
  });
}

// Delete agent mutation
export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      return { id };
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: agentsKeys.lists() });

      // Snapshot the previous value
      const previousAgents = queryClient.getQueriesData({ queryKey: agentsKeys.lists() });

      // Optimistically remove the agent from all relevant queries
      queryClient.setQueriesData({ queryKey: agentsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          agents: old.agents.filter((agent: Agent) => agent.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        };
      });

      return { previousAgents };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAgents) {
        context.previousAgents.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete agent');
      console.error('Delete agent error:', err);
      // Only refetch on error to get the correct state
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Agent deleted successfully');
      // Don't refetch on success - trust our optimistic update
    },
  });
}

// Toggle agent status mutation
export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent status');
      }

      return response.json();
    },
    onMutate: async ({ id, isActive }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: agentsKeys.lists() });

      // Snapshot the previous value
      const previousAgents = queryClient.getQueriesData({ queryKey: agentsKeys.lists() });

      // Optimistically update the agent status in all relevant queries
      queryClient.setQueriesData({ queryKey: agentsKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          agents: old.agents.map((agent: Agent) =>
            agent.id === id ? { ...agent, isActive } : agent
          ),
        };
      });

      return { previousAgents };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAgents) {
        context.previousAgents.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update agent status');
      console.error('Toggle agent status error:', err);
      // Only refetch on error to get the correct state
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
    },
    onSuccess: () => {
      toast.success('Agent status updated');
      // Don't refetch on success - trust our optimistic update
    },
  });
}