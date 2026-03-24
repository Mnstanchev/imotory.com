import { prisma } from '@/src/lib/prisma';

describe('User Interactions API - Direct Database Tests', () => {
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

  describe('Favorites API - Database Layer', () => {
    it('should create and retrieve favorites', async () => {
      // Add favorite
      const favorite = await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      expect(favorite.userId).toBe(testUser.id);
      expect(favorite.listingId).toBe(testListing.id);

      // Get user favorites with details
      const favorites = await prisma.favorite.findMany({
        where: { userId: testUser.id },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      });

      expect(favorites).toHaveLength(1);
      expect(favorites[0].listing.id).toBe(testListing.id);
    });

    it('should prevent duplicate favorites', async () => {
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      await expect(
        prisma.favorite.create({
          data: {
            userId: testUser.id,
            listingId: testListing.id
          }
        })
      ).rejects.toThrow();
    });

    it('should remove favorites', async () => {
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      await prisma.favorite.delete({
        where: {
          userId_listingId: {
            userId: testUser.id,
            listingId: testListing.id
          }
        }
      });

      const remaining = await prisma.favorite.findMany({
        where: { userId: testUser.id }
      });
      expect(remaining).toHaveLength(0);
    });
  });

  describe('Bookings API - Database Layer', () => {
    it('should create bookings with all required fields', async () => {
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
          contactPhone: '+1234567890',
          message: 'I would like to schedule a viewing'
        }
      });

      expect(booking.id).toBeDefined();
      expect(booking.status).toBe('PENDING');
      expect(booking.listingId).toBe(testListing.id);
    });

    it('should retrieve bookings with relationships', async () => {
      const booking = await prisma.booking.create({
        data: {
          listingId: testListing.id,
          userId: testUser.id,
          agentId: testAgent.id,
          visitType: 'VIEWING',
          scheduledAt: new Date(Date.now() + 86400000),
          duration: 60,
          contactName: 'Test User',
          contactEmail: 'test@example.com',
          contactPhone: '+1234567890'
        }
      });

      const bookings = await prisma.booking.findMany({
        where: { userId: testUser.id },
        include: {
          listing: {
            select: { title: true, price: true }
          },
          agent: {
            select: { name: true, email: true }
          }
        }
      });

      expect(bookings).toHaveLength(1);
      expect(bookings[0].listing.title).toBeTruthy();
    });
  });

  describe('Contact Forms API - Database Layer', () => {
    it('should create general contact forms', async () => {
      const contact = await prisma.contact.create({
        data: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567890',
          subject: 'General Inquiry',
          message: 'I would like to know more about your services'
        }
      });

      expect(contact.id).toBeDefined();
      expect(contact.isRead).toBe(false);
    });

    it('should create property-specific contact forms', async () => {
      const contact = await prisma.contact.create({
        data: {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1234567890',
          subject: 'Property Inquiry',
          message: 'I am interested in this property',
          listingId: testListing.id
        }
      });

      expect(contact.listingId).toBe(testListing.id);
    });

    it('should retrieve contact forms with relationships', async () => {
      await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Test Subject',
          message: 'Test message',
          listingId: testListing.id
        }
      });

      const contacts = await prisma.contact.findMany({
        include: {
          listing: {
            select: { title: true, price: true }
          }
        }
      });

      expect(contacts).toHaveLength(1);
      expect(contacts[0].listing.title).toBeTruthy();
    });
  });

  describe('Database Relationships', () => {
    it('should maintain proper relationships between entities', async () => {
      // Create all interaction types
      const favorite = await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      const booking = await prisma.booking.create({
        data: {
          listingId: testListing.id,
          userId: testUser.id,
          agentId: testAgent.id,
          visitType: 'VIEWING',
          scheduledAt: new Date(Date.now() + 86400000),
          duration: 60,
          contactName: 'Test User',
          contactEmail: 'test@example.com',
          contactPhone: '+1234567890'
        }
      });

      const contact = await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Test Subject',
          message: 'Test message',
          listingId: testListing.id
        }
      });

      // Test relationships
      const userWithFavorites = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: {
          favorites: { include: { listing: true } },
          bookings: { include: { listing: true } }
        }
      });

      const listingWithInteractions = await prisma.listing.findUnique({
        where: { id: testListing.id },
        include: {
          favorites: true,
          bookings: true,
          contacts: true
        }
      });

      expect(userWithFavorites?.favorites).toHaveLength(1);
      expect(userWithFavorites?.bookings).toHaveLength(1);
      expect(listingWithInteractions?.favorites).toHaveLength(1);
      expect(listingWithInteractions?.bookings).toHaveLength(1);
      expect(listingWithInteractions?.contacts).toHaveLength(1);
    });
  });
});