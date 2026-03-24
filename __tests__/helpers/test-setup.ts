import { prisma } from '@/src/lib/prisma';

export async function cleanupDatabase() {
  // Delete all data in reverse order of dependencies
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.listing.deleteMany(),
    prisma.agent.deleteMany(),
    prisma.category.deleteMany(),
    prisma.location.deleteMany(),
    prisma.user.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.notificationPreference.deleteMany(),
    prisma.alert.deleteMany(),
    prisma.emailTemplate.deleteMany(),
  ]);
}

function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export async function createTestData() {
  // Create test data in correct order
  const testUser = await prisma.user.create({
    data: {
      email: `test-user-${generateUniqueId()}@example.com`,
      firstName: `Test`,
      lastName: 'User',
      role: 'USER',
      avatar: `/images/users/test-user.jpg`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      emailVerified: new Date(),
    }
  });

  const testAgent = await prisma.agent.create({
    data: {
      name: JSON.stringify({ en: `Test Agent` }),
      email: `test-agent-${generateUniqueId()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      bio: JSON.stringify({ en: `Test Agent Bio` }),
      avatar: `/images/agents/test-agent.jpg`,
      isActive: true,
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/testagent',
        twitter: 'https://twitter.com/testagent',
        linkedin: 'https://linkedin.com/in/testagent',
      }),
    }
  });

  const testLocation = await prisma.location.create({
    data: {
      name: JSON.stringify({ en: `Test Location` }),
      slug: `test-location-${generateUniqueId()}`,
      type: 'CITY',
    }
  });

  const testCategory = await prisma.category.create({
    data: {
      name: JSON.stringify({ en: `Test Category` }),
      slug: `test-category-${generateUniqueId()}`,
    }
  });

  const testListing = await prisma.listing.create({
    data: {
      title: JSON.stringify({ en: `Test Property` }),
      description: JSON.stringify({ en: `Test description` }),
      price: 250000,
      currency: 'EUR',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      locationId: testLocation.id,
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 2020,
      features: ['BALCONY', 'PARKING'],
      images: [
        `/images/listings/test-property/1.jpg`,
        `/images/listings/test-property/2.jpg`,
      ],
      slug: `test-property-${generateUniqueId()}`,
      viewCount: 0,
      isActive: true,
      isFeatured: false,
      categoryId: testCategory.id,
      agentId: testAgent.id,
    }
  });

  const testBooking = await prisma.booking.create({
    data: {
      userId: testUser.id,
      listingId: testListing.id,
      agentId: testAgent.id,
      visitType: 'VIEWING',
      scheduledAt: new Date('2025-08-15T10:00:00Z'),
      duration: 60,
      contactName: `Test Contact`,
      contactEmail: `test-contact-${generateUniqueId()}@example.com`,
      contactPhone: `+1${Math.floor(Math.random() * 10000000000)}`,
      message: `Test booking message`,
      status: 'PENDING',
    }
  });

  const testContact = await prisma.contact.create({
    data: {
      name: `Test Contact`,
      email: `test-contact-${generateUniqueId()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      subject: `Test Subject`,
      message: `Test message`,
      isRead: false,
      userId: testUser.id,
      listingId: testListing.id,
    }
  });

  return {
    testUser,
    testAgent,
    testLocation,
    testCategory,
    testListing,
    testBooking,
    testContact,
  };
}

export async function createTestLocation() {
  const uniqueId = generateUniqueId();
  return prisma.location.create({
    data: {
      name: JSON.stringify({ en: `Test Location ${uniqueId}` }),
      slug: `test-location-${uniqueId}`,
      type: 'CITY',
    }
  });
}

export async function createTestCategory() {
  const uniqueId = generateUniqueId();
  return prisma.category.create({
    data: {
      name: JSON.stringify({ en: `Test Category ${uniqueId}` }),
      description: JSON.stringify({ en: `Test Category Description ${uniqueId}` }),
      slug: `test-category-${uniqueId}`,
    }
  });
}

export async function createTestAgent() {
  const uniqueId = generateUniqueId();
  return prisma.agent.create({
    data: {
      name: JSON.stringify({ en: `Test Agent ${uniqueId}` }),
      email: `test-agent-${uniqueId}@example.com`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      bio: JSON.stringify({ en: `Test Agent Bio ${uniqueId}` }),
      avatar: `/images/agents/test-agent-${uniqueId}.jpg`,
      isActive: true,
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/testagent',
        twitter: 'https://twitter.com/testagent',
        linkedin: 'https://linkedin.com/in/testagent',
      }),
    }
  });
}

export async function createTestUser() {
  const uniqueId = generateUniqueId();
  return prisma.user.create({
    data: {
      email: `test-user-${uniqueId}@example.com`,
      firstName: `Test ${uniqueId}`,
      lastName: 'User',
      role: 'USER',
      avatar: `/images/users/test-user-${uniqueId}.jpg`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      emailVerified: new Date(),
    }
  });
}

export async function createTestListing(agentId: string, locationId: string, categoryId: string) {
  const uniqueId = generateUniqueId();
  return prisma.listing.create({
    data: {
      title: JSON.stringify({ en: `Test Property ${uniqueId}` }),
      description: JSON.stringify({ en: `Test description ${uniqueId}` }),
      price: 250000,
      currency: 'EUR',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      locationId,
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 2020,
      features: ['BALCONY', 'PARKING'],
      images: [
        `/images/listings/test-property-${uniqueId}/1.jpg`,
        `/images/listings/test-property-${uniqueId}/2.jpg`,
      ],
      slug: `test-property-${uniqueId}`,
      viewCount: 0,
      isActive: true,
      isFeatured: false,
      categoryId,
      agentId,
    }
  });
}

export async function createTestBooking(userId: string, listingId: string) {
  const uniqueId = generateUniqueId();
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { agent: true }
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  return prisma.booking.create({
    data: {
      userId,
      listingId,
      agentId: listing.agentId,
      visitType: 'VIEWING',
      scheduledAt: new Date('2025-08-15T10:00:00Z'),
      duration: 60,
      contactName: `Test Contact ${uniqueId}`,
      contactEmail: `test-contact-${uniqueId}@example.com`,
      contactPhone: `+1${Math.floor(Math.random() * 10000000000)}`,
      message: `Test booking message ${uniqueId}`,
      status: 'PENDING',
    }
  });
}

export async function createTestContact(userId: string | null = null, listingId: string | null = null) {
  const uniqueId = generateUniqueId();
  return prisma.contact.create({
    data: {
      name: `Test Contact ${uniqueId}`,
      email: `test-contact-${uniqueId}@example.com`,
      phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      subject: `Test Subject ${uniqueId}`,
      message: `Test message ${uniqueId}`,
      isRead: false,
      ...(userId ? { userId } : {}),
      ...(listingId ? { listingId } : {}),
    }
  });
}