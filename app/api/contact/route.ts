import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { EmailService } from '@/src/lib/email-service';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  // Accept any non-empty string; we'll verify existence in DB below
  listingId: z.string().min(1).optional(),
  agentId: z.string().min(1).optional(),
});

const updateContactSchema = z.object({
  isRead: z.boolean(),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(body, contactSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    // Validate listing if provided
    if (validatedData.listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: validatedData.listingId },
        select: { id: true, title: true, agentId: true }
      });

      if (!listing) {
        return createErrorResponse('Listing not found', 404);
      }
    }

    // Validate agent if provided
    if (validatedData.agentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: validatedData.agentId },
        select: { id: true, name: true, email: true }
      });

      if (!agent) {
        return createErrorResponse('Agent not found', 404);
      }
    }

    const contactForm = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        listingId: validatedData.listingId,
        // Note: userId field removed as it may not be nullable in schema
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
                    // Note: agent relation removed as it doesn't exist in schema
          }
        },
        // Note: agent relation removed as it doesn't exist in schema
      }
    });

    // Send email notifications
    try {
      await EmailService.sendContactFormNotification(contactForm.id);
    } catch (emailError) {
      console.error('Failed to send contact form notifications:', emailError);
      // Don't fail the contact form submission if email fails
    }

    return createResponse(contactForm, 201, 'Contact form submitted successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Only agents and admins can view contact forms
    if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isRead = searchParams.get('isRead');
    const agentId = searchParams.get('agentId');

    const whereClause: any = {};
    
    if (isRead !== null && isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    // Agents can only see forms for their listings (agentId field removed from Contact model)
    if (session.user.role === 'AGENT') {
      whereClause.listing = { agentId: session.user.id };
    }

    // Filter by specific agent if provided and user is admin (filter by listing agent)
    if (agentId && ['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      whereClause.listing = { agentId };
    }

    const contactForms = await prisma.contact.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
                    // Note: agent relation removed as it doesn't exist in schema,
            // Note: images relation removed as it doesn't exist in schema
          }
        },
        // Note: agent relation removed as it doesn't exist in schema
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.contact.count({ where: whereClause });

    return createResponse({
      contactForms,
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

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Only agents and admins can update contact forms
    if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return createErrorResponse('Contact ID required', 400);
    }

    const body = await request.json();
    const validation = validateRequest(body, updateContactSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const contactForm = await prisma.contact.findUnique({
      where: { id: contactId },
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
      // Check if user is the agent for the listing (agentId field removed from Contact model)
      isAuthorized = contactForm.listing?.agentId === session.user.id;
    }

    if (!isAuthorized) {
      return createErrorResponse('Not authorized to update this contact form', 403);
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        isRead: validatedData.isRead,
        // Note: notes field removed as it doesn't exist in Contact model
        updatedAt: new Date()
      },
      include: {
        listing: {
          include: {
                    // Note: agent relation removed as it doesn't exist in schema,
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