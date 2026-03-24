import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // Public GET: allow unauthenticated access to view a single listing
    // First fetch the listing; then increment counters in background
    const existing = await prisma.listing.findUnique({
      where: { id: resolvedParams.id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    if (!existing) {
      return new NextResponse('Listing not found', { status: 404 });
    }
    // Increment view counters (do not block response)
    prisma.listing
      .update({
        where: { id: resolvedParams.id },
        data: { viewCount: { increment: 1 }, lastViewedAt: new Date() },
      })
      .catch(() => {});

    return NextResponse.json(existing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const listing = await prisma.listing.update({
      where: { id: resolvedParams.id },
      data,
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // Accepts body: { type: 'LISTING_CLICK' | 'AGENT_CONTACT_CLICK' | 'CONTACT_SUBMIT' }
    const { type } = await req.json();
    if (!type) return new NextResponse('Bad Request', { status: 400 });

    // Debounce duplicate events for same listing/type within short window
    const windowMs = 10 * 1000;
    const since = new Date(Date.now() - windowMs);
    const exists = await (prisma as any).analyticsEvent?.findFirst?.({
      where: { listingId: resolvedParams.id, type, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    });
    if (!exists) {
      await (prisma as any).analyticsEvent?.create?.({
      data: {
        listingId: resolvedParams.id,
        type,
      },
      });

      // For quick totals, also increment clicks on listing for relevant types
      if (type === 'LISTING_CLICK' || type === 'AGENT_CONTACT_CLICK' || type === 'CONTACT_SUBMIT') {
        await prisma.listing.update({ where: { id: resolvedParams.id }, data: { clicks: { increment: 1 } } });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.listing.delete({
      where: { id: resolvedParams.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}