'use client';

import { useMemo, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationUIItem {
  id: string;
  title: string;
  message: string;
  type: 'new_listing' | 'booking' | 'system' | 'alert' | 'other';
  timestamp: string;
  isRead: boolean;
}

interface AdminNotificationsProps {
  trigger?: React.ReactNode;
}

export function AdminNotifications({ trigger }: AdminNotificationsProps = {}) {
  const { t } = useLanguage();
  const { notifications: apiNotifications, markAsRead, markAllAsRead, isPending } = useNotifications({ page: 1, limit: 50 });
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const mapType = (apiType: string): NotificationUIItem['type'] => {
    switch (apiType) {
      case 'NEW_LISTING':
        return 'new_listing';
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_REQUEST':
        return 'booking';
      case 'SYSTEM':
      case 'SECURITY':
        return 'system';
      case 'ALERT_MATCH':
        return 'alert';
      default:
        return 'other';
    }
  };

  const notifications: NotificationUIItem[] = useMemo(() => {
    return apiNotifications.map(n => ({
      id: n.id,
      title: n.title?.en || 'Notification',
      message: n.message?.en || '',
      type: mapType(n.type),
      timestamp: new Date(n.createdAt).toLocaleString(),
      isRead: n.isRead,
    }));
  }, [apiNotifications]);

  const filteredNotifications = notifications.filter(notif => (filter === 'all' ? true : !notif.isRead));

  const getTypeBadge = (type: NotificationUIItem['type']) => {
    return 'bg-gray-100 text-gray-900 border border-gray-200';
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.notifications_ui.title')}</h2>
        
                 <div className="flex items-center justify-between w-full pr-12">
          <div className="flex gap-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' 
                ? 'bg-gray-900 text-white hover:bg-gray-800 text-xs px-2 py-1 h-7' 
                : 'text-gray-700 hover:text-gray-900 text-xs px-2 py-1 h-7'
              }
            >
              {t('admin.notifications_ui.filters.all')}
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' 
                ? 'bg-gray-900 text-white hover:bg-gray-800 text-xs px-2 py-1 h-7' 
                : 'text-gray-700 hover:text-gray-900 text-xs px-2 py-1 h-7'
              }
            >
              {t('admin.notifications_ui.filters.unread')}
            </Button>
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              className="text-xs font-medium border border-gray-200 rounded-r-none px-2 py-1 h-7 hover:bg-gray-50 text-gray-700"
            >
              <Check className="w-3 h-3 mr-1" />
              {t('admin.notifications_ui.mark_all_read')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs font-medium border border-gray-200 rounded-l-none border-l-0 px-2 py-1 h-7 text-gray-400"
            >
              <X className="w-3 h-3 mr-1" />
              {t('admin.notifications_ui.clear_all')}
            </Button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <ScrollArea className="flex-1">
        <div className="py-4 space-y-3 px-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">{t('admin.notifications_ui.empty.title')}</p>
              <p className="text-sm text-gray-400">{t('admin.notifications_ui.empty.subtitle')}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "group relative p-4 rounded-lg transition-colors duration-200",
                  !notification.isRead ? "bg-gray-50" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          getTypeBadge(notification.type),
                          "ml-auto flex-shrink-0"
                        )}
                      >
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {notification.timestamp}
                      </p>
                       {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                           onClick={() => markAsRead(notification.id)}
                          className="text-xs font-medium text-gray-700 hover:text-gray-900"
                        >
                           {t('admin.notifications_ui.mark_as_read')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="relative text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            <Bell className="h-4 w-4" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-gray-900 rounded-full" />
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent title={t('admin.notifications_ui.title')}>
        {content}
      </SheetContent>
    </Sheet>
  );
}