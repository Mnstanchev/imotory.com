import { prisma } from '@/src/lib/prisma';

beforeAll(async () => {
  // Ensure test database is ready
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up test data in correct order to avoid FK violations
  await prisma.favorite.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
});