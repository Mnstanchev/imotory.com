import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { prisma } from '@/src/lib/prisma';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

async function getDashboardStats() {
  const [
    totalListings,
    activeListings,
    totalAgents,
    activeAgents,
    totalCategories,
    totalLocations,
    recentListings,
    totalBookings,
    pendingBookings,
    totalContacts,
    unreadContacts,
    totalFavorites,
    totalGuestFavorites,
    listingAnalytics,
    recentBookings,
    recentContacts,
    recentFavorites,
    recentGuestFavorites,
    analyticsCounts,
    analyticsTopListings,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { isActive: true } }),
    prisma.agent.count(),
    prisma.agent.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.location.count(),
    prisma.listing.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.contact.count(),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.favorite.count(),
    // @ts-ignore (guard in case migration hasn't run yet)
    (async () => {
      try { return (prisma as any).guestFavorite ? await (prisma as any).guestFavorite.count() : 0; } catch { return 0; }
    })(),
    // Top performing listings by view count
    prisma.listing.findMany({
      select: {
        id: true,
        title: true,
        viewCount: true,
        clicks: true,
        lastViewedAt: true,
      },
      where: { isActive: true },
      orderBy: { viewCount: 'desc' },
      take: 10,
    }),
    // Recent bookings with details
    prisma.booking.findMany({
      select: {
        id: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        scheduledAt: true,
        status: true,
        listing: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Recent contacts
    prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Recent favorites
    prisma.favorite.findMany({
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        listing: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Recent guest favorites
    (async () => {
      try {
        // @ts-ignore
        if (!(prisma as any).guestFavorite) return [] as any[];
        // @ts-ignore
        const rows = await (prisma as any).guestFavorite.findMany({
          select: { id: true, createdAt: true, sofiaTime: true, listing: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });
        return rows;
      } catch { return [] as any[]; }
    })(),

    // Analytics totals by type for last 30 days (server-side fast aggregates)
    (async () => {
      try {
        // @ts-ignore - guard for environments before migration
        if (!(prisma as any).analyticsEvent) return { listingClicks: 0, agentClicks: 0, contactSubmits: 0 };
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [listingClicks, agentClicks, contactSubmits] = await Promise.all([
          // @ts-ignore
          (prisma as any).analyticsEvent.count({ where: { type: 'LISTING_CLICK', createdAt: { gte: since } } }),
          // @ts-ignore
          (prisma as any).analyticsEvent.count({ where: { type: 'AGENT_CONTACT_CLICK', createdAt: { gte: since } } }),
          // @ts-ignore
          (prisma as any).analyticsEvent.count({ where: { type: 'CONTACT_SUBMIT', createdAt: { gte: since } } }),
        ]);
        return { listingClicks, agentClicks, contactSubmits };
      } catch {
        return { listingClicks: 0, agentClicks: 0, contactSubmits: 0 };
      }
    })(),
    // Top listings by clicks (last 30 days)
    (async () => {
      try {
        // @ts-ignore
        if (!(prisma as any).analyticsEvent) return [] as any[];
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        // @ts-ignore
        const grouped = await (prisma as any).analyticsEvent.groupBy({
          by: ['listingId'],
          where: { listingId: { not: null }, createdAt: { gte: since } },
          _count: { _all: true },
          // Prisma requires a concrete field under _count for orderBy
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
        return withTitles;
      } catch {
        return [] as any[];
      }
    })(),
  ]);

  // Calculate total estimated value from active listings
  const listingsWithPrices = await prisma.listing.findMany({
    where: { isActive: true },
    select: { price: true }
  });
  
  const totalRevenue = listingsWithPrices
    .filter(listing => listing.price != null)
    .reduce((sum, listing) => sum + Number(listing.price), 0);

  // Calculate monthly growth based on recent listings vs previous month
  const previousMonthListings = await prisma.listing.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),  // 30 days ago
      },
    },
  });

  const monthlyGrowth = previousMonthListings > 0 
    ? Math.round(((recentListings - previousMonthListings) / previousMonthListings) * 100)
    : recentListings > 0 ? 100 : 0;

  // Calculate total views from all listings
  const totalViews = listingAnalytics.reduce((sum, listing) => sum + listing.viewCount, 0);
  const sumListingClicks = listingAnalytics.reduce((sum, l) => sum + (Number(l.clicks || 0)), 0);
  const mergedCounts = {
    listingClicks: (analyticsCounts?.listingClicks ?? 0) || sumListingClicks,
    agentClicks: analyticsCounts?.agentClicks ?? 0,
    contactSubmits: analyticsCounts?.contactSubmits ?? 0,
  };
  const totalClicks = (mergedCounts.listingClicks) + (mergedCounts.agentClicks) + (mergedCounts.contactSubmits);

  // Format booking data
  const bookings = recentBookings.map(booking => ({
    id: booking.id,
    contactName: booking.contactName,
    contactEmail: (booking as any).contactEmail,
    contactPhone: (booking as any).contactPhone,
    listingTitle: booking.listing.title,
    scheduledAt: booking.scheduledAt,
    status: booking.status,
  }));

  // Format contacts data (already in correct format)
  const contacts = recentContacts;

  // Format favorites data (combine user + guest)
  const favorites = [
    ...recentFavorites.map(favorite => ({
    id: favorite.id,
    userName: `${favorite.user.firstName || ''} ${favorite.user.lastName || ''}`.trim() || 'Unknown User',
    listingTitle: favorite.listing.title,
    createdAt: favorite.createdAt,
    })),
    ...recentGuestFavorites.map((gf: any) => ({
      id: gf.id,
      userName: 'Guest',
      listingTitle: gf.listing.title,
      createdAt: gf.createdAt,
    })),
  ];

  return {
    totalListings,
    activeListings,
    totalAgents,
    activeAgents,
    totalCategories,
    totalLocations,
    totalRevenue,
    monthlyGrowth,
    recentListings,
    totalBookings,
    pendingBookings,
    totalContacts,
    unreadContacts,
    totalFavorites: totalFavorites + (totalGuestFavorites || 0),
    totalViews,
    totalClicks,
    listingAnalytics: listingAnalytics.map(listing => ({
      ...listing,
    })),
    bookings,
    contacts,
    favorites,
    clickAnalytics: {
      last30d: mergedCounts,
      topListings: (analyticsTopListings && analyticsTopListings.length > 0)
        ? analyticsTopListings
        : listingAnalytics
            .map(l => ({ listingId: l.id, count: Number(l.clicks || 0), listing: { id: l.id, title: l.title } }))
            .filter(r => r.count > 0)
            .sort((a,b) => b.count - a.count)
            .slice(0, 10),
    },
  };
}

export default async function AdminPage() {
  const session = await auth();

  // Handle unauthenticated users
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  // Handle unauthorized users (non-admin)
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
    redirect('/auth/error?error=AccessDenied');
  }

  try {
    const stats = await getDashboardStats();
    return <AdminDashboard stats={stats} />;
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
        <p className="text-gray-600">There was an error loading the dashboard data. Please try again later.</p>
      </div>
    );
  }
}