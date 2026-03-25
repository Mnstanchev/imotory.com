'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminNotifications } from './admin-notifications';
import { LanguageSelector } from '@/components/language-selector';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { useNotifications } from '@/hooks/use-notifications';

export function AdminHeader() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { t } = useLanguage();
  const { unreadCount } = useNotifications({ page: 1, limit: 1 });

  return (
    <header className="border-b border-gray-200 bg-gray-900 dark:bg-gray-50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-50 dark:text-gray-900">
            {t('admin.panel')}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <AdminNotifications
            trigger={
              <Button variant="outline" size="icon" className="relative border-gray-800 dark:border-gray-200 bg-gray-900 dark:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-50 dark:text-gray-900" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            }
          />

          {/* Language Selector */}
          <LanguageSelector 
            variant="outline" 
            size="icon" 
            className="border-gray-800 dark:border-gray-200 bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
          />

          {/* Dark Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-gray-800 dark:border-gray-200 bg-gray-900 dark:bg-gray-50">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-gray-50 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-gray-50 dark:text-gray-900 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t('admin.theme.toggle')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
              <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Sun className="mr-2 h-4 w-4" />
                <span>{t('admin.theme.light')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Moon className="mr-2 h-4 w-4" />
                <span>{t('admin.theme.dark')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('admin.theme.system')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-md" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">admin</p>
                  <p className="text-xs leading-none text-gray-600">
                    admin@propertybulgaria.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Settings className="mr-2 h-4 w-4" />
                {t('admin.user.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={async () => {
                  try {
                    // Call the force signout endpoint
                    await fetch('/api/auth/signout-force', { 
                      method: 'GET',
                      credentials: 'include' // Ensure cookies are included
                    });
                    
                    // Force redirect to home page using window.location for reliability
                    window.location.href = '/';
                  } catch (error) {
              
                    // Fallback: still redirect to home page even if API call fails
                    window.location.href = '/';
                  }
                }} 
                className="text-red-600 hover:bg-gray-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('admin.user.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}