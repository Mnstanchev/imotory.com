const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const has = typeof prisma.analyticsEvent !== 'undefined';
    console.log('HAS_ANALYTICS_MODEL', has);
    if (!has) {
      process.exit(0);
    }
    const since = new Date(Date.now() - 30*24*60*60*1000);
    const [a,b,c] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: 'LISTING_CLICK', createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: 'AGENT_CONTACT_CLICK', createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: 'CONTACT_SUBMIT', createdAt: { gte: since } } }),
    ]);
    console.log('COUNTS', { listingClicks: a, agentClicks: b, contactSubmits: c });
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
})();
