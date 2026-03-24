import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { z } from 'zod';

const createNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  type: z.enum([
    'NEW_LISTING',
    'BOOKING_CONFIRMED',
    'BOOKING_REQUEST',
    'ALERT_MATCH',
    'CONTACT_FORM',
    'SYSTEM',
    'SECURITY'
  ]),
  title: z.object({
    en: z.string().min(1),
    bg: z.string().min(1).optional(),
    ru: z.string().min(1).optional(),
  }),
  message: z.object({
    en: z.string().min(1),
    bg: z.string().min(1).optional(),
    ru: z.string().min(1).optional(),
  }),
  data: z.object({}).optional(),
});

const markAsReadSchema = z.object({
  isRead: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');

    const whereClause: any = { userId: session.user.id };
    
    if (isRead !== null && isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    if (type) {
      whereClause.type = type;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.notification.count({ where: whereClause });
    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false }
    });

    return createResponse({
      notifications,
      unreadCount,
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

    // Only admins can create notifications for other users
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';
    
    const body = await request.json();
    const validation = validateRequest(body, createNotificationSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    // If userId is provided, only admins can create notifications for other users
    const targetUserId = validatedData.userId || session.user.id;
    
    if (validatedData.userId && validatedData.userId !== session.user.id && !isAdmin) {
      return createErrorResponse('Not authorized to create notifications for other users', 403);
    }

    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: validatedData.type,
        title: validatedData.title,
        message: validatedData.message,
        data: validatedData.data,
      }
    });

    return createResponse(notification, 201, 'Notification created successfully');
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

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return createErrorResponse('Notification ID required', 400);
    }

    const body = await request.json();
    const validation = validateRequest(body, markAsReadSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return createErrorResponse('Notification not found', 404);
    }

    // Users can only mark their own notifications as read
    if (notification.userId !== session.user.id) {
      return createErrorResponse('Not authorized to update this notification', 403);
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { 
        isRead: validatedData.isRead,
        updatedAt: new Date()
      }
    });

    return createResponse(updatedNotification, 200, 'Notification updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

// Mark all notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false
      },
      data: { 
        isRead: true,
        updatedAt: new Date()
      }
    });

    return createResponse({ count: result.count }, 200, `${result.count} notifications marked as read`);
  } catch (error) {
    return handleError(error);
  }
}