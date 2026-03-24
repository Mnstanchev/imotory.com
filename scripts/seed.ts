/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@imotory.com" },
    update: {},
    create: {
      email: "admin@imotory.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✓ Admin user created: admin@imotory.com / admin123");
  console.log("User ID:", adminUser.id);
  return;

  // Base data
  const [catApartments, catHouses] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "apartments" },
      update: {},
      create: {
        slug: "apartments",
        name: { en: "Apartments", bg: "Апартаменти", ru: "Квартиры" },
        description: { en: "All apartment listings" },
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "houses" },
      update: {},
      create: {
        slug: "houses",
        name: { en: "Houses", bg: "Къщи", ru: "Дома" },
        description: { en: "All house listings" },
        isActive: true,
      },
    }),
  ]);

  const [sofia, plovdiv] = await Promise.all([
    prisma.location.upsert({
      where: { slug: "sofia" },
      update: {},
      create: {
        slug: "sofia",
        name: { en: "Sofia", bg: "София", ru: "София" },
        type: LocationType.CITY,
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { slug: "plovdiv" },
      update: {},
      create: {
        slug: "plovdiv",
        name: { en: "Plovdiv", bg: "Пловдив", ru: "Пловдив" },
        type: LocationType.CITY,
        isActive: true,
      },
    }),
  ]);

  const agent = await prisma.agent.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: { en: "John Doe", bg: "Джон Доу", ru: "Джон Доу" },
      email: "john@example.com",
      phone: "+359888123456",
      bio: { en: "Experienced real estate agent in Sofia." },
      isActive: true,
    },
  });

  const listingsData = [
    {
      title: { en: "Modern Apartment in Center", bg: "Модерен апартамент в центъра", ru: "Современная квартира в центре" },
      description: { en: "2-bed apartment near metro.", bg: "2-стаен апартамент до метро." },
      price: "175000",
      currency: "EUR",
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.SALE,
      locationId: sofia.id,
      bedrooms: 2,
      bathrooms: 1,
      size: 78,
      features: ["balcony", "elevator"],
      images: ["/images/listings/sample1.webp"],
      slug: "modern-apartment-center-sofia",
      isFeatured: true,
      categoryId: catApartments.id,
      agentId: agent.id,
      address: "Sofia Center",
    },
    {
      title: { en: "Cozy Family House", bg: "Уютна семейна къща", ru: "Уютный семейный дом" },
      description: { en: "3-bed with garden.", bg: "3-стаи с двор." },
      price: "260000",
      currency: "EUR",
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
      locationId: plovdiv.id,
      bedrooms: 3,
      bathrooms: 2,
      size: 140,
      features: ["garden", "parking"],
      images: ["/images/listings/sample2.webp"],
      slug: "cozy-family-house-plovdiv",
      isFeatured: true,
      categoryId: catHouses.id,
      agentId: agent.id,
      address: "Plovdiv, Quiet Area",
    },
    {
      title: { en: "Stylish Studio", bg: "Стилен студио", ru: "Стильная студия" },
      description: { en: "Great for investment.", bg: "Чудесно за инвестиция." },
      price: "89000",
      currency: "EUR",
      propertyType: PropertyType.STUDIO,
      listingType: ListingType.SALE,
      locationId: sofia.id,
      bedrooms: 0,
      bathrooms: 1,
      size: 40,
      features: ["elevator"],
      images: ["/images/listings/sample3.webp"],
      slug: "stylish-studio-sofia",
      isFeatured: false,
      categoryId: catApartments.id,
      agentId: agent.id,
      address: "Sofia, Student City",
    },
    {
      title: { en: "Penthouse with View", bg: "Пентхаус с гледка", ru: "Пентхаус с видом" },
      description: { en: "Top floor, terrace.", bg: "Последен етаж, тераса." },
      price: "420000",
      currency: "EUR",
      propertyType: PropertyType.PENTHOUSE,
      listingType: ListingType.SALE,
      locationId: sofia.id,
      bedrooms: 3,
      bathrooms: 2,
      size: 160,
      features: ["terrace", "garage"],
      images: ["/images/listings/sample4.webp"],
      slug: "penthouse-view-sofia",
      isFeatured: true,
      categoryId: catApartments.id,
      agentId: agent.id,
      address: "Sofia, Lozenets",
    },
    {
      title: { en: "Office Space Downtown", bg: "Офис в центъра", ru: "Офис в центре" },
      description: { en: "Bright office space.", bg: "Светъл офис." },
      price: "1500",
      currency: "EUR",
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.RENT,
      locationId: sofia.id,
      bedrooms: 0,
      bathrooms: 1,
      size: 95,
      features: ["central"],
      images: ["/images/listings/sample5.webp"],
      slug: "office-space-downtown-sofia",
      isFeatured: false,
      categoryId: catApartments.id,
      agentId: agent.id,
      address: "Sofia, Downtown",
    },
  ];

  // Create listings, skipping if slug exists
  for (const data of listingsData) {
    await prisma.listing.upsert({
      where: { slug: data.slug },
      update: {},
      create: data as any,
    });
  }

  const count = await prisma.listing.count({
    where: { slug: { in: listingsData.map((l) => l.slug) } },
  });

  console.log(`Seed completed. Listings present: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


