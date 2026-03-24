'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Building, Users, Grid3X3, MapPin, Mail, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';

export function AdminNavTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      title: t('admin.navigation.listings'),
      href: '/admin/listings',
      icon: Building,
    },
    {
      title: t('admin.navigation.agents'),
      href: '/admin/agents',
      icon: Users,
    },
    {
      title: t('admin.navigation.categories'),
      href: '/admin/categories',
      icon: Grid3X3,
    },
    {
      title: t('admin.navigation.locations'),
      href: '/admin/locations',
      icon: MapPin,
    },
    {
      title: t('admin.navigation.email_templates'),
      href: '/admin/email-templates',
      icon: Mail,
    },
    {
      title: t('admin.navigation.analytics'),
      href: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  const currentTab = navItems.find(item => item.href === pathname)?.href || '/admin/listings';

  return (
    <Tabs value={currentTab} className="w-full" onValueChange={(value) => router.push(value)}>
      <TabsList className="w-full bg-white border border-gray-200 rounded-lg p-1 h-14 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.href}
              value={item.href}
              className="flex-1 h-12 data-[state=active]:bg-gray-900 data-[state=active]:text-white hover:bg-gray-50 data-[state=active]:hover:bg-gray-800 text-gray-700"
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}