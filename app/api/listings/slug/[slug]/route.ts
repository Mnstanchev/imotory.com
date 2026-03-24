import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const existing = await prisma.listing.findUnique({
      where: { slug },
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
        where: { id: existing.id },
        data: { viewCount: { increment: 1 }, lastViewedAt: new Date() },
      })
      .catch(() => {});

    return NextResponse.json(existing);
  } catch (error) {
    console.error('Error fetching listing by slug:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


