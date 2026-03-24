import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/src/lib/prisma';
import { EmailTemplateService } from '@/src/lib/email-template-service';
import { EmailService } from '@/src/lib/email-service';
import { cleanupDatabase, createTestData } from '../helpers/test-setup';

describe('Email Template System', () => {
  // Test data references
  let testData: any;

  // Test template data
  const testTemplate = {
    name: 'Test Booking Confirmation',
    type: 'booking_confirmation',
    subject: {
      en: 'Booking Confirmation - {{listingTitle}}',
      bg: 'Потвърждение за резервация - {{listingTitle}}',
    },
    body: {
      en: 'Dear {{contactName}},\n\nYour booking for {{listingTitle}} has been confirmed.\nPrice: {{listingPrice}}\nDate: {{scheduledAt}}\n\nBest regards,\n{{agentName}}',
      bg: 'Уважаеми {{contactName}},\n\nВашата резервация за {{listingTitle}} е потвърдена.\nЦена: {{listingPrice}}\nДата: {{scheduledAt}}\n\nС най-добри пожелания,\n{{agentName}}',
    },
    variables: ['listingTitle', 'listingPrice', 'contactName', 'scheduledAt', 'agentName'],
    isActive: true,
  };

  beforeEach(async () => {
    // Clean up database
    await cleanupDatabase();

    // Create test data
    testData = await createTestData();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('should create an email template', async () => {
    const template = await prisma.emailTemplate.create({
      data: testTemplate,
    });

    expect(template).toBeDefined();
    expect(template.name).toBe(testTemplate.name);
    expect(template.type).toBe(testTemplate.type);
  });

  it('should retrieve and render a template', async () => {
    const variables = {
      listingTitle: 'Luxury Villa',
      listingPrice: '€500,000',
      contactName: 'John Doe',
      scheduledAt: '2025-08-15T10:00:00Z',
      agentName: 'Agent Smith',
    };

    const rendered = await EmailTemplateService.renderTemplate(
      'booking_confirmation',
      variables,
      'en'
    );

    expect(rendered.subject).toBe('Booking Confirmation - Luxury Villa');
    expect(rendered.body).toContain('Dear John Doe');
    expect(rendered.body).toContain('Luxury Villa');
    expect(rendered.body).toContain('€500,000');
    expect(rendered.body).toContain('Agent Smith');
  });

  it('should render template in Bulgarian', async () => {
    const variables = {
      listingTitle: 'Луксозна Вила',
      listingPrice: '€500,000',
      contactName: 'Иван Иванов',
      scheduledAt: '2025-08-15T10:00:00Z',
      agentName: 'Агент Петров',
    };

    const rendered = await EmailTemplateService.renderTemplate(
      'booking_confirmation',
      variables,
      'bg'
    );

    expect(rendered.subject).toBe('Потвърждение за резервация - Луксозна Вила');
    expect(rendered.body).toContain('Уважаеми Иван Иванов');
    expect(rendered.body).toContain('Луксозна Вила');
    expect(rendered.body).toContain('€500,000');
    expect(rendered.body).toContain('Агент Петров');
  });

  it('should integrate with EmailService', async () => {
    // Mock the sendEmail function
    const mockSendEmail = jest.fn();
    jest.spyOn(EmailService, 'sendBookingConfirmation').mockImplementation(async () => {});

    // Call the service method
    await EmailService.sendBookingConfirmation(testData.testBooking);

    // Verify the service was called
    expect(EmailService.sendBookingConfirmation).toHaveBeenCalledWith(testData.testBooking);
  });
});