import { NotificationService } from '@/src/lib/notification-service';
import { prisma } from '@/src/lib/prisma';
import { sendEmail } from '@/src/lib/email';

// Mock email sending to avoid actual API calls during tests
jest.mock('@/src/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, data: { id: 'mock-email-id' } })
}));

describe('Notifications System Tests', () => {
  let testUser: any;
  let testAgent: any;
  let testListing: any;
  let testCategory: any;
  let testLocation: any;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up
    await prisma.notification.deleteMany();
    await prisma.notificationPreference.deleteMany();
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
  });

  describe('Notification Service', () => {
    it('should create a notification', async () => {
      const notification = await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test Notification' },
        message: { en: 'Test message' }
      });

      expect(notification).toBeDefined();
      expect(notification.userId).toBe(testUser.id);
      expect(notification.type).toBe('NEW_LISTING');
      expect(notification.title).toEqual({ en: 'Test Notification' });
      expect(notification.isRead).toBe(false);
    });

    it('should create notification with multilingual content', async () => {
      const notification = await NotificationService.createNotification({
        userId: testUser.id,
        type: 'BOOKING_CONFIRMED',
        title: { 
          en: 'Booking Confirmed',
          bg: 'Резервацията е Потвърдена',
          ru: 'Бронирование Подтверждено'
        },
        message: { 
          en: 'Your booking is confirmed',
          bg: 'Вашата резервация е потвърдена',
          ru: 'Ваше бронирование подтверждено'
        }
      });

      expect(notification.title.en).toBe('Booking Confirmed');
      expect(notification.title.bg).toBe('Резервацията е Потвърдена');
      expect(notification.title.ru).toBe('Бронирование Подтверждено');
    });

    it('should create notification without sending email if preferences disabled', async () => {
      // Create preferences with email notifications disabled
      await prisma.notificationPreference.create({
        data: {
          userId: testUser.id,
          emailNotifications: false
        }
      });

      const notification = await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test Notification' },
        message: { en: 'Test message' }
      });

      expect(notification).toBeDefined();
      expect(notification.emailSent).toBe(false);
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should get unread notification count', async () => {
      await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test 1' },
        message: { en: 'Message 1' }
      });

      await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test 2' },
        message: { en: 'Message 2' }
      });

      const count = await NotificationService.getUnreadCount(testUser.id);
      expect(count).toBe(2);
    });

    it('should mark all notifications as read', async () => {
      await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test 1' },
        message: { en: 'Message 1' }
      });

      await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test 2' },
        message: { en: 'Message 2' }
      });

      const count = await NotificationService.markAllAsRead(testUser.id);
      expect(count).toBe(2);

      const unreadCount = await NotificationService.getUnreadCount(testUser.id);
      expect(unreadCount).toBe(0);
    });

    it('should notify new listing', async () => {
      const notification = await NotificationService.notifyNewListing(
        testUser.id,
        testListing
      );

      expect(notification.type).toBe('NEW_LISTING');
      expect(notification.title.en).toBe('New Property Listed');
    });

    it('should notify booking confirmed', async () => {
      const booking = await prisma.booking.create({
        data: {
          listingId: testListing.id,
          userId: testUser.id,
          agentId: testAgent.id,
          visitType: 'VIEWING',
          scheduledAt: new Date(Date.now() + 86400000),
          duration: 60,
          contactName: 'John Doe',
          contactEmail: 'john@example.com',
          contactPhone: '+1234567890'
        },
        include: { listing: true }
      });

      const notification = await NotificationService.notifyBookingConfirmed(
        testUser.id,
        booking
      );

      expect(notification.type).toBe('BOOKING_CONFIRMED');
      expect(notification.title.en).toBe('Booking Confirmed');
    });

    it('should create multiple notifications', async () => {
      const notifications = [
        {
          userId: testUser.id,
          type: 'NEW_LISTING' as const,
          title: { en: 'Test 1' },
          message: { en: 'Message 1' }
        },
        {
          userId: testUser.id,
          type: 'BOOKING_CONFIRMED' as const,
          title: { en: 'Test 2' },
          message: { en: 'Message 2' }
        }
      ];

      const result = await NotificationService.createMultipleNotifications(notifications);

      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
    });
  });

  describe('API Endpoints', () => {
    it('should get user notifications', async () => {
      await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test Notification' },
        message: { en: 'Test message' }
      });

      const notifications = await prisma.notification.findMany({
        where: { userId: testUser.id }
      });

      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('NEW_LISTING');
    });

    it('should mark notifications as read', async () => {
      const notification = await NotificationService.createNotification({
        userId: testUser.id,
        type: 'NEW_LISTING',
        title: { en: 'Test Notification' },
        message: { en: 'Test message' }
      });

      await prisma.notification.update({
        where: { id: notification.id },
        data: { isRead: true }
      });

      const updatedNotification = await prisma.notification.findUnique({
        where: { id: notification.id }
      });

      expect(updatedNotification?.isRead).toBe(true);
    });
  });

  describe('Notification Preferences', () => {
    it('should create default preferences', async () => {
      const preferences = await prisma.notificationPreference.create({
        data: {
          userId: testUser.id
        }
      });

      expect(preferences.emailNotifications).toBe(true);
      expect(preferences.pushNotifications).toBe(true);
      expect(preferences.notifyNewListings).toBe(true);
    });

    it('should update preferences', async () => {
      const preferences = await prisma.notificationPreference.upsert({
        where: { userId: testUser.id },
        update: {
          emailNotifications: false,
          notifyNewListings: false
        },
        create: {
          userId: testUser.id,
          emailNotifications: false,
          notifyNewListings: false
        }
      });

      expect(preferences.emailNotifications).toBe(false);
      expect(preferences.notifyNewListings).toBe(false);
    });
  });
});