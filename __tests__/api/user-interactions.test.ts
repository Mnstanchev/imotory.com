import { prisma } from '@/src/lib/prisma';
import { NextRequest } from 'next/server';
import { GET as getFavorites, POST as postFavorite, DELETE as deleteFavorite } from '@/app/api/favorites/route';
import { GET as getBookings, POST as postBooking, PUT as updateBooking } from '@/app/api/bookings/route';
import { POST as postContact, GET as getContacts } from '@/app/api/contact/route';

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

const mockSession = {
  user: {
    id: 'test-user-123',
    email: 'test@example.com',
    role: 'USER'
  }
};

const mockAgentSession = {
  user: {
    id: 'test-agent-123',
    email: 'agent@example.com',
    role: 'AGENT'
  }
};

const mockAdminSession = {
  user: {
    id: 'test-admin-123',
    email: 'admin@example.com',
    role: 'ADMIN'
  }
};

// Mock authOptions
jest.mock('@/auth.config', () => ({
  authOptions: {}
}));

// Mock getServerSession
const { getServerSession } = require('next-auth');

// Helper function to create mock request
function createMockRequest(method: string, body?: any, searchParams?: Record<string, string>) {
  const url = new URL('http://localhost:3000');
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return {
    method,
    url: url.toString(),
    json: async () => body,
  } as NextRequest;
}

describe('User Interactions API Tests', () => {
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
    // Clean up test data
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
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      }
    });

    testAgent = await prisma.agent.create({
      data: {
        name: JSON.stringify({ en: 'Test Agent' }),
        email: 'agent@example.com',
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

    // Update mock sessions with correct IDs
    mockSession.user.id = testUser.id;
    mockAgentSession.user.id = testAgent.id;
    mockAdminSession.user.id = 'test-admin-123';
  });

  describe('Favorites API', () => {
    it('should add a favorite listing', async () => {
      getServerSession.mockResolvedValue(mockSession);

      const request = createMockRequest('POST', {
        listingId: testListing.id
      });

      const response = await postFavorite(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.listing.id).toBe(testListing.id);
    });

    it('should not allow duplicate favorites', async () => {
      getServerSession.mockResolvedValue(mockSession);

      // First add favorite
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      const request = createMockRequest('POST', {
        listingId: testListing.id
      });

      const response = await postFavorite(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should get user favorites', async () => {
      getServerSession.mockResolvedValue(mockSession);

      // Add a favorite
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      const request = createMockRequest('GET');
      const response = await getFavorites(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.favorites).toHaveLength(1);
      expect(data.data.favorites[0].listing.id).toBe(testListing.id);
    });

    it('should remove a favorite', async () => {
      getServerSession.mockResolvedValue(mockSession);

      // Add favorite first
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });

      const request = createMockRequest('DELETE', null, {
        listingId: testListing.id
      });
      const response = await deleteFavorite(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify it's deleted
      const favorites = await prisma.favorite.findMany({
        where: { userId: testUser.id }
      });
      expect(favorites).toHaveLength(0);
    });

    it('should require authentication for favorites', async () => {
      getServerSession.mockResolvedValue(null);

      const request = createMockRequest('POST', {
        listingId: testListing.id
      });

      const response = await postFavorite(request);
      expect(response.status).toBe(401);
    });
  });

  describe('Bookings API', () => {
    it('should create a booking', async () => {
      const bookingData = {
        listingId: testListing.id,
        visitType: 'VIEWING',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 60,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        message: 'I would like to schedule a viewing'
      };

      const request = createMockRequest('POST', bookingData);
      const response = await postBooking(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.listingId).toBe(testListing.id);
      expect(data.data.status).toBe('PENDING');
    });

    it('should get user bookings', async () => {
      getServerSession.mockResolvedValue(mockSession);

      // Create a booking linked to user
      await prisma.booking.create({
        data: {
          listingId: testListing.id,
          userId: testUser.id,
          agentId: testAgent.id,
          visitType: 'VIEWING',
          scheduledAt: new Date(Date.now() + 86400000),
          duration: 60,
          contactName: 'Test User',
          contactEmail: 'test@example.com',
          contactPhone: '+1234567890',
          status: 'PENDING'
        }
      });

      const request = createMockRequest('GET');
      const response = await getBookings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.bookings).toHaveLength(1);
    });

    it('should allow agents to update booking status', async () => {
      getServerSession.mockResolvedValue(mockAgentSession);

      const booking = await prisma.booking.create({
        data: {
          listingId: testListing.id,
          agentId: testAgent.id,
          visitType: 'VIEWING',
          scheduledAt: new Date(Date.now() + 86400000),
          duration: 60,
          contactName: 'Test User',
          contactEmail: 'test@example.com',
          contactPhone: '+1234567890',
          status: 'PENDING'
        }
      });

      const request = createMockRequest('PUT', {
        status: 'CONFIRMED',
        notes: 'Booking confirmed'
      }, { bookingId: booking.id });

      const response = await updateBooking(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('CONFIRMED');
    });

    it('should not allow booking for inactive listings', async () => {
      const inactiveListing = await prisma.listing.create({
        data: {
          title: { en: 'Inactive Property' },
          description: { en: 'Test description' },
          price: 100000,
          currency: 'USD',
          propertyType: 'APARTMENT',
          listingType: 'SALE',
          slug: 'inactive-property-123',
          agentId: testAgent.id,
          categoryId: testCategory.id,
          locationId: testLocation.id,
          isActive: false,
          features: ['parking'],
          images: ['test-image.jpg']
        }
      });

      const bookingData = {
        listingId: inactiveListing.id,
        visitType: 'VIEWING',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        duration: 60,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890'
      };

      const request = createMockRequest('POST', bookingData);
      const response = await postBooking(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('Contact Forms API', () => {
    it('should submit a general contact form', async () => {
      const contactData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services'
      };

      const request = createMockRequest('POST', contactData);
      const response = await postContact(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Jane Doe');
      expect(data.data.isRead).toBe(false);
    });

    it('should submit a property-specific contact form', async () => {
      const contactData = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1234567890',
        subject: 'Property Inquiry',
        message: 'I am interested in this property',
        listingId: testListing.id
      };

      const request = createMockRequest('POST', contactData);
      const response = await postContact(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.listingId).toBe(testListing.id);
    });

    it('should allow agents to view contact forms', async () => {
      getServerSession.mockResolvedValue(mockAgentSession);

      await prisma.contact.create({
        data: {
          name: 'Test Contact',
          email: 'contact@example.com',
          subject: 'Test Subject',
          message: 'Test message',
          listingId: testListing.id,
          agentId: testAgent.id
        }
      });

      const request = createMockRequest('GET');
      const response = await getContacts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.contactForms).toHaveLength(1);
    });

    it('should not allow regular users to view contact forms', async () => {
      getServerSession.mockResolvedValue(mockSession);

      const request = createMockRequest('GET');
      const response = await getContacts(request);

      expect(response.status).toBe(403);
    });
  });

  describe('Authorization Tests', () => {
    it('should require authentication for favorites', async () => {
      getServerSession.mockResolvedValue(null);

      const request = createMockRequest('GET');
      const response = await getFavorites(request);

      expect(response.status).toBe(401);
    });

    it('should require admin/agent role for contact forms', async () => {
      getServerSession.mockResolvedValue(mockSession);

      const request = createMockRequest('GET');
      const response = await getContacts(request);

      expect(response.status).toBe(403);
    });
  });
});