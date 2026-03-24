import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { z } from 'zod';

const favoriteSchema = z.object({
  listingId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            },
            category: {
              select: { id: true, name: true, slug: true }
            },
            location: {
              select: { id: true, name: true, slug: true, type: true }
            },
            // Note: images relation removed as it doesn't exist in schema
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.favorite.count({
      where: { userId: session.user.id }
    });

    return createResponse({
      favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validation = validateRequest(body, favoriteSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: validatedData.listingId }
    });

    if (!listing) {
      return createErrorResponse('Listing not found', 404);
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: validatedData.listingId
        }
      }
    });

    if (existingFavorite) {
      return createErrorResponse('Already favorited', 400);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        listingId: validatedData.listingId
      },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true }
            },
            // Note: images relation removed as it doesn't exist in schema
          }
        }
      }
    });

    return createResponse(favorite, 201, 'Added to favorites');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return createErrorResponse('Listing ID required', 400);
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId
        }
      }
    });

    if (!favorite) {
      return createErrorResponse('Favorite not found', 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId
        }
      }
    });

    return createResponse({ message: 'Removed from favorites' }, 200);
  } catch (error) {
    return handleError(error);
  }
}