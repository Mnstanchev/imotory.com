import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import { prisma } from '@/src/lib/prisma';
import { EmailService } from '@/src/lib/email-service';
import { sendEmail } from '@/src/lib/email';
import { cleanupDatabase, createTestData } from '../helpers/test-setup';

// Mock the email sending function
jest.mock('@/src/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, data: { id: 'mock-email-id' } })
}));

describe('Email Notifications Tests', () => {
  let testData: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Clean up database
    await cleanupDatabase();

    // Create test data
    testData = await createTestData();

    // Create required email templates
    await prisma.emailTemplate.createMany({
      data: [
        {
          name: 'Favorite Notification',
          type: 'favorite_notification',
          subject: {
            en: 'Property Added to Favorites',
            bg: 'Имот добавен в любими'
          },
          body: {
            en: 'Dear {{userName}},\n\nThe property "{{listingTitle}}" has been added to your favorites.',
            bg: 'Уважаеми {{userName}},\n\nИмотът "{{listingTitle}}" беше добавен в любимите ви.'
          },
          variables: ['userName', 'listingTitle'],
          isActive: true
        },
        {
          name: 'General Notification',
          type: 'general_notification',
          subject: {
            en: '{{subject}}',
            bg: '{{subject}}'
          },
          body: {
            en: '{{message}}',
            bg: '{{message}}'
          },
          variables: ['userEmail', 'subject', 'message', 'type'],
          isActive: true
        },
        {
          name: 'Contact Form Admin Notification',
          type: 'contact_form_admin',
          subject: {
            en: 'New Contact Form Submission',
            bg: 'Ново съобщение от контактната форма'
          },
          body: {
            en: 'Contact Form Details:\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nSubject: {{subject}}\nMessage: {{message}}\nListing: {{listingTitle}}\nPrice: {{listingPrice}}',
            bg: 'Детайли от контактната форма:\nИме: {{name}}\nИмейл: {{email}}\nТелефон: {{phone}}\nОтносно: {{subject}}\nСъобщение: {{message}}\nИмот: {{listingTitle}}\nЦена: {{listingPrice}}'
          },
          variables: ['name', 'email', 'phone', 'subject', 'message', 'listingTitle', 'listingPrice'],
          isActive: true
        },
        {
          name: 'Contact Form Agent Notification',
          type: 'contact_form_agent',
          subject: {
            en: 'New Property Inquiry',
            bg: 'Ново запитване за имот'
          },
          body: {
            en: 'Property Inquiry Details:\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nSubject: {{subject}}\nMessage: {{message}}\nListing: {{listingTitle}}\nPrice: {{listingPrice}}',
            bg: 'Детайли за запитването:\nИме: {{name}}\nИмейл: {{email}}\nТелефон: {{phone}}\nОтносно: {{subject}}\nСъобщение: {{message}}\nИмот: {{listingTitle}}\nЦена: {{listingPrice}}'
          },
          variables: ['name', 'email', 'phone', 'subject', 'message', 'listingTitle', 'listingPrice'],
          isActive: true
        }
      ]
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('Favorite Notifications', () => {
    it('should send favorite notification email', async () => {
      await EmailService.sendFavoriteNotification(testData.testUser.id, testData.testListing.id);

      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testData.testUser.email,
          subject: expect.any(String)
        }),
        expect.stringContaining(testData.testUser.firstName)
      );
    });

    it('should handle missing user or listing gracefully', async () => {
      await EmailService.sendFavoriteNotification('non-existent-user', testData.testListing.id);
      await EmailService.sendFavoriteNotification(testData.testUser.id, 'non-existent-listing');

      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('General Notifications', () => {
    it('should send general notification email', async () => {
      const notification = {
        to: 'test@example.com',
        subject: 'Test Notification',
        message: 'This is a test notification',
        type: 'test'
      };

      await EmailService.sendNotificationEmail(notification);

      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: notification.to,
          subject: expect.stringContaining(notification.subject)
        }),
        expect.stringContaining(notification.message)
      );
    });
  });

  describe('Contact Form Notifications', () => {
    it('should send notifications for property inquiries to both admin and agent', async () => {
      // Create a contact form with listing reference
      const contact = await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Property Inquiry',
          message: 'I am interested in this property',
          listing: { connect: { id: testData.testListing.id } }
        }
      });

      await EmailService.sendContactFormNotification(contact.id);

      // Should send to both admin and agent
      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com'
        }),
        expect.any(String)
      );
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testData.testAgent.email
        }),
        expect.any(String)
      );
    });

    it('should send only admin notification for general contact forms', async () => {
      // Create a contact form without listing reference
      const contact = await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'General Inquiry',
          message: 'I have a general question'
        }
      });

      await EmailService.sendContactFormNotification(contact.id);

      // Should only send to admin
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com'
        }),
        expect.any(String)
      );
    });
  });

  describe('Template Variable Handling', () => {
    it('should handle missing optional variables gracefully', async () => {
      const contact = await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Test',
          message: 'Test message'
          // Intentionally omitting phone
        }
      });

      await EmailService.sendContactFormNotification(contact.id);

      expect(sendEmail).toHaveBeenCalledTimes(1);
      // Verify the email was sent successfully despite missing optional fields
      expect(sendEmail).toHaveBeenCalledWith(
        expect.any(Object),
        expect.not.stringContaining('undefined')
      );
    });

    it('should handle multilingual listing titles', async () => {
      // Create a listing with multilingual title
      const listing = await prisma.listing.create({
        data: {
          title: { en: 'English Title', bg: 'Bulgarian Title' },
          description: { en: 'Test description', bg: 'Тестово описание' },
          propertyType: 'HOUSE',
          listingType: 'SALE',
          price: 100000,
          currency: 'EUR',
          slug: 'test-listing-' + Date.now(),
          agent: { connect: { id: testData.testAgent.id } },
          category: { connect: { id: testData.testCategory.id } },
          location: { connect: { id: testData.testLocation.id } }
        }
      });

      const contact = await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Property Inquiry',
          message: 'Test message',
          listing: { connect: { id: listing.id } }
        }
      });

      await EmailService.sendContactFormNotification(contact.id);

      // Verify the English title was used in the email
      expect(sendEmail).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringContaining('English Title')
      );
    });
  });
});