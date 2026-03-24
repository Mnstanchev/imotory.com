'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {
  Home,
  Building,
  Users,
  Grid3X3,
  MapPin,
  BarChart3,
  Settings,
  Menu,
  X,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/language-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const sidebarItems = [
    {
      title: t('admin.navigation.dashboard'),
      href: '/admin',
      icon: Home,
    },
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
      title: t('common.settings'),
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          
          {/* Replace title text with logo (placeholder until provided) */}
          <div className="h-7 flex items-center">
            <Image src="/Imotory-black-logo.png" alt="Logo" width={120} height={28} priority className="h-7 w-auto" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {t('pages.footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}