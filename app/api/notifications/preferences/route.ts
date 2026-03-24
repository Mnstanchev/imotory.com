import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { validateRequest } from '@/src/lib/validation';
import { z } from 'zod';

const preferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  notifyNewListings: z.boolean().optional(),
  notifyBookings: z.boolean().optional(),
  notifyAlerts: z.boolean().optional(),
  notifyMessages: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id }
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId: session.user.id,
        }
      });
    }

    return createResponse(preferences, 200, 'Notification preferences retrieved successfully');
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

    const body = await request.json();
    const validation = validateRequest(body, preferencesSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: {
        ...validatedData,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        ...validatedData,
      }
    });

    return createResponse(preferences, 200, 'Notification preferences updated successfully');
  } catch (error) {
    return handleError(error);
  }
}