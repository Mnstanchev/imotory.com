import { NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, parseQueryParams } from '@/src/lib/api-utils';
import { requireAdmin } from '@/src/lib/api-auth';
import { validateRequest } from '@/src/lib/validation';
import { emailTemplateSchema } from '@/src/lib/validation/email-template';
import { EmailService } from '@/src/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [templates, total] = await Promise.all([
      prisma.emailTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.emailTemplate.count({ where }),
    ]);

    return createResponse({
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {

    return createErrorResponse('Failed to fetch email templates', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(body, emailTemplateSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    const template = await prisma.emailTemplate.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        subject: validatedData.subject,
        body: validatedData.body,
        variables: validatedData.variables || [],
        isActive: validatedData.isActive ?? true,
      },
    });

    return createResponse(template, 201, 'Email template created successfully');
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('Template name already exists', 400);
    }

    return createErrorResponse('Failed to create email template', 500);
  }
}