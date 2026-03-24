import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { z } from 'zod';

const updateContactSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESPONDED', 'CLOSED']).optional(),
  notes: z.string().max(1000).optional(),
  response: z.string().max(2000).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const contactForm = await prisma.contact.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            propertyType: true,
            bedrooms: true,
            bathrooms: true,
            livingRooms: true,
            size: true,
            yearBuilt: true,
            images: true,
          }
        } as any,
      },
    });

    if (!contactForm) {
      return createErrorResponse('Contact form not found', 404);
    }

    // Check authorization
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      // Check if user is the agent for the listing
      isAuthorized = contactForm.listing?.agentId === session.user.id;
    } else {
      // Regular users can only see their own contact forms if they submitted them
      isAuthorized = contactForm.email === session.user.email;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to view this contact form', 403);
    }

    return createResponse(contactForm);
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

    // Only agents and admins can update contact forms
    if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const body = await request.json();
    const validation = validateRequest(body, updateContactSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const contactForm = await prisma.contact.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: { agentId: true }
        },
        // Note: agent relation removed as it doesn't exist in schema
      }
    });

    if (!contactForm) {
      return createErrorResponse('Contact form not found', 404);
    }

    // Check authorization
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      // Check if user is the agent for the listing
      isAuthorized = contactForm.listing?.agentId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to update this contact form', 403);
    }

    const updatedContact = await prisma.contact.update({
      where: { id: id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        listing: {
          include: {
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            },
            // Note: images relation removed as it doesn't exist in schema
          }
        },
        // Note: agent relation removed as it doesn't exist in schema
      }
    });

    return createResponse(updatedContact, 200, 'Contact form updated successfully');
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

    // Only agents and admins can delete contact forms
    if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const contactForm = await prisma.contact.findUnique({
      where: { id: id },
      include: {
        listing: {
          select: { agentId: true }
        },
        // Note: agent relation removed as it doesn't exist in schema
      }
    });

    if (!contactForm) {
      return createErrorResponse('Contact form not found', 404);
    }

    // Check authorization
    let isAuthorized = false;
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'AGENT') {
      // Check if user is the agent for the listing
      isAuthorized = contactForm.listing?.agentId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to delete this contact form', 403);
    }

    await prisma.contact.delete({
      where: { id: id }
    });

    return createResponse({}, 200, 'Contact form deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}