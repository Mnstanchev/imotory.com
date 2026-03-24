import { prisma } from '@/src/lib/prisma';

describe('Database Schema Validation', () => {
  let testAgent: any;
  let testCategory: any;
  let testLocation: any;
  let testUser: any;
  let testListing: any;

  beforeAll(async () => {
    // Use direct database connection for testing
    await prisma.$connect();
    
    // Clean up existing data
    await prisma.favorite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.category.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('Database cleaned and ready for testing');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create agent with required fields', async () => {
    testAgent = await prisma.agent.create({
      data: {
        name: { en: 'Test Agent', bg: 'Тестов агент' },
        email: `agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'Test agent bio', bg: 'Био на агента' }
      }
    });

    expect(testAgent.name.en).toBe('Test Agent');
    expect(testAgent.email).toContain('agent-');
  });

  it('should create category with required fields', async () => {
    testCategory = await prisma.category.create({
      data: {
        name: { en: 'Test Category', bg: 'Тестова категория' },
        slug: `test-category-${Date.now()}`
      }
    });

    expect(testCategory.name.en).toBe('Test Category');
    expect(testCategory.slug).toContain('test-category-');
  });

  it('should create location with required fields', async () => {
    testLocation = await prisma.location.create({
      data: {
        name: { en: 'Test Location', bg: 'Тестова локация' },
        slug: `test-location-${Date.now()}`,
        type: 'CITY'
      }
    });

    expect(testLocation.name.en).toBe('Test Location');
    expect(testLocation.slug).toContain('test-location-');
  });

  it('should create user with required fields', async () => {
    testUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER'
      }
    });

    expect(testUser.email).toBe('user@example.com');
    expect(testUser.firstName).toBe('Test');
  });

  it('should create listing with required fields', async () => {
    // First create required related entities
    const agent = await prisma.agent.create({
      data: {
        name: { en: 'Test Agent', bg: 'Тестов агент' },
        email: `agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'Test agent bio', bg: 'Био на агента' }
      }
    });

    const category = await prisma.category.create({
      data: {
        name: { en: 'Test Category', bg: 'Тестова категория' },
        slug: `test-category-${Date.now()}`
      }
    });

    const location = await prisma.location.create({
      data: {
        name: { en: 'Test Location', bg: 'Тестова локация' },
        slug: `test-location-${Date.now()}`,
        type: 'CITY'
      }
    });

    testListing = await prisma.listing.create({
      data: {
        title: { en: 'Test Apartment', bg: 'Тестов апартамент' },
        description: { en: 'Beautiful apartment', bg: 'Прекрасен апартамент' },
        price: 100000,
        currency: 'EUR',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: `test-apartment-${Date.now()}`,
        agentId: agent.id,
        categoryId: category.id,
        locationId: location.id,
        isActive: true,
        features: ['parking', 'balcony'],
        images: ['https://example.com/image1.jpg']
      }
    });

    expect(testListing.title.en).toBe('Test Apartment');
    expect(testListing.price.toString()).toBe('100000');
    expect(testListing.slug).toContain('test-apartment-');
  });

  it('should create booking with required fields', async () => {
    // Create fresh required entities
    const agent = await prisma.agent.create({
      data: {
        name: { en: 'Test Agent' },
        email: `booking-agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'Test agent bio' }
      }
    });

    const user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `booking-user-${Date.now()}@example.com`,
        role: 'USER'
      }
    });

    const category = await prisma.category.create({
      data: {
        name: { en: 'Test Category' },
        slug: `booking-category-${Date.now()}`
      }
    });

    const location = await prisma.location.create({
      data: {
        name: { en: 'Test Location' },
        slug: `booking-location-${Date.now()}`,
        type: 'CITY'
      }
    });

    const listing = await prisma.listing.create({
      data: {
        title: { en: 'Test Listing' },
        description: { en: 'Test description' },
        price: 100000,
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: `booking-listing-${Date.now()}`,
        agentId: agent.id,
        categoryId: category.id,
        locationId: location.id,
        isActive: true
      }
    });

    const booking = await prisma.booking.create({
      data: {
        listingId: listing.id,
        userId: user.id,
        agentId: agent.id,
        visitType: 'VIEWING',
        scheduledAt: new Date('2024-12-25T10:00:00Z'),
        duration: 60,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+359123456789',
        message: 'Would like to schedule a viewing'
      }
    });

    expect(booking.contactName).toBe('John Doe');
    expect(booking.status).toBe('PENDING');
  });

  it('should create contact with required fields', async () => {
    // Create fresh required entities
    const user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `contact-user-${Date.now()}@example.com`,
        role: 'USER'
      }
    });

    const agent = await prisma.agent.create({
      data: {
        name: { en: 'Test Agent' },
        email: `contact-agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'Test agent bio' }
      }
    });

    const category = await prisma.category.create({
      data: {
        name: { en: 'Test Category' },
        slug: `contact-category-${Date.now()}`
      }
    });

    const location = await prisma.location.create({
      data: {
        name: { en: 'Test Location' },
        slug: `contact-location-${Date.now()}`,
        type: 'CITY'
      }
    });

    const listing = await prisma.listing.create({
      data: {
        title: { en: 'Test Listing' },
        description: { en: 'Test description' },
        price: 100000,
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: `contact-listing-${Date.now()}`,
        agentId: agent.id,
        categoryId: category.id,
        locationId: location.id,
        isActive: true
      }
    });

    const contact = await prisma.contact.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+359123456789',
        subject: 'Property Inquiry',
        message: 'Interested in your listing',
        listingId: listing.id,
        userId: user.id
      }
    });

    expect(contact.name).toBe('John Doe');
    expect(contact.isRead).toBe(false);
  });

  it('should create favorite with required fields', async () => {
    // Create fresh required entities
    const user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `favorite-user-${Date.now()}@example.com`,
        role: 'USER'
      }
    });

    const agent = await prisma.agent.create({
      data: {
        name: { en: 'Test Agent' },
        email: `favorite-agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'Test agent bio' }
      }
    });

    const category = await prisma.category.create({
      data: {
        name: { en: 'Test Category' },
        slug: `favorite-category-${Date.now()}`
      }
    });

    const location = await prisma.location.create({
      data: {
        name: { en: 'Test Location' },
        slug: `favorite-location-${Date.now()}`,
        type: 'CITY'
      }
    });

    const listing = await prisma.listing.create({
      data: {
        title: { en: 'Test Listing' },
        description: { en: 'Test description' },
        price: 100000,
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: `favorite-listing-${Date.now()}`,
        agentId: agent.id,
        categoryId: category.id,
        locationId: location.id,
        isActive: true
      }
    });

    const favorite = await prisma.favorite.create({
      data: {
        listingId: listing.id,
        userId: user.id
      }
    });

    expect(favorite.userId).toBe(user.id);
    expect(favorite.listingId).toBe(listing.id);
  });

  it('should create alert with required fields', async () => {
    // Create fresh user
    const user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `alert-user-${Date.now()}@example.com`,
        role: 'USER'
      }
    });

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        email: 'alerts@example.com',
        name: 'Test Alert',
        propertyType: ['APARTMENT'],
        listingType: ['SALE'],
        city: ['Sofia'],
        minPrice: 50000,
        maxPrice: 200000,
        minBedrooms: 1,
        maxBedrooms: 3
      }
    });

    expect(alert.name).toBe('Test Alert');
    expect(alert.isActive).toBe(true);
  });
});