const { prisma } = require('./src/lib/prisma');

async function testConnection() {
  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Test table access
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Test listing access
    const listingCount = await prisma.listing.count();
    console.log('Listing count:', listingCount);
    
    await prisma.$disconnect();
    console.log('Database test completed successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();