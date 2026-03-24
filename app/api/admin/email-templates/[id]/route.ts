import { NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse } from '@/src/lib/api-utils';
import { requireAdmin } from '@/src/lib/api-auth';
import { validateRequest } from '@/src/lib/validation';
import { updateEmailTemplateSchema, previewEmailTemplateSchema } from '@/src/lib/validation/email-template';
import { EmailService } from '@/src/lib/email-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const { id } = await params;
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return createErrorResponse('Email template not found', 404);
    }

    return createResponse(template);
  } catch (error) {

    return createErrorResponse('Failed to fetch email template', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(body, updateEmailTemplateSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const { id } = await params;
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: validatedData.name,
        type: validatedData.type,
        subject: validatedData.subject,
        body: validatedData.body,
        variables: validatedData.variables,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      },
    });

    return createResponse(template, 200, 'Email template updated successfully');
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Email template not found', 404);
    }
    if (error.code === 'P2002') {
      return createErrorResponse('Template name already exists', 400);
    }

    return createErrorResponse('Failed to update email template', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const { id } = await params;
    await prisma.emailTemplate.delete({
      where: { id },
    });

    return createResponse(null, 200, 'Email template deleted successfully');
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Email template not found', 404);
    }

    return createErrorResponse('Failed to delete email template', 500);
  }
}