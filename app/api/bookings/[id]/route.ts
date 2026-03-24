import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { z } from 'zod';

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  notes: z.string().max(500).optional(),
  response: z.string().max(1000).optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().min(15).max(240).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
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
        },
        user: {
          select: { id: true, email: true }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check authorization
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      isAuthorized = booking.listing.agentId === session.user.id;
    } else {
      isAuthorized = booking.userId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to view this booking', 403);
    }

    return createResponse(booking);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validation = validateRequest(body, updateBookingSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: { agentId: true }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check authorization
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      isAuthorized = booking.listing.agentId === session.user.id;
    } else {
      isAuthorized = booking.userId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to update this booking', 403);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status: validatedData.status,
        message: validatedData.response || booking.message,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : booking.scheduledAt,
        duration: validatedData.duration ?? booking.duration,
        updatedAt: new Date()
      },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            }
          }
        }
      }
    });

    // If status transitioned to CONFIRMED, send emails now
    if (validatedData.status === 'CONFIRMED') {
      try {
        const { EmailService } = await import('@/src/lib/email-service');
        await EmailService.sendBookingConfirmation(updatedBooking.id);
      } catch (e) {
        console.error('Failed to send confirmation emails:', e);
      }
    }

    return createResponse(updatedBooking, 200, 'Booking updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: { agentId: true }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check authorization - only admin or agent can delete
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      isAuthorized = booking.listing.agentId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to delete this booking', 403);
    }

    await prisma.booking.delete({
      where: { id: id }
    });

    return createResponse({ message: 'Booking deleted successfully' }, 200);
  } catch (error) {
    return handleError(error);
  }
}