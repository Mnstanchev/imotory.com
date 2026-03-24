'use client';

import { useEffect, useState } from 'react';
import { Building, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, BarChart3, Eye, Calendar, Clock, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/language-context';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalAgents: number;
  activeAgents: number;
  totalCategories: number;
  totalLocations: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentListings: number;
  totalBookings: number;
  pendingBookings: number;
  totalContacts: number;
  unreadContacts: number;
  totalFavorites: number;
  totalViews: number;
  totalClicks: number;
  listingAnalytics: Array<{
    id: string;
    title: any;
    viewCount: number;
    clicks?: number;
    lastViewedAt?: Date | null;
  }>;
  bookings: Array<{
    id: string;
    contactName: string;
    listingTitle: any;
    scheduledAt: Date;
    status: string;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    isRead: boolean;
    createdAt: Date;
  }>;
  favorites: Array<{
    id: string;
    userName: string;
    listingTitle: any;
    createdAt: Date;
  }>;
  clickAnalytics?: {
    last30d: { listingClicks: number; agentClicks: number; contactSubmits: number };
    topListings: Array<{ listingId: string; count: number; listing?: { id: string; title: any } | null }>;
  };
}



export function AdminDashboard({ stats }: { stats: DashboardStats }) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { t } = useLanguage();
  const [contactStatusById, setContactStatusById] = useState<Record<string, 'new' | 'read' | 'replied'>>(
    () => Object.fromEntries((stats.contacts || []).map((c) => [c.id, c.isRead ? 'read' : 'new']))
  );

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: t('admin.dashboard_page.cards.active_listings.title'),
      value: stats.activeListings.toLocaleString(),
      description: t('admin.dashboard_page.cards.active_listings.description', { count: stats.totalListings.toLocaleString() }),
      icon: Building,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      trend: { value: stats.monthlyGrowth, isPositive: stats.monthlyGrowth > 0 }
    },
    {
      title: t('admin.dashboard_page.cards.total_views.title'),
      value: (stats.totalViews || 0).toLocaleString(),
      description: t('admin.dashboard_page.cards.total_views.description'),
      icon: Eye,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-emerald-600/10",
      trend: { value: stats.totalViews || 0, isPositive: (stats.totalViews || 0) > 0 }
    },
    {
      title: t('admin.dashboard_page.cards.total_clicks.title'),
      value: (stats.totalClicks || 0).toLocaleString(),
      description: t('admin.dashboard_page.cards.total_clicks.description'),
      icon: Activity,
      gradient: "from-violet-500 to-violet-600",
      bgGradient: "from-violet-500/10 to-violet-600/10",
      trend: { value: stats.totalClicks || 0, isPositive: (stats.totalClicks || 0) > 0 }
    },
    {
      title: t('admin.dashboard_page.cards.bookings.title'),
      value: stats.totalBookings.toLocaleString(),
      description: t('admin.dashboard_page.cards.bookings.description', { pending: stats.pendingBookings }),
      icon: Calendar,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-500/10 to-amber-600/10",
      trend: { value: stats.totalBookings - stats.pendingBookings, isPositive: true }
    },
    {
      title: t('admin.dashboard_page.cards.contacts.title'),
      value: (stats.totalContacts || 0).toLocaleString(),
      description: t('admin.dashboard_page.cards.contacts.description', { unread: stats.unreadContacts || 0 }),
      icon: Users,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      trend: { value: (stats.totalContacts || 0) - (stats.unreadContacts || 0), isPositive: true }
    },
    {
      title: t('admin.dashboard_page.cards.favorites.title'),
      value: (stats.totalFavorites || 0).toLocaleString(),
      description: t('admin.dashboard_page.cards.favorites.description'),
      icon: TrendingUp,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-500/10 to-pink-600/10",
      trend: { value: stats.totalFavorites || 0, isPositive: (stats.totalFavorites || 0) > 0 }
    }
  ];



  return (
    <div className="relative -m-6 min-h-[calc(100vh-4rem)] bg-white">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Modern Header with Clean Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    {t('admin.dashboard')}
                  </h1>
                </div>
                <p className="text-blue-100 text-lg font-medium">
                  {t('admin.dashboard_page.subtitle')}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-blue-200">
                  <Clock className="h-4 w-4" />
                  <span>{t('admin.dashboard_page.last_updated', { time: currentTime || t('common.loading') })}</span>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="text-right">
                  <div className="text-2xl font-bold">€{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-blue-200">{t('admin.dashboard_page.portfolio_value')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="group relative overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="p-3 rounded-xl bg-gray-900">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.description}
                  </p>
                  <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trend.isPositive 
                      ? 'text-gray-900 bg-gray-100' 
                      : 'text-gray-900 bg-gray-100'
                  }`}>
                    {stat.trend.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(stat.trend.value)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Listing Analytics */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Performing Listings */}
          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">{t('admin.dashboard_page.sections.top_listings.title')}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {t('admin.dashboard_page.sections.top_listings.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.listingAnalytics || []).length > 0 ? (
                  (stats.listingAnalytics || []).slice(0, 5).map((listing, index) => {
                    const listingTitle = typeof listing.title === 'object' && listing.title && 'en' in listing.title 
                      ? listing.title.en 
                      : typeof listing.title === 'string' 
                        ? listing.title 
                        : t('admin.dashboard_page.listing.untitled');
                    
                    return (
                      <div key={listing.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-12 w-12 bg-gray-900 rounded-xl flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 block">
                              {listingTitle}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Eye className="h-3 w-3" />
                              <span>{listing.viewCount} {t('admin.table.results')}</span>
                              {listing.clicks !== undefined && (
                                <>
                                  <Activity className="h-3 w-3 ml-2" />
                                 <span>{listing.clicks} {t('admin.dashboard_page.cards.total_clicks.title').toLowerCase()}</span>
                                </>
                              )}
                            </div>
                            {listing.lastViewedAt && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{t('common.updated')}: {new Date(listing.lastViewedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className="font-bold border-2 border-gray-200 text-gray-900 bg-gray-50"
                          >
                             {listing.viewCount} {t('admin.table.results')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                   <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                     <p className="text-sm font-semibold text-gray-500">{t('admin.dashboard_page.sections.top_listings.empty_title')}</p>
                     <p className="text-xs text-gray-400 mt-1">{t('admin.dashboard_page.sections.top_listings.empty_subtitle')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">{t('admin.dashboard_page.sections.recent_bookings.title')}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {t('admin.dashboard_page.sections.recent_bookings.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats.bookings || []).length > 0 ? (
                  (stats.bookings || []).slice(0, 5).map((booking) => {
                    const listingTitle = typeof booking.listingTitle === 'object' && booking.listingTitle && 'en' in booking.listingTitle 
                      ? booking.listingTitle.en 
                      : typeof booking.listingTitle === 'string' 
                        ? booking.listingTitle 
                        : t('admin.dashboard_page.listing.untitled');
                    
                    return (
                      <div key={booking.id} className="group flex items-start space-x-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                        <div className="p-2 bg-gray-900 rounded-xl">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            <span className="font-bold text-gray-900">{booking.contactName}</span> booked <span className="font-semibold text-gray-700">{listingTitle}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(booking.scheduledAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <BookingActions bookingId={booking.id} />
                        <Badge 
                          variant="outline" 
                          className={`font-semibold border-2 ${
                            booking.status === 'CONFIRMED' 
                              ? 'border-green-200 text-green-900 bg-green-50'
                              : booking.status === 'PENDING'
                              ? 'border-yellow-200 text-yellow-900 bg-yellow-50'
                              : 'border-gray-200 text-gray-900 bg-gray-50'
                          }`}
                        >
                          {booking.status.toLowerCase()}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                     <p className="text-sm font-semibold text-gray-500">{t('admin.dashboard_page.sections.recent_bookings.empty_title')}</p>
                     <p className="text-xs text-gray-400 mt-1">{t('admin.dashboard_page.sections.recent_bookings.empty_subtitle')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics - Modernized */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">{t('admin.dashboard_page.sections.performance.title')}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {t('admin.dashboard_page.sections.performance.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-900" />
                      <span className="text-sm font-bold text-gray-700">{t('admin.dashboard_page.sections.performance.active_listings')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {stats.totalListings > 0 ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0}%
                      </span>
                      <p className="text-xs text-gray-500">{stats.activeListings}/{stats.totalListings}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gray-900 h-3 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${stats.totalListings > 0 ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-900" />
                      <span className="text-sm font-bold text-gray-700">{t('admin.dashboard_page.sections.performance.active_agents')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {stats.totalAgents > 0 ? Math.round((stats.activeAgents / stats.totalAgents) * 100) : 0}%
                      </span>
                      <p className="text-xs text-gray-500">{stats.activeAgents}/{stats.totalAgents}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gray-900 h-3 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${stats.totalAgents > 0 ? Math.round((stats.activeAgents / stats.totalAgents) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-900" />
                      <span className="text-sm font-bold text-gray-700">{t('admin.dashboard_page.sections.performance.booking_completion')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {stats.totalBookings > 0 ? Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0}%
                      </span>
                      <p className="text-xs text-gray-500">{stats.totalBookings - stats.pendingBookings}/{stats.totalBookings}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gray-900 h-3 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${stats.totalBookings > 0 ? Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">{t('admin.dashboard_page.sections.recent_contacts.title')}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {t('admin.dashboard_page.sections.recent_contacts.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RecentContactsPaged 
                initial={stats.contacts || []} 
                contactStatusById={contactStatusById}
                onContactStatusChange={(id: string, s: 'new' | 'read' | 'replied') => setContactStatusById((prev) => ({ ...prev, [id]: s }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Clicks Breakdown */}
          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">{t('admin.dashboard_page.sections.clicks_breakdown.title')}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {t('admin.dashboard_page.sections.clicks_breakdown.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* By Type */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-900 mb-2">{t('admin.dashboard_page.sections.clicks_breakdown.by_type')}</div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{t('admin.dashboard_page.sections.clicks_breakdown.listing_page_clicks')}</span>
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">
                        {/* @ts-ignore - hydrated with react-query key */}
                        {(stats.clickAnalytics?.last30d.listingClicks ?? 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('admin.dashboard_page.sections.clicks_breakdown.agent_contact_clicks')}</span>
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">
                        {(stats.clickAnalytics?.last30d.agentClicks ?? 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('admin.dashboard_page.sections.clicks_breakdown.contact_form_submits')}</span>
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">
                        {(stats.clickAnalytics?.last30d.contactSubmits ?? 0)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* By Listing */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-900 mb-2">{t('admin.dashboard_page.sections.clicks_breakdown.top_listings')}</div>
                  <div className="space-y-2">
                    {(stats.clickAnalytics?.topListings || []).length > 0 ? (
                      (stats.clickAnalytics?.topListings || []).map((row) => {
                        const title = typeof row.listing?.title === 'object' && row.listing?.title && 'en' in row.listing.title
                          ? (row.listing.title as any).en
                          : typeof row.listing?.title === 'string'
                            ? (row.listing?.title as any)
                            : 'Untitled Listing';
                        return (
                          <div key={row.listingId} className="flex items-center justify-between text-sm text-gray-700">
                            <span className="truncate max-w-[70%]" title={title}>{title}</span>
                            <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">{row.count}</Badge>
                          </div>
                        );
                      })
                    ) : (
                       <div className="text-sm text-gray-600">{t('admin.dashboard_page.sections.clicks_breakdown.no_clicks')}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">Recent Favorites</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Properties recently saved by users
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RecentFavoritesPaged initial={stats.favorites || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RecentFavoritesPaged({ initial }: { initial: Array<{ id: string; userName: string; listingTitle: any; createdAt: Date }> }) {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { t } = useLanguage();
  const { data, isFetching } = useQuery({
    queryKey: ['recent-favorites', page, limit],
    queryFn: async () => {
      const url = new URL('/api/favorites/recent', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch recent favorites');
      return res.json();
    },
    placeholderData: page === 1 ? { data: { items: initial.slice(0, limit), pagination: { page: 1, limit, total: initial.length, totalPages: Math.ceil(Math.max(1, initial.length)/limit), hasNext: initial.length > limit } }, success: true } as any : undefined,
  });

  const items = (data?.data?.items || []) as Array<{ id: string; userName: string; listingTitle: any; createdAt: string }>;
  const hasNext = !!data?.data?.pagination?.hasNext;

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        <ul className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200">
          {items.map((favorite) => {
            const listingTitle = typeof favorite.listingTitle === 'object' && favorite.listingTitle && 'en' in favorite.listingTitle
              ? (favorite.listingTitle as any).en
              : typeof favorite.listingTitle === 'string'
                ? (favorite.listingTitle as any)
                : 'Untitled Listing';

            return (
              <li key={favorite.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-gray-900 rounded-md shrink-0">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{listingTitle}</p>
                    <p className="text-xs text-gray-600">Saved by <span className="font-semibold">{favorite.userName}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{new Date(favorite.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
                   <div className="text-center py-10 border border-gray-200 rounded-md bg-white">
          <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
           <p className="text-sm font-semibold text-gray-500">{t('admin.table.no_data')}</p>
           <p className="text-xs text-gray-400 mt-1">{t('admin.listings.get_started_first')}</p>
        </div>
      )}

      {hasNext && (
        <div className="flex justify-center">
          <button
            className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
          >
            {isFetching ? t('common.loading') : t('common.load_more')}
          </button>
        </div>
      )}
    </div>
  );
}

// Contacts: paged list + modal + details
function RecentContactsPaged({ 
  initial, 
  contactStatusById, 
  onContactStatusChange 
}: { 
  initial: Array<{ id: string; name: string; email: string; subject: string; isRead: boolean; createdAt: Date }>; 
  contactStatusById: Record<string, 'new' | 'read' | 'replied'>; 
  onContactStatusChange: (id: string, s: 'new' | 'read' | 'replied') => void;
}) {
  const [page, setPage] = useState(1);
  const { t } = useLanguage();
  const [openAll, setOpenAll] = useState(false);
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const limit = 5;
  const [accumulated, setAccumulated] = useState<Array<{ id: string; name: string; email: string; subject: string; createdAt: string }>>([]);

  const { data, isFetching } = useQuery({
    queryKey: ['recent-contacts', page, limit],
    queryFn: async () => {
      const url = new URL('/api/contact', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: page === 1 ? {
      data: {
        contactForms: initial.slice(0, limit),
        pagination: {
          page: 1,
          limit,
          total: initial.length,
          totalPages: Math.ceil(Math.max(1, initial.length)/limit),
          hasNext: initial.length > limit,
        }
      },
      success: true,
    } as any : undefined,
  });

  const items = (data?.data?.contactForms || []) as Array<{ id: string; name: string; email: string; subject: string; createdAt: string }>;
  const hasNext = !!data?.data?.pagination?.hasNext;

  useEffect(() => {
    if (page === 1) {
      setAccumulated(items || []);
    } else if (items && items.length) {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...items.filter((it) => !seen.has(it.id))];
      });
    }
  }, [items, page]);

  return (
    <div className="space-y-4">
      {accumulated.length > 0 ? (
        <div className="space-y-3">
          <ul className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200 max-h-72 overflow-y-auto">
            {accumulated.map((contact) => (
              <li key={contact.id} className="flex items-start gap-3 p-3">
                <Avatar className="h-9 w-9 ring-2 ring-white shadow-md shrink-0">
                  <AvatarFallback className="bg-gray-900 text-white font-semibold">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    <span className="font-bold text-gray-900">{contact.name}</span> — <span className="font-semibold text-gray-700">{contact.subject}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`font-semibold border-2 ${
                      (contactStatusById[contact.id] || 'new') === 'new'
                        ? 'border-blue-200 text-blue-900 bg-blue-50'
                        : (contactStatusById[contact.id] || 'new') === 'replied'
                        ? 'border-green-200 text-green-900 bg-green-50'
                        : 'border-gray-200 text-gray-900 bg-gray-50'
                    }`}
                  >
                    {contactStatusById[contact.id] || 'new'}
                  </Badge>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    title="View"
                    onClick={() => setOpenContactId(contact.id)}
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  <ReplyButton
                    contactId={contact.id}
                    to={contact.email}
                    subject={contact.subject}
                    onStatusChange={(s) => onContactStatusChange(contact.id, s)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm"
              onClick={() => setOpenAll(true)}
            >
              See all customers
            </button>
            {hasNext && (
              <button
                className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
              >
                {isFetching ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No contacts yet</p>
          <p className="text-xs text-gray-400 mt-1">Customer inquiries will appear here</p>
        </div>
      )}

      {openAll && (
        <AllContactsModal 
          onClose={() => setOpenAll(false)} 
          onOpenContact={(id) => setOpenContactId(id)}
        />
      )}

      {openContactId && (
        <ContactDetailsModal 
          contactId={openContactId}
          onClose={() => setOpenContactId(null)}
        />
      )}
    </div>
  );
}

function AllContactsModal({ onClose, onOpenContact }: { onClose: () => void; onOpenContact: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { t } = useLanguage();
  const { data, isFetching } = useQuery({
    queryKey: ['all-contacts', page, limit],
    queryFn: async () => {
      const url = new URL('/api/contact', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const items = (data?.data?.contactForms || []) as Array<{ id: string; name: string; email: string; subject: string; createdAt: string }>; 
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-900 font-semibold text-lg">{t('admin.dashboard_page.modals.all_customers')}</div>
          <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>{t('common.close')}</button>
        </div>
        <div className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
          {items.map((c) => (
            <div key={c.id} className="flex items-start justify-between p-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{c.name}</div>
                <div className="text-xs text-gray-600 truncate">{c.email}</div>
                <div className="text-xs text-gray-700 truncate">{c.subject}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50" onClick={() => onOpenContact(c.id)}>
                  <Eye className="h-3 w-3" /> {t('common.view')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm disabled:opacity-50" disabled={page<=1 || isFetching} onClick={()=>setPage(p=>Math.max(1,p-1))}>
            <ChevronLeft className="h-4 w-4"/> {t('admin.table.previous')}
          </button>
          <div className="text-sm text-gray-700">Page {page} of {totalPages}</div>
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm disabled:opacity-50" disabled={page>=totalPages || isFetching} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>
            {t('admin.table.next')} <ChevronRight className="h-4 w-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactDetailsModal({ contactId, onClose }: { contactId: string; onClose: () => void }) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewListing, setPreviewListing] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/contact/${contactId}`);
        if (!res.ok) throw new Error('Failed to load contact');
        const json = await res.json();
        if (!cancelled) setData(json?.data ?? json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [contactId]);

  const listingTitle = typeof data?.listing?.title === 'object' ? (data?.listing?.title?.en || 'Listing') : (data?.listing?.title || 'Listing');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl bg-white border border-gray-200 shadow-xl rounded-md">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-2 py-1 text-xs" onClick={onClose}>
            <ChevronLeft className="h-4 w-4"/> Back
          </button>
          <div className="text-gray-900 font-semibold">Customer details</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 p-4">
          <div className="border border-gray-200 rounded-md p-4 bg-white space-y-2">
            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : error ? (
              <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">{error}</div>
            ) : data ? (
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-semibold text-gray-900">Name:</span> {data.name}</div>
                <div><span className="font-semibold text-gray-900">Email:</span> {data.email}</div>
                <div><span className="font-semibold text-gray-900">Phone:</span> {data.phone || '-'}</div>
                <div><span className="font-semibold text-gray-900">Subject:</span> {data.subject}</div>
                <div><span className="font-semibold text-gray-900">Message:</span> {data.message}</div>
                <div><span className="font-semibold text-gray-900">Created:</span> {data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No data</div>
            )}
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            {data?.listing ? (
              <div className="space-y-3">
                <div className="text-gray-900 font-semibold">Interested listing</div>
                <div className="text-sm text-gray-700">{listingTitle}</div>
                <button className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-800" onClick={()=>setPreviewListing(data.listing)}>Preview listing</button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No listing attached</div>
            )}
          </div>
        </div>
      </div>

      {previewListing && (
        <ListingPreviewModal listing={previewListing} onClose={()=>setPreviewListing(null)} />
      )}
    </div>
  );
}

