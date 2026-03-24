import { EmailService } from '@/src/lib/email-service';
import { prisma } from '@/src/lib/prisma';
import { sendEmail } from '@/src/lib/email';

// Mock email sending to avoid actual API calls during tests
jest.mock('@/src/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, data: { id: 'mock-email-id' } })
}));

describe('Email Integration Tests', () => {
  let testUser: any;
  let testAgent: any;
  let testListing: any;
  let testCategory: any;
  let testLocation: any;
  let testBooking: any;
  let testContact: any;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up
    await prisma.favorite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.category.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();

    // Create test data
    testUser = await prisma.user.create({
      data: {
        email: 'test-user@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      }
    });

    testAgent = await prisma.agent.create({
      data: {
        name: JSON.stringify({ en: 'Test Agent' }),
        email: 'test-agent@example.com',
        phone: '+1234567890',
        bio: JSON.stringify({ en: 'Test agent bio' })
      }
    });

    testCategory = await prisma.category.create({
      data: {
        name: JSON.stringify({ en: 'Test Category' }),
        slug: 'test-category'
      }
    });

    testLocation = await prisma.location.create({
      data: {
        name: JSON.stringify({ en: 'Test City' }),
        slug: 'test-city',
        type: 'CITY'
      }
    });

    testListing = await prisma.listing.create({
      data: {
        title: JSON.stringify({ en: 'Test Property' }),
        description: JSON.stringify({ en: 'Test description' }),
        price: 100000,
        currency: 'USD',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: 'test-property-123',
        agentId: testAgent.id,
        categoryId: testCategory.id,
        locationId: testLocation.id,
        isActive: true,
        features: ['parking'],
        images: ['test-image.jpg']
      }
    });

    testBooking = await prisma.booking.create({
      data: {
        listingId: testListing.id,
        userId: testUser.id,
        agentId: testAgent.id,
        visitType: 'VIEWING',
        scheduledAt: new Date(Date.now() + 86400000),
        duration: 60,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        message: 'I would like to schedule a viewing'
      }
    });

    testContact = await prisma.contact.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        subject: 'Property Inquiry',
        message: 'I am interested in this property',
        listingId: testListing.id
      }
    });
  });

  describe('EmailService', () => {
    it('should send booking confirmation emails', async () => {
      await EmailService.sendBookingConfirmation(testBooking.id);

      expect(sendEmail).toHaveBeenCalledTimes(2);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'john@example.com',
          subject: expect.stringContaining('Booking Confirmed')
        }),
        expect.any(Object)
      );
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test-agent@example.com',
          subject: expect.stringContaining('New Booking Request')
        }),
        expect.any(Object)
      );
    });

    it('should send contact form notification emails', async () => {
      await EmailService.sendContactFormNotification(testContact.id);

      // Contact form notifications send to admin + agent for property inquiries
      expect(sendEmail).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('New Contact Form')
        }),
        expect.any(Object)
      );
    });

    it('should handle missing booking gracefully', async () => {
      await expect(
        EmailService.sendBookingConfirmation('non-existent-id')
      ).rejects.toThrow('Booking not found');
    });

    it('should handle missing contact form gracefully', async () => {
      await expect(
        EmailService.sendContactFormNotification('non-existent-id')
      ).rejects.toThrow('Contact form not found');
    });

    it('should handle email service failures gracefully', async () => {
      // Mock email failure
      (sendEmail as jest.Mock).mockResolvedValueOnce({ success: false, error: 'API Error' });

      // Should not throw, just log the error
      await expect(
        EmailService.sendBookingConfirmation(testBooking.id)
      ).resolves.not.toThrow();
    });
  });

  describe('Email Templates', () => {
    it('should render booking confirmation template', async () => {
      const { BookingConfirmationTemplate } = require('@/src/lib/email-templates');
      const template = BookingConfirmationTemplate({
        bookingId: testBooking.id,
        listingTitle: 'Test Property',
        listingPrice: '100000 USD',
        agentName: 'Test Agent',
        agentEmail: 'test-agent@example.com',
        scheduledAt: new Date().toISOString(),
        duration: 60,
        visitType: 'VIEWING',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        message: 'Test message'
      });

      expect(template).toBeDefined();
      expect(typeof template).toBe('object');
    });

    it('should render agent notification template', async () => {
      const { AgentNotificationTemplate } = require('@/src/lib/email-templates');
      const template = AgentNotificationTemplate({
        agentName: 'Test Agent',
        bookingId: testBooking.id,
        listingTitle: 'Test Property',
        listingPrice: '100000 USD',
        scheduledAt: new Date().toISOString(),
        duration: 60,
        visitType: 'VIEWING',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        message: 'Test message'
      });

      expect(template).toBeDefined();
      expect(typeof template).toBe('object');
    });

    it('should render contact form notification template', async () => {
      const { ContactFormNotificationTemplate } = require('@/src/lib/email-templates');
      const template = ContactFormNotificationTemplate({
        contactFormId: testContact.id,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        subject: 'Property Inquiry',
        message: 'Test message',
        listingTitle: 'Test Property',
        listingPrice: '100000 USD'
      });

      expect(template).toBeDefined();
      expect(typeof template).toBe('object');
    });
  });

  describe('API Integration', () => {
    it('should trigger email notifications when booking is created', async () => {
      // This would test the full API integration
      // For now, we verify the EmailService is called
      const bookingData = {
        listingId: testListing.id,
        visitType: 'VIEWING',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        duration: 60,
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+1234567890',
        message: 'Test booking message'
      };

      // Mock the POST endpoint behavior
      const booking = await prisma.booking.create({
        data: {
          ...bookingData,
          userId: testUser.id,
          agentId: testAgent.id,
          status: 'PENDING'
        }
      });

      await EmailService.sendBookingConfirmation(booking.id);
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should trigger email notifications when contact form is submitted', async () => {
      const contactData = {
        name: 'Test Contact',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        listingId: testListing.id
      };

      const contact = await prisma.contact.create({
        data: contactData
      });

      await EmailService.sendContactFormNotification(contact.id);
      expect(sendEmail).toHaveBeenCalled();
    });
  });
});