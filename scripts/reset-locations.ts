import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetLocations() {
  try {
    console.log('🗑️  Resetting locations table...');
    
    // Delete all locations (this will cascade due to foreign key constraints)
    const deletedCount = await prisma.location.deleteMany({});
    
    console.log(`✅ Deleted ${deletedCount.count} locations`);
    console.log('🔄 Locations table has been reset successfully');
    
  } catch (error) {
    console.error('❌ Error resetting locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  resetLocations()
    .then(() => {
      console.log('✅ Reset completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Reset failed:', error);
      process.exit(1);
    });
}

export { resetLocations };
