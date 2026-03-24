const { prisma } = require('./src/lib/prisma');

async function testLocations() {
  try {
    console.log('Testing locations...');
    
    // Test basic count
    const count = await prisma.location.count();
    console.log('Location count:', count);
    
    // Test basic findMany
    const locations = await prisma.location.findMany({
      take: 5,
      include: {
        children: {
          select: { id: true, name: true, slug: true, type: true }
        },
        parent: {
          select: { id: true, name: true, slug: true, type: true }
        },
        _count: {
          select: { listings: { where: { isActive: true } } }
        }
      },
      orderBy: { name: { path: ['en'] } }
    });
    
    console.log('Locations:', locations);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Locations test failed:', error);
    await prisma.$disconnect();
  }
}

testLocations();