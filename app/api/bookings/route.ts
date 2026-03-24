import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { EmailService } from '@/src/lib/email-service';
import { z } from 'zod';

const bookingSchema = z.object({
  listingId: z.string().min(8),
  visitType: z.enum(['VIEWING', 'INSPECTION', 'CONSULTATION']),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().min(15).max(240),
  contactName: z.string().min(2).max(100),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6).max(20),
  message: z.string().min(10).max(1000).optional(),
});

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().max(500).optional(),
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
    const status = searchParams.get('status') as any;

    // Scope results based on role
    let whereClause: any = {};
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      whereClause = {};
    } else if (session.user.role === 'AGENT') {
      whereClause = { listing: { agentId: session.user.id } };
    } else {
      whereClause = { userId: session.user.id };
    }
    if (status && ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      whereClause.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
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
            }
            // Note: images relation removed as it doesn't exist in schema
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.booking.count({ where: whereClause });

    return createResponse({
      bookings,
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

    const body = await request.json();
    const validation = validateRequest(body, bookingSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    // Resolve optional userId only if the user actually exists in DB
    let resolvedUserId: string | null = null;
    if (session?.user?.id) {
      try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (user) resolvedUserId = user.id;
      } catch {}
    }

    // Check if listing exists and is active
    const listing = await prisma.listing.findUnique({
      where: { 
        id: validatedData.listingId,
        isActive: true 
      },
      include: {
        agent: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (!listing) {
      return createErrorResponse('Listing not found or not active', 404);
    }

    const booking = await prisma.booking.create({
      data: {
        listingId: validatedData.listingId,
        userId: resolvedUserId,
        agentId: listing.agentId,
        visitType: validatedData.visitType,
        scheduledAt: new Date(validatedData.scheduledAt),
        duration: validatedData.duration,
        contactName: validatedData.contactName,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        message: validatedData.message,
        status: 'PENDING',
      },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            }
            // Note: images relation removed as it doesn't exist in schema
          }
        }
      }
    });

    // Notify admin immediately for recent bookings
    try {
      await EmailService.sendAdminRecentBooking(booking.id);
    } catch (e) {
      console.error('Failed to send admin booking notification', e);
    }

    return createResponse(booking, 201, 'Booking request submitted successfully');
  } catch (error) {
    return handleError(error);
  }
}

// Admin endpoints for managing bookings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return createErrorResponse('Booking ID required', 400);
    }

    const body = await request.json();
    const validation = validateRequest(body, updateBookingSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: { agentId: true }
        }
      }
    });

    if (!booking) {
      return createErrorResponse('Booking not found', 404);
    }

    // Check if user is the agent who owns the listing or admin
    const isAuthorized = session.user.role === 'ADMIN' || 
                        session.user.role === 'SUPERADMIN' ||
                        booking.listing.agentId === session.user.id;

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to update this booking', 403);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: validatedData.status,
        message: validatedData.notes || booking.message,
        updatedAt: new Date()
      },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            }
            // Note: images relation removed as it doesn't exist in schema
          }
        }
      }
    });

    return createResponse(updatedBooking, 200, 'Booking updated successfully');
  } catch (error) {
    return handleError(error);
  }
}