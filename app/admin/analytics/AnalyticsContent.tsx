'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

type ListingBreakdown = {
  listingClicks: number;
  agentClicks: number;
  contactSubmits: number;
};

type TopListing = {
  listingId: string;
  count: number;
  listing: { id: string; title: any };
  breakdown: ListingBreakdown;
};

export type AnalyticsData = {
  listingClicks: number;
  agentClicks: number;
  contactSubmits: number;
  top: TopListing[];
};

export default function AnalyticsContent({ analytics }: { analytics: AnalyticsData }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">{t('admin.dashboard_page.sections.clicks_breakdown.listing_page_clicks')}</CardTitle>
            <CardDescription className="text-gray-600">{t('common.last_30_days') || 'Last 30 days'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.listingClicks}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">{t('admin.dashboard_page.sections.clicks_breakdown.agent_contact_clicks')}</CardTitle>
            <CardDescription className="text-gray-600">{t('common.last_30_days') || 'Last 30 days'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.agentClicks}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">{t('admin.dashboard_page.sections.clicks_breakdown.contact_form_submits')}</CardTitle>
            <CardDescription className="text-gray-600">{t('common.last_30_days') || 'Last 30 days'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.contactSubmits}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('admin.dashboard_page.sections.clicks_breakdown.top_listings')}</CardTitle>
          <CardDescription className="text-gray-600">{t('common.last_30_days') || 'Last 30 days'}</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.top.length ? (
            <div className="space-y-2">
              {analytics.top.map((row: TopListing) => {
                const title = typeof row.listing?.title === 'object' && row.listing?.title && 'en' in (row.listing.title as any)
                  ? (row.listing.title as any).en
                  : typeof row.listing?.title === 'string'
                    ? (row.listing?.title as any)
                    : t('admin.dashboard_page.listing.untitled');
                return (
                  <details key={row.listingId} className="border border-gray-200 rounded-md">
                    <summary className="flex items-center justify-between text-sm text-gray-700 cursor-pointer select-none px-2 py-1 hover:bg-gray-50">
                      <span className="truncate max-w-[70%]" title={title}>{title}</span>
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">{row.count}</Badge>
                    </summary>
                    <div className="px-3 py-2 space-y-2 bg-white">
                      <div className="text-xs text-gray-600">{t('admin.dashboard_page.sections.clicks_breakdown.subtitle')}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center justify-between text-sm text-gray-700 border border-gray-200 rounded px-2 py-1">
                          <span>{t('admin.dashboard_page.sections.clicks_breakdown.listing_page_clicks')}</span>
                          <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">{row.breakdown?.listingClicks ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700 border border-gray-200 rounded px-2 py-1">
                          <span>{t('admin.dashboard_page.sections.clicks_breakdown.agent_contact_clicks')}</span>
                          <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">{row.breakdown?.agentClicks ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700 border border-gray-200 rounded px-2 py-1">
                          <span>{t('admin.dashboard_page.sections.clicks_breakdown.contact_form_submits')}</span>
                          <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-900">{row.breakdown?.contactSubmits ?? 0}</Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">{t('common.quick_links') || 'Quick links'}</div>
                      <div className="flex flex-wrap gap-2">
                        <a className="text-gray-700 hover:text-gray-900 underline" href={`/listings/${row.listingId}`}>{t('common.open_public_page') || 'Open public page'}</a>
                        <a className="text-gray-700 hover:text-gray-900 underline" href={`/admin/listings/${row.listingId}`}>{t('common.open_in_admin') || 'Open in admin'}</a>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-600">{t('admin.dashboard_page.sections.clicks_breakdown.no_clicks')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


