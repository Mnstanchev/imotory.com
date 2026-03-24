import { prisma } from '@/src/lib/prisma';

// Test data
let testUser: any;
let testAgent: any;
let testListing: any;
let testCategory: any;
let testLocation: any;

async function setupTestData() {
  try {
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

    console.log('✅ Test data created successfully');
    return { testUser, testAgent, testListing, testCategory, testLocation };
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}

async function testFavoritesAPI() {
  console.log('\n🧪 Testing Favorites API...');

  try {
    // Test 1: Add favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: testUser.id,
        listingId: testListing.id
      }
    });
    console.log('✅ Added favorite:', favorite.id);

    // Test 2: Check duplicate prevention
    try {
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          listingId: testListing.id
        }
      });
      console.log('❌ Should not allow duplicate favorites');
    } catch (error) {
      console.log('✅ Correctly prevented duplicate favorite');
    }

    // Test 3: Get user favorites
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
    console.log('✅ Retrieved favorites:', favorites.length);

    // Test 4: Remove favorite
    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId: testUser.id,
          listingId: testListing.id
        }
      }
    });
    console.log('✅ Removed favorite successfully');

    return true;
  } catch (error) {
    console.error('❌ Favorites API error:', error);
    return false;
  }
}

async function testBookingsAPI() {
  console.log('\n🧪 Testing Bookings API...');

  try {
    // Test 1: Create booking
    const booking = await prisma.booking.create({
      data: {
        listingId: testListing.id,
        userId: testUser.id,
        agentId: testAgent.id,
        visitType: 'VIEWING',
        scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
        duration: 60,
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        message: 'I would like to schedule a viewing'
      }
    });
    console.log('✅ Created booking:', booking.id);

    // Test 2: Get user bookings
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
    console.log('✅ Retrieved user bookings:', bookings.length);

    // Test 3: Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED'
      }
    });
    console.log('✅ Updated booking status:', updatedBooking.status);

    return true;
  } catch (error) {
    console.error('❌ Bookings API error:', error);
    return false;
  }
}

async function testContactFormsAPI() {
  console.log('\n🧪 Testing Contact Forms API...');

  try {
    // Test 1: General contact form
    const generalContact = await prisma.contact.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services'
      }
    });
    console.log('✅ Created general contact:', generalContact.id);

    // Test 2: Property-specific contact form
    const propertyContact = await prisma.contact.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567890',
        subject: 'Property Inquiry',
        message: 'I am interested in this property',
        listingId: testListing.id
      }
    });
    console.log('✅ Created property contact:', propertyContact.id);

    // Test 3: Get contact forms (for admin/agent)
    const contacts = await prisma.contact.findMany({
      include: {
        listing: {
          select: { title: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log('✅ Retrieved contact forms:', contacts.length);

    // Test 4: Mark as read
    const updatedContact = await prisma.contact.update({
      where: { id: generalContact.id },
      data: { isRead: true }
    });
    console.log('✅ Updated contact read status:', updatedContact.isRead);

    return true;
  } catch (error) {
    console.error('❌ Contact Forms API error:', error);
    return false;
  }
}

async function testRelationships() {
  console.log('\n🧪 Testing Database Relationships...');

  try {
    // Test relationships for favorites
    const favoritesWithDetails = await prisma.favorite.findMany({
      include: {
        user: { select: { email: true, firstName: true } },
        listing: {
          include: {
            agent: { select: { email: true, name: true } },
            category: { select: { name: true } },
            location: { select: { name: true } }
          }
        }
      }
    });
    console.log('✅ Favorites relationships working:', favoritesWithDetails.length);

    // Test relationships for bookings
    const bookingsWithDetails = await prisma.booking.findMany({
      include: {
        user: { select: { email: true, firstName: true } },
        agent: { select: { email: true, name: true } },
        listing: { select: { title: true, price: true } }
      }
    });
    console.log('✅ Bookings relationships working:', bookingsWithDetails.length);

    // Test relationships for contacts
    const contactsWithDetails = await prisma.contact.findMany({
      include: {
        listing: { select: { title: true, price: true } },
        user: { select: { email: true, firstName: true } }
      }
    });
    console.log('✅ Contacts relationships working:', contactsWithDetails.length);

    return true;
  } catch (error) {
    console.error('❌ Database relationships error:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting User Interactions API Tests...\n');

  try {
    await setupTestData();
    
    const results = await Promise.all([
      testFavoritesAPI(),
      testBookingsAPI(),
      testContactFormsAPI(),
      testRelationships()
    ]);

    const allPassed = results.every(result => result === true);
    
    console.log('\n📊 Test Results:');
    console.log('Favorites API:', results[0] ? '✅ PASS' : '❌ FAIL');
    console.log('Bookings API:', results[1] ? '✅ PASS' : '❌ FAIL');
    console.log('Contact Forms API:', results[2] ? '✅ PASS' : '❌ FAIL');
    console.log('Database Relationships:', results[3] ? '✅ PASS' : '❌ FAIL');
    console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    // Cleanup
    await prisma.favorite.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.category.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();

    return allPassed;
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return false;
  }
}

// Run tests
runTests()
  .then(success => {
    console.log('\n🎉 Test suite completed!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });