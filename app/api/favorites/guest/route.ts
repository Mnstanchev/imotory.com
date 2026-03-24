import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { z } from 'zod';

const guestFavoriteSchema = z.object({
  listingId: z.string().min(1),
  sofiaTime: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = guestFavoriteSchema.safeParse(body);
    if (!parsed.success) {
      return createErrorResponse('Validation failed', 400, parsed.error.issues.map(i => i.message).join(', '));
    }
    const { listingId, sofiaTime } = parsed.data;

    // Validate listing exists
    const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } });
    if (!listing) {
      return createErrorResponse('Listing not found', 404);
    }

    // Ensure model exists; if not, return a clear error so frontend can surface it
    // @ts-ignore
    if (!(prisma as any).guestFavorite) {
      return createErrorResponse('Guest favorites model not available. Run prisma migrate and generate.', 501);
    }

    // Debounce duplicate for same listing within a short window
    const since = new Date(Date.now() - 5 * 60 * 1000);
    // @ts-ignore
    const recent = await (prisma as any).guestFavorite.findFirst({
      where: { listingId, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    });
    let created = false;
    if (!recent) {
      // @ts-ignore
      await (prisma as any).guestFavorite.create({ data: { listingId, sofiaTime } });
      created = true;
    }

    // @ts-ignore
    const totalForListing = await (prisma as any).guestFavorite.count({ where: { listingId } });
    return createResponse({ ok: true, listingId, sofiaTime, created, totalForListing }, 201, 'Guest favorite logged');
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    // @ts-ignore
    if (!(prisma as any).guestFavorite) {
      return createErrorResponse('Guest favorites model not available. Run prisma migrate and generate.', 501);
    }
    // @ts-ignore
    const rows = await (prisma as any).guestFavorite.findMany({
      select: { id: true, createdAt: true, sofiaTime: true, listing: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json({ success: true, data: { guestFavorites: rows } });
  } catch (error) {
    return handleError(error);
  }
}


