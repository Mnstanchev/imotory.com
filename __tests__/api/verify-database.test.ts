import { prisma } from '@/src/lib/prisma';

describe('Database Verification Test', () => {
  it('should create test data and NOT clean up', async () => {
    await prisma.$connect();
    
    console.log('=== CREATING TEST DATA IN YOUR DATABASE ===');
    
    // Create test agent
    const agent = await prisma.agent.create({
      data: {
        name: { en: 'REAL TEST AGENT', bg: 'РЕАЛЕН ТЕСТОВ АГЕНТ' },
        email: `real-test-agent-${Date.now()}@example.com`,
        phone: '+359123456789',
        bio: { en: 'This agent should appear in your database', bg: 'Този агент трябва да се появи в базата данни' }
      }
    });
    
    console.log('✅ Created agent:', agent.id, agent.name);
    
    // Create test category
    const category = await prisma.category.create({
      data: {
        name: { en: 'REAL TEST CATEGORY', bg: 'РЕАЛНА ТЕСТОВА КАТЕГОРИЯ' },
        slug: `real-test-category-${Date.now()}`
      }
    });
    
    console.log('✅ Created category:', category.id, category.name);
    
    // Create test location
    const location = await prisma.location.create({
      data: {
        name: { en: 'REAL TEST LOCATION', bg: 'РЕАЛНА ТЕСТОВА ЛОКАЦИЯ' },
        slug: `real-test-location-${Date.now()}`,
        type: 'CITY'
      }
    });
    
    console.log('✅ Created location:', location.id, location.name);
    
    // Create test listing
    const listing = await prisma.listing.create({
      data: {
        title: { en: 'REAL TEST APARTMENT', bg: 'РЕАЛЕН ТЕСТОВ АПАРТАМЕНТ' },
        description: { en: 'This should appear in your database', bg: 'Това трябва да се появи в базата данни' },
        price: 150000,
        currency: 'EUR',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        slug: `real-test-apartment-${Date.now()}`,
        agentId: agent.id,
        categoryId: category.id,
        locationId: location.id,
        isActive: true,
        features: ['parking', 'balcony', 'elevator'],
        images: ['https://example.com/real-test.jpg']
      }
    });
    
    console.log('✅ Created listing:', listing.id, listing.title);
    
    // Query to show what's in the database
    const agents = await prisma.agent.findMany();
    const categories = await prisma.category.findMany();
    const locations = await prisma.location.findMany();
    const listings = await prisma.listing.findMany();
    
    console.log('\n=== WHAT IS ACTUALLY IN YOUR DATABASE ===');
    console.log('Agents:', agents.length);
    agents.forEach(a => console.log(`  - ${a.name.en} (${a.email})`));
    
    console.log('Categories:', categories.length);
    categories.forEach(c => console.log(`  - ${c.name.en}`));
    
    console.log('Locations:', locations.length);
    locations.forEach(l => console.log(`  - ${l.name.en}`));
    
    console.log('Listings:', listings.length);
    listings.forEach(l => console.log(`  - ${l.title.en} - ${l.price} EUR`));
    
    expect(agents.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
    expect(locations.length).toBeGreaterThan(0);
    expect(listings.length).toBeGreaterThan(0);
  });
});