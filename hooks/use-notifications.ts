'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type ApiNotification = {
  id: string;
  userId: string;
  type: string; // e.g., 'NEW_LISTING'
  title: { en: string; bg?: string; ru?: string };
  message: { en: string; bg?: string; ru?: string };
  data?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  notifications: ApiNotification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type NotificationsFilter = {
  isRead?: boolean;
  type?: string;
  page?: number;
  limit?: number;
};

async function fetchNotifications(filter: NotificationsFilter = {}): Promise<NotificationsResponse> {
  const params = new URLSearchParams();
  if (typeof filter.page === 'number') params.set('page', String(filter.page));
  if (typeof filter.limit === 'number') params.set('limit', String(filter.limit));
  if (typeof filter.isRead === 'boolean') params.set('isRead', String(filter.isRead));
  if (filter.type) params.set('type', filter.type);

  const res = await fetch(`/api/notifications?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load notifications');
  }
  return res.json();
}

export function useNotifications(filter: NotificationsFilter = { page: 1, limit: 20 }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-notifications', filter],
    queryFn: () => fetchNotifications(filter),
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (args: { notificationId: string; isRead: boolean }) => {
      const res = await fetch(`/api/notifications?notificationId=${encodeURIComponent(args.notificationId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ isRead: args.isRead }),
        }
      );
      if (!res.ok) throw new Error('Failed to update notification');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });

  return {
    ...query,
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    pagination: query.data?.pagination,
    markAsRead: (notificationId: string) => markAsReadMutation.mutate({ notificationId, isRead: true }),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    isMarkingAll: markAllAsReadMutation.isPending,
  };
}

export function useUnreadNotificationsCount() {
  const { data } = useQuery({
    queryKey: ['admin-notifications', 'count'],
    queryFn: () => fetchNotifications({ page: 1, limit: 1 }),
    refetchInterval: 30000,
  });
  return data?.unreadCount ?? 0;
}


