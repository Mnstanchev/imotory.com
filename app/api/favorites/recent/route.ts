import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '5', 10)));
    const offset = (page - 1) * limit;

    // counts
    const totalUser = await prisma.favorite.count();
    // @ts-ignore
    const totalGuest = (prisma as any).guestFavorite ? await (prisma as any).guestFavorite.count() : 0;
    const total = totalUser + totalGuest;

    // fetch enough from each source to cover merge window (offset + limit)
    const takeWindow = offset + limit;
    const [userRows, guestRows] = await Promise.all([
      prisma.favorite.findMany({
        select: {
          id: true,
          createdAt: true,
          user: { select: { firstName: true, lastName: true } },
          listing: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: takeWindow,
      }),
      // @ts-ignore
      (prisma as any).guestFavorite
        ? // @ts-ignore
          (prisma as any).guestFavorite.findMany({
            select: { id: true, createdAt: true, sofiaTime: true, listing: { select: { title: true } } },
            orderBy: { createdAt: 'desc' },
            take: takeWindow,
          })
        : Promise.resolve([]),
    ]);

    type Item = { id: string; createdAt: Date; userName: string; listingTitle: any; source: 'user' | 'guest' };
    const mapped: Item[] = [
      ...userRows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        userName: `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || 'Unknown User',
        listingTitle: r.listing?.title,
        source: 'user' as const,
      })),
      ...guestRows.map((r: any) => ({
        id: r.id,
        createdAt: r.createdAt,
        userName: 'Guest',
        listingTitle: r.listing?.title,
        source: 'guest' as const,
      })),
    ];

    const sorted = mapped.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
    const pageItems = sorted.slice(offset, offset + limit);

    return createResponse(
      {
        items: pageItems,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
        },
      },
      200
    );
  } catch (error) {
    return handleError(error);
  }
}


