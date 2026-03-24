import { NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse } from '@/src/lib/api-utils';
import { requireAdmin } from '@/src/lib/api-auth';
import { validateRequest } from '@/src/lib/validation';
import { previewEmailTemplateSchema } from '@/src/lib/validation/email-template';
import { EmailService } from '@/src/lib/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(body, previewEmailTemplateSchema);
    
    if (!validation.success) {
      return validation.error;
    }
    
    const validatedData = validation.data;

    // Get the template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!template) {
      return createErrorResponse('Email template not found', 404);
    }

    // Replace variables in subject and body
    const previewData = {
      subject: validatedData.subject,
      body: validatedData.body,
    };

    if (validatedData.variables) {
      Object.entries(validatedData.variables).forEach(([key, value]) => {
        const stringValue = String(value);
        // Replace variables in subject
        Object.keys(previewData.subject).forEach((lang) => {
          const langKey = lang as keyof typeof previewData.subject;
          if (previewData.subject[langKey]) {
            previewData.subject[langKey] = previewData.subject[langKey]!.replace(
              new RegExp(`{{${key}}}`, 'g'),
              stringValue
            );
          }
        });

        // Replace variables in body
        Object.keys(previewData.body).forEach((lang) => {
          const langKey = lang as keyof typeof previewData.body;
          if (previewData.body[langKey]) {
            previewData.body[langKey] = previewData.body[langKey]!.replace(
              new RegExp(`{{${key}}}`, 'g'),
              stringValue
            );
          }
        });
      });
    }

    return createResponse({
      preview: previewData,
      template,
    });
  } catch (error) {

    return createErrorResponse('Failed to preview email template', 500);
  }
}

// Test send endpoint
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const authResult = await requireAdmin(request);
    if (!authResult.success) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (!testEmail) {
      return createErrorResponse('Test email address required', 400);
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!template) {
      return createErrorResponse('Email template not found', 404);
    }

    // Send test email
    await EmailService.sendTestEmail(testEmail, template);

    return createResponse(null, 200, 'Test email sent successfully');
  } catch (error) {

    return createErrorResponse('Failed to send test email', 500);
  }
}