function RecentBookingsPaged({ 
  initial, 
  contactStatusById, 
  onContactStatusChange 
}: { 
  initial: Array<{ id: string; contactName: string; listingTitle: any; scheduledAt: Date; status: string }>; 
  contactStatusById: Record<string, 'new' | 'read' | 'replied'>; 
  onContactStatusChange: (id: string, s: 'new' | 'read' | 'replied') => void;
}) {
  const [page, setPage] = useState(1);
  const [openAll, setOpenAll] = useState(false);
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const limit = 5;
  const [accumulated, setAccumulated] = useState<Array<{ id: string; contactName: string; listingTitle: any; scheduledAt: string; status: string }>>([]);

  const { data, isFetching } = useQuery({
    queryKey: ['recent-bookings', page, limit],
    queryFn: async () => {
      const url = new URL('/api/bookings', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: page === 1 ? {
      data: {
        bookings: initial.slice(0, limit),
        pagination: {
          page: 1,
          limit,
          total: initial.length,
          totalPages: Math.ceil(Math.max(1, initial.length)/limit),
          hasNext: initial.length > limit,
        }
      },
      success: true,
    } as any : undefined,
  });

  const items = (data?.data?.bookings || []) as Array<{ id: string; contactName: string; listingTitle: any; scheduledAt: string; status: string }>;
  const hasNext = !!data?.data?.pagination?.hasNext;

  // accumulate loaded pages so list can keep growing in the frame
  useEffect(() => {
    if (page === 1) {
      setAccumulated(items || []);
    } else if (items && items.length) {
      setAccumulated((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...items.filter((it) => !seen.has(it.id))];
      });
    }
  }, [items, page]);

  return (
    <div className="space-y-4">
      {accumulated.length > 0 ? (
        <div className="space-y-3">
          <ul className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200 max-h-72 overflow-y-auto">
            {accumulated.map((contact) => (
              <li key={contact.id} className="flex items-start gap-3 p-3">
                <Avatar className="h-9 w-9 ring-2 ring-white shadow-md shrink-0">
                  <AvatarFallback className="bg-gray-900 text-white font-semibold">
                    {contact.contactName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    <span className="font-bold text-gray-900">{contact.contactName}</span> — <span className="font-semibold text-gray-700">{typeof contact.listingTitle==='object'?(contact.listingTitle as any).en:contact.listingTitle}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span>{new Date(contact.scheduledAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`font-semibold border-2 ${
                      (contactStatusById[contact.id] || 'new') === 'new'
                        ? 'border-blue-200 text-blue-900 bg-blue-50'
                        : (contactStatusById[contact.id] || 'new') === 'replied'
                        ? 'border-green-200 text-green-900 bg-green-50'
                        : 'border-gray-200 text-gray-900 bg-gray-50'
                    }`}
                  >
                    {contact.status?.toLowerCase?.() || contactStatusById[contact.id] || 'new'}
                  </Badge>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    title="View"
                    onClick={() => setOpenContactId(contact.id)}
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm"
              onClick={() => setOpenAll(true)}
            >
              See all customers
            </button>
            {hasNext && (
              <button
                className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
              >
                {isFetching ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No contacts yet</p>
          <p className="text-xs text-gray-400 mt-1">Customer inquiries will appear here</p>
        </div>
      )}

      {openAll && (
        <AllBookingsModal 
          onClose={() => setOpenAll(false)} 
          onOpenContact={(id) => setOpenContactId(id)}
        />
      )}

      {openContactId && (
        <BookingDetailsModal 
          bookingId={openContactId}
          onClose={() => setOpenContactId(null)}
        />
      )}
    </div>
  );
}

function AllBookingsModal({ onClose, onOpenContact }: { onClose: () => void; onOpenContact: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { t } = useLanguage();
  const { data, isFetching } = useQuery({
    queryKey: ['all-bookings', page, limit],
    queryFn: async () => {
      const url = new URL('/api/bookings', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const items = (data?.data?.bookings || []) as Array<{ id: string; contactName: string; listingTitle: any; scheduledAt: string; status: string }>; 
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-900 font-semibold text-lg">{t('admin.dashboard_page.modals.all_bookings')}</div>
          <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>{t('common.close')}</button>
        </div>
        <div className="border border-gray-200 rounded-md bg-white divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
          {items.map((c) => (
            <div key={c.id} className="flex items-start justify-between p-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{c.contactName}</div>
                <div className="text-xs text-gray-700 truncate">{typeof c.listingTitle==='object'?(c.listingTitle as any).en:c.listingTitle}</div>
                <div className="text-xs text-gray-600 truncate">{new Date(c.scheduledAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50" onClick={() => onOpenContact(c.id)}>
                  <Eye className="h-3 w-3" /> {t('common.view')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm disabled:opacity-50" disabled={page<=1 || isFetching} onClick={()=>setPage(p=>Math.max(1,p-1))}>
            <ChevronLeft className="h-4 w-4"/> {t('admin.table.previous')}
          </button>
          <div className="text-sm text-gray-700">Page {page} of {totalPages}</div>
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm disabled:opacity-50" disabled={page>=totalPages || isFetching} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>
            {t('admin.table.next')} <ChevronRight className="h-4 w-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingDetailsModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewListing, setPreviewListing] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error('Failed to load booking');
        const json = await res.json();
        if (!cancelled) setData(json?.data ?? json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [bookingId]);

  const listingTitle = typeof data?.listing?.title === 'object' ? (data?.listing?.title?.en || 'Listing') : (data?.listing?.title || 'Listing');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl bg-white border border-gray-200 shadow-xl rounded-md">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <button className="inline-flex items-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-2 py-1 text-xs" onClick={onClose}>
            <ChevronLeft className="h-4 w-4"/> Back
          </button>
          <div className="text-gray-900 font-semibold">Booking details</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 p-4">
          <div className="border border-gray-200 rounded-md p-4 bg-white space-y-2">
            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : error ? (
              <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">{error}</div>
            ) : data ? (
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-semibold text-gray-900">Name:</span> {data.contactName}</div>
                <div><span className="font-semibold text-gray-900">Email:</span> {data.contactEmail}</div>
                <div><span className="font-semibold text-gray-900">Phone:</span> {data.contactPhone || '-'}</div>
                <div><span className="font-semibold text-gray-900">When:</span> {data.scheduledAt ? new Date(data.scheduledAt).toLocaleString() : '-'}</div>
                <div><span className="font-semibold text-gray-900">Duration:</span> {data.duration} min</div>
                <div><span className="font-semibold text-gray-900">Status:</span> {data.status}</div>
                <div><span className="font-semibold text-gray-900">Message:</span> {data.message || '-'}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No data</div>
            )}
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            {data?.listing ? (
              <div className="space-y-3">
                <div className="text-gray-900 font-semibold">Interested listing</div>
                <div className="text-sm text-gray-700">{listingTitle}</div>
                <button className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-3 py-2 text-sm hover:bg-gray-800" onClick={()=>setPreviewListing(data.listing)}>Preview listing</button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No listing attached</div>
            )}
          </div>
        </div>
      </div>

      {previewListing && (
        <ListingPreviewModal listing={previewListing} onClose={()=>setPreviewListing(null)} />
      )}
    </div>
  );
}

function ListingPreviewModal({ listing, onClose }: { listing: any; onClose: () => void }) {
  const title = typeof listing?.title === 'object' ? (listing?.title?.en || 'Listing') : (listing?.title || 'Listing');
  const imageUrl = Array.isArray(listing?.images)
    ? (typeof listing.images[0] === 'string' ? listing.images[0] : listing.images[0]?.url) || '/next.svg'
    : '/next.svg';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-900 font-semibold text-lg">Listing preview</div>
          <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-3">
          <div className="relative w-full h-56 overflow-hidden rounded-md border border-gray-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="text-gray-900 font-semibold">{title}</div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>Price: {listing.price ?? '-'} {listing.currency}</div>
            <div>Type: {listing.propertyType || '-'}</div>
            <div>Size: {listing.size ? `${listing.size} m²` : '-'}</div>
            <div>Rooms: {listing.livingRooms ?? '-'}</div>
            <div>Beds: {listing.bedrooms ?? '-'}</div>
            <div>Baths: {listing.bathrooms ?? '-'}</div>
            <div>Year: {listing.yearBuilt ?? '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingActions({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);
  const [notes, setNotes] = useState<string>("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Failed to load booking');
      const json = await res.json();
      const b = (json as any).data || json;
      setData(b);
      try { setScheduledAt(new Date(b.scheduledAt).toISOString().slice(0,16)); } catch { setScheduledAt(''); }
      setDuration(b.duration || 30);
    } catch (e: any) {
      setError(e?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED', scheduledAt: new Date(scheduledAt).toISOString(), duration, response: notes })
      });
      if (!res.ok) throw new Error('Failed to confirm booking');
      setSuccess('Booking confirmed and emails sent.');
      setTimeout(() => setOpen(false), 1000);
    } catch (e: any) {
      setError(e?.message || 'Failed to confirm booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => { setOpen(true); load(); }} className="border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md px-3 py-1 text-sm">Open</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white border border-gray-200 shadow-xl rounded-md p-4">
            <div className="text-gray-900 font-semibold text-lg mb-2">Booking Details</div>
            {error && <div className="mb-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">{error}</div>}
            {success && <div className="mb-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">{success}</div>}
            {data ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Customer:</span> {data.contactName} — {data.contactEmail}, {data.contactPhone}</div>
                <div className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Listing:</span> {typeof data.listing?.title === 'object' ? (data.listing?.title?.en || 'Listing') : (data.listing?.title || 'Listing')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm text-gray-700">Date & Time
                    <input type="datetime-local" className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900" value={scheduledAt} onChange={(e)=>setScheduledAt(e.target.value)} />
                  </label>
                  <label className="text-sm text-gray-700">Duration (min)
                    <input type="number" className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900" value={duration} onChange={(e)=>setDuration(parseInt(e.target.value||'30',10))} />
                  </label>
                </div>
                <label className="text-sm text-gray-700">Notes to include
                  <textarea className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900" value={notes} onChange={(e)=>setNotes(e.target.value)} />
                </label>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button className="px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>Close</button>
                  <button className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white" onClick={confirm} disabled={loading}>{loading ? 'Saving...' : 'Confirm & Send'}</button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">{loading ? 'Loading…' : 'No data'}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ReplyButton({ contactId, to, subject, onStatusChange }: { contactId: string; to: string; subject: string; onStatusChange?: (s: 'new' | 'read' | 'replied') => void }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<any | null>(null);

  async function sendReply() {
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      // optimistic
      onStatusChange?.('replied');
      const res = await fetch(`/api/contact/${contactId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: `Re: ${subject}`, message }),
      });
      if (!res.ok) {
        onStatusChange?.('read');
        throw new Error('Failed to send reply');
      }
      setSuccess(true);
      setMessage('');
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setSending(false);
    }
  }

  // Load full contact (with listing) when opening
  async function loadContact() {
    try {
      setLoading(true);
      const res = await fetch(`/api/contact/${contactId}`);
      if (res.ok) {
        const json = await res.json();
        setContact(json?.data ?? json);
      }
    } catch {}
    finally { setLoading(false); }
  }

  function onOpenChange(v: boolean) {
    setOpen(v);
    if (v && !contact) loadContact();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
        <Mail className="h-3 w-3" /> Reply
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Reply to contact</DialogTitle>
          <DialogDescription className="text-sm">To: {to}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Listing Details */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : contact?.listing ? (
              <div className="space-y-3">
                <div className="relative w-full h-40 overflow-hidden rounded-md border border-gray-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      Array.isArray(contact.listing.images)
                        ? (typeof contact.listing.images[0] === 'string'
                            ? (contact.listing.images[0] as any)
                            : (contact.listing.images[0] as any)?.url) || '/next.svg'
                        : '/next.svg'
                    }
                    alt={typeof contact.listing.title === 'object' ? contact.listing.title?.en : contact.listing.title || 'Listing'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-gray-900 font-semibold">
                  {typeof contact.listing.title === 'object' ? contact.listing.title?.en : contact.listing.title}
                </div>
                <div className="text-gray-700 text-sm">
                  {(contact.listing.price ?? '')} {contact.listing.currency}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Type: {contact.listing.propertyType || '-'}</div>
                  <div>Size: {contact.listing.size ? `${contact.listing.size} m²` : '-'}</div>
                  <div>Rooms: {contact.listing.livingRooms ?? '-'}</div>
                  <div>Beds: {contact.listing.bedrooms ?? '-'}</div>
                  <div>Baths: {contact.listing.bathrooms ?? '-'}</div>
                  <div>Year: {contact.listing.yearBuilt ?? '-'}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No listing details.</div>
            )}
          </div>

          {/* Right: Contact + Reply */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm text-gray-700">Name
                <input value={contact?.name || ''} readOnly className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-gray-50" />
              </label>
              <label className="text-sm text-gray-700">Phone
                <input value={contact?.phone || ''} readOnly className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-gray-50" />
              </label>
              <label className="text-sm text-gray-700">Email
                <input value={contact?.email || to} readOnly className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-gray-50" />
              </label>
            </div>

            <label className="text-sm text-gray-700">Message
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2" rows={8} />
            </label>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            {success ? <div className="text-sm text-gray-900">Reply sent.</div> : null}

            <div className="flex justify-end">
              <button onClick={sendReply} disabled={sending || !message.trim()} className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2 text-sm">
                {sending ? 'Sending…' : 'Send reply'}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}