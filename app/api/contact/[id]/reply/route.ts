import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { createResponse, createErrorResponse, handleError } from '@/src/lib/api-utils';
import { sendTextEmail } from '@/src/lib/email';
import { z } from 'zod';

const ReplySchema = z.object({
  subject: z.string().min(3).max(200).optional(),
  message: z.string().min(3).max(5000),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return createErrorResponse('Unauthorized', 401);
    if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return createErrorResponse('Not authorized', 403);
    }

    const body = await request.json();
    const parsed = ReplySchema.safeParse(body);
    if (!parsed.success) {
      return createErrorResponse(parsed.error.message, 400);
    }

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { listing: { select: { agentId: true } } },
    });
    if (!contact) return createErrorResponse('Contact form not found', 404);

    // agents can only reply to their own listing contacts
    if (session.user.role === 'AGENT' && (contact as any).listing?.agentId !== session.user.id) {
      return createErrorResponse('Not authorized to reply', 403);
    }

    const subject = parsed.data.subject || `Re: ${contact.subject}`;
    const sendRes = await sendTextEmail({ to: contact.email, subject }, parsed.data.message);
    if (!(sendRes as any)?.success) {
      return createErrorResponse('Email provider error while sending reply', 502);
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { isRead: true, updatedAt: new Date() },
    });

    return createResponse(updated, 200, 'Reply sent');
  } catch (error) {
    return handleError(error);
  }
}


