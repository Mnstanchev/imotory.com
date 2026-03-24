import { prisma } from '@/src/lib/prisma';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { LanguageProvider } from '@/contexts/language-context';
import AnalyticsContent from './AnalyticsContent';

async function getAnalytics() {
  // Fallback-safe counts if AnalyticsEvent model is not present on client
  // @ts-ignore
  if (!(prisma as any).analyticsEvent) {
    return { listingClicks: 0, agentClicks: 0, contactSubmits: 0, top: [] as any[] };
  }
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  // @ts-ignore
  const [listingClicksRaw, agentClicks, contactSubmits] = await Promise.all([
    // @ts-ignore
    (prisma as any).analyticsEvent.count({ where: { type: 'LISTING_CLICK', createdAt: { gte: since } } }),
    // @ts-ignore
    (prisma as any).analyticsEvent.count({ where: { type: 'AGENT_CONTACT_CLICK', createdAt: { gte: since } } }),
    // @ts-ignore
    (prisma as any).analyticsEvent.count({ where: { type: 'CONTACT_SUBMIT', createdAt: { gte: since } } }),
  ]);
  // @ts-ignore
  const grouped = await (prisma as any).analyticsEvent.groupBy({
    by: ['listingId'],
    where: { listingId: { not: null }, createdAt: { gte: since } },
    _count: { _all: true },
    // Prisma orderBy aggregate requires a specific field key, not _all
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  });

  // Fallbacks (mirror dashboard behavior):
  // If there are no recorded analytics events yet (e.g., before migration or logging not enabled),
  // derive click totals and top listings from the listings table's "clicks" field so the page isn't empty.
  const needsListingClicksFallback = (Number(listingClicksRaw || 0) === 0);
  let listingClicks = listingClicksRaw;
  let topFromListings: Array<{ listingId: string; count: number; listing: { id: string; title: any } }>|null = null;

  if (needsListingClicksFallback || grouped.length === 0) {
    const listingClickRows = await prisma.listing.findMany({
      select: { id: true, title: true, clicks: true },
      orderBy: { clicks: 'desc' },
      take: 20,
      where: { isActive: true },
    });
    const sumListingClicks = listingClickRows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
    if (needsListingClicksFallback) listingClicks = sumListingClicks;
    if (grouped.length === 0) {
      topFromListings = listingClickRows
        .filter(r => Number(r.clicks || 0) > 0)
        .map(r => ({ listingId: r.id, count: Number(r.clicks || 0), listing: { id: r.id, title: r.title } }));
    }
  }

  const top = await Promise.all(
    (topFromListings ?? grouped).map(async (g: any) => ({
      listingId: g.listingId ?? g.id ?? g.listingId!,
      count: g._count?._all ?? g.count,
      listing: g.listing ?? await prisma.listing.findUnique({
        where: { id: g.listingId! },
        select: { id: true, title: true },
      }),
    }))
  );
  // Enrich with per-type breakdown for shown listings (only when events exist)
  let breakdownMap: Record<string, { listingClicks: number; agentClicks: number; contactSubmits: number }> = {};
  if (!topFromListings && top.length) {
    // @ts-ignore
    const perType = await (prisma as any).analyticsEvent.groupBy({
      by: ['listingId', 'type'],
      where: { listingId: { in: top.map(t => t.listingId) }, createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
    });
    for (const row of perType as any[]) {
      const id = row.listingId as string;
      if (!breakdownMap[id]) breakdownMap[id] = { listingClicks: 0, agentClicks: 0, contactSubmits: 0 };
      if (row.type === 'LISTING_CLICK') breakdownMap[id].listingClicks = row._count._all;
      else if (row.type === 'AGENT_CONTACT_CLICK') breakdownMap[id].agentClicks = row._count._all;
      else if (row.type === 'CONTACT_SUBMIT') breakdownMap[id].contactSubmits = row._count._all;
    }
  }
  const topWithBreakdown = top.map((t) => ({
    ...t,
    breakdown: breakdownMap[t.listingId] ?? { listingClicks: 0, agentClicks: 0, contactSubmits: 0 },
  }));
  return { listingClicks, agentClicks, contactSubmits, top: topWithBreakdown };
}

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin/analytics');
  }
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
    redirect('/auth/error?error=AccessDenied');
  }

  const analytics = await getAnalytics();

  return (
    <LanguageProvider>
    <AnalyticsContent analytics={analytics} />
    </LanguageProvider>
  );
}

// Client content moved to separate file to avoid calling client hooks in a server component
