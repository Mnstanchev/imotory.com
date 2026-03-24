import { sendEmail } from './email';
import { prisma } from './prisma';
import { EmailTemplateService } from './email-template-service';

export class EmailService {
  static async sendAdminRecentBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            agent: true,
            category: true,
            location: true,
          },
        },
        user: true,
        agent: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const listingTitle = booking.listing?.title
      ? (typeof booking.listing.title === 'object' && booking.listing.title && 'en' in (booking.listing.title as any)
          ? (booking.listing.title as any).en || 'Listing'
          : 'Listing')
      : 'Listing';

    const subject = `[Recent Booking] ${listingTitle} — ${booking.visitType}`;

    const bodyLines = [
      `A new booking was created:`,
      ``,
      `Booking ID: ${booking.id}`,
      `Status: ${booking.status}`,
      `Visit Type: ${booking.visitType}`,
      `Scheduled At: ${booking.scheduledAt.toISOString()}`,
      `Duration: ${booking.duration} minutes`,
      ``,
      `Listing: ${listingTitle}`,
      booking.listing ? `Price: ${booking.listing.price} ${booking.listing.currency}` : undefined,
      booking.listing?.category ? `Category: ${(booking.listing.category as any)?.name?.en || ''}` : undefined,
      booking.listing?.location ? `Location: ${(booking.listing.location as any)?.name?.en || ''}` : undefined,
      ``,
      `Agent: ${booking.agent?.email || booking.listing?.agent?.email || ''}`,
      booking.listing?.agent?.name ? `Agent Name: ${(booking.listing.agent.name as any)?.en || ''}` : undefined,
      booking.listing?.agent?.phone ? `Agent Phone: ${booking.listing.agent.phone}` : undefined,
      ``,
      `Contact Name: ${booking.contactName}`,
      `Contact Email: ${booking.contactEmail}`,
      `Contact Phone: ${booking.contactPhone}`,
      booking.user ? `User ID: ${booking.user.id}` : undefined,
      ``,
      `Message:`,
      `${booking.message || '-'}`,
    ].filter(Boolean) as string[];

    await sendEmail(
      {
        to: process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com',
        subject,
        replyTo: booking.contactEmail,
      },
      bodyLines.join('\n')
    );
  }
  static async sendBookingConfirmation(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        agent: true,
        user: true
      }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const listingTitle = booking.listing?.title 
      ? (typeof booking.listing.title === 'object' && booking.listing.title && 'en' in booking.listing.title 
         ? (booking.listing.title as any).en || 'Listing' 
         : 'Listing')
      : 'Listing';
    const agentName = booking.agent?.name 
      ? (typeof booking.agent.name === 'object' && booking.agent.name && 'en' in booking.agent.name 
         ? (booking.agent.name as any).en || 'Agent' 
         : 'Agent')
      : 'Agent';
    
    // Client confirmation template with graceful fallback
    let subject = '';
    let body = '';
    try {
      const rendered = await EmailTemplateService.renderTemplate(
        'booking_confirmation',
        {
          bookingId: booking.id,
          listingTitle,
          listingPrice: `${booking.listing.price} ${booking.listing.currency}`,
          agentName,
          agentEmail: booking.agent.email,
          scheduledAt: booking.scheduledAt.toISOString(),
          duration: booking.duration.toString(),
          visitType: booking.visitType,
          contactName: booking.contactName,
          contactEmail: booking.contactEmail,
          contactPhone: booking.contactPhone,
          message: booking.message || ''
        }
      );
      subject = rendered.subject;
      body = rendered.body;
    } catch {
      subject = `Viewing request received for ${listingTitle}`;
      body = `Hello ${booking.contactName},\n\n` +
        `We've received your request to view "${listingTitle}" (${booking.listing.price} ${booking.listing.currency}).\n` +
        `Requested time: ${booking.scheduledAt.toISOString()} (${booking.duration} min).\n` +
        `Agent: ${agentName} (${booking.agent.email}).\n\n` +
        `We will get back to you shortly.\n\n` +
        `— Property Website`;
    }

    await sendEmail({
      to: booking.contactEmail,
      subject,
      replyTo: booking.agent.email,
    }, body);

    // Agent/admin notification with graceful fallback
    let agentSubject = '';
    let agentBody = '';
    try {
      const renderedAgent = await EmailTemplateService.renderTemplate(
        'agent_notification',
        {
          agentName,
          bookingId: booking.id,
          listingTitle,
          listingPrice: `${booking.listing.price} ${booking.listing.currency}`,
          scheduledAt: booking.scheduledAt.toISOString(),
          duration: booking.duration.toString(),
          visitType: booking.visitType,
          contactName: booking.contactName,
          contactEmail: booking.contactEmail,
          contactPhone: booking.contactPhone,
          message: booking.message || ''
        }
      );
      agentSubject = renderedAgent.subject;
      agentBody = renderedAgent.body;
    } catch {
      agentSubject = `New viewing request: ${listingTitle}`;
      agentBody = `Agent ${agentName},\n\n` +
        `A customer requested a viewing for "${listingTitle}".\n` +
        `When: ${booking.scheduledAt.toISOString()} (${booking.duration} min)\n` +
        `Contact: ${booking.contactName} — ${booking.contactEmail}, ${booking.contactPhone}\n` +
        `Message: ${booking.message || '-'}\n\n` +
        `Booking ID: ${booking.id}`;
    }

    await sendEmail({
      to: [booking.agent.email, process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com'],
      subject: agentSubject,
      replyTo: booking.contactEmail,
    }, agentBody);
  }

  static async sendContactFormNotification(contactFormId: string) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactFormId },
      include: {
        listing: true
      }
    });

    if (!contact) {
      throw new Error('Contact form not found');
    }

    const listingTitle = contact.listing?.title 
      ? (typeof contact.listing.title === 'object' && contact.listing.title && 'en' in contact.listing.title 
         ? (contact.listing.title as any).en || 'Listing' 
         : 'Listing')
      : 'Listing';
    const listingPrice = contact.listing ? `${contact.listing.price} ${contact.listing.currency}` : undefined;

    const adminNotification = await EmailTemplateService.renderTemplate(
      'contact_form_admin',
      {
        contactFormId: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        subject: contact.subject,
        message: contact.message,
        listingTitle,
        listingPrice: listingPrice || ''
      }
    );

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com',
      subject: `[Recent Contact] ${adminNotification.subject}`,
    }, adminNotification.body);

    // If it's a property inquiry, also notify the agent
    if (contact.listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: contact.listingId },
        include: { agent: true }
      });

      if (listing?.agent?.email) {
        const agentNotification = await EmailTemplateService.renderTemplate(
          'contact_form_agent',
          {
            contactFormId: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone || '',
            subject: contact.subject,
            message: contact.message,
            listingTitle,
            listingPrice: listingPrice || ''
          }
        );

        await sendEmail({
          to: listing.agent.email,
          subject: agentNotification.subject,
        }, agentNotification.body);
      }
    }
  }

  static async sendFavoriteNotification(userId: string, listingId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!user || !listing) return;

    const listingTitle = listing.title 
      ? (typeof listing.title === 'object' && listing.title && 'en' in listing.title 
         ? (listing.title as any).en || 'Listing' 
         : 'Listing')
      : 'Listing';
    
    const notification = await EmailTemplateService.renderTemplate(
      'favorite_notification',
      {
        userName: user.firstName || 'User',
        userEmail: user.email,
        listingTitle,
      }
    );

    await sendEmail({
      to: user.email,
      subject: notification.subject,
    }, notification.body);
  }

  static async sendNotificationEmail({
    to,
    subject,
    message,
    type
  }: {
    to: string;
    subject: string;
    message: string;
    type: string;
  }) {
    const notification = await EmailTemplateService.renderTemplate(
      'general_notification',
      {
        userEmail: to,
        subject,
        message,
        type
      }
    );

    await sendEmail(
      {
        to,
        subject: notification.subject,
      },
      notification.body
    );
  }

  static async sendTestEmail(testEmail: string, template: any) {
    // For test emails, we'll send the template with default/sample variables
    const sampleVariables: Record<string, string> = {};
    
    // Generate sample values for template variables
    if (template.variables && Array.isArray(template.variables)) {
      template.variables.forEach((variable: string) => {
        sampleVariables[variable] = `[Sample ${variable}]`;
      });
    }

    // Use the template's subject and body directly
    const subject = template.subject?.en || 'Test Email';
    const body = template.body?.en || 'Test email body';

    // Replace variables with sample values
    let processedSubject = subject;
    let processedBody = body;

    Object.entries(sampleVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedBody = processedBody.replace(regex, value);
    });

    await sendEmail({
      to: testEmail,
      subject: `[TEST] ${processedSubject}`,
    }, processedBody);
  }
}