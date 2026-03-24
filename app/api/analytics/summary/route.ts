import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    // @ts-ignore
    if (!(prisma as any).analyticsEvent) {
      return NextResponse.json({ listingClicks: 0, agentClicks: 0, contactSubmits: 0, top: [] });
    }
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // @ts-ignore
    const [listingClicks, agentClicks, contactSubmits] = await Promise.all([
      // @ts-ignore
      (prisma as any).analyticsEvent.count({ where: { type: 'LISTING_CLICK', createdAt: { gte: since } } }),
      // @ts-ignore
      (prisma as any).analyticsEvent.count({ where: { type: 'AGENT_CONTACT_CLICK', createdAt: { gte: since } } }),
      // @ts-ignore
      (prisma as any).analyticsEvent.count({ where: { type: 'CONTACT_SUBMIT', createdAt: { gte: since } } }),
    ]);
    // top listings by clicks
    // @ts-ignore
    const grouped = await (prisma as any).analyticsEvent.groupBy({
      by: ['listingId'],
      where: { listingId: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    const withTitles = await Promise.all(grouped.map(async (g: any) => ({
      listingId: g.listingId!,
      count: g._count._all,
      listing: await prisma.listing.findUnique({
        where: { id: g.listingId! },
        select: { id: true, title: true }
      })
    })));
    return NextResponse.json({ listingClicks, agentClicks, contactSubmits, top: withTitles });
  } catch (e) {
    return NextResponse.json({ listingClicks: 0, agentClicks: 0, contactSubmits: 0, top: [] });
  }
}


