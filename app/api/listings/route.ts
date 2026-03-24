import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { auth } from '@/auth';
import slugify from 'slugify';
import { z } from 'zod';
import { createListingSchema } from '@/src/lib/validation/listing';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();

    // Validate the request data
    const validatedData = createListingSchema.parse(data);
    const {
      title,
      description,
      price,
      pricePerSqM,
      currency,
      propertyType,
      listingType,
      locationId,
      categoryId,
      agentId,
      // Address and coordinates
      address,
      postalCode,
      latitude,
      longitude,
      // Room details
      bedrooms,
      bathrooms,
      livingRooms,
      kitchens,
      parkingSpots,
      // Amenities
      garage,
      balcony,
      pool,
      elevator,
      furnished,
      airConditioning,
      // Outdoor spaces
      gardenSize,
      terraceSize,
      // Property details
      size,
      floor,
      totalFloors,
      yearBuilt,
      // Building information
      buildingType,
      buildingCondition,
      maintenanceFee,
      // Climate and ownership
      heatingType,
      ownershipType,
      mortgagePossible,
      // Status and availability
      status,
      availableFrom,
      // Media and features
      features,
      tags,
      images,
      videoUrl,
      virtualTourUrl,
      // Visibility
      isActive,
      isFeatured,
    } = validatedData;

    // Generate a unique slug from the title (prefer EN, fallback to BG or RU)
    const titleForSlug = (title?.en || title?.bg || title?.ru || '').toString() || 'listing';
    const baseSlug = slugify(titleForSlug, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Keep checking until we find a unique slug
    while (await prisma.listing.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        pricePerSqM,
        currency,
        propertyType,
        listingType,
        locationId,
        categoryId,
        agentId,
        // Address and coordinates
        address,
        postalCode,
        latitude,
        longitude,
        // Room details
        bedrooms,
        bathrooms,
        livingRooms,
        kitchens,
        parkingSpots,
        // Amenities
        garage,
        balcony,
        pool,
        elevator,
        furnished,
        airConditioning,
        // Outdoor spaces
        gardenSize,
        terraceSize,
        // Property details
        size,
        floor,
        totalFloors,
        yearBuilt,
        // Building information
        buildingType,
        buildingCondition,
        maintenanceFee,
        // Climate and ownership
        heatingType,
        ownershipType,
        mortgagePossible,
        // Status and availability
        status,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        // Media and features
        features,
        tags,
        images,
        videoUrl,
        virtualTourUrl,
        // Visibility
        isActive,
        isFeatured,
        slug,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build the where clause for search
    const where = search ? {
      OR: [
        { title: { path: '$.en', string_contains: search } },
        { description: { path: '$.en', string_contains: search } },
        {
          agent: {
            name: { path: '$.en', string_contains: search }
          }
        },
        {
          location: {
            name: { path: '$.en', string_contains: search }
          }
        }
      ]
    } : {};

    // Get total count for pagination
    const total = await prisma.listing.count({ where });

    // Get listings with pagination
    const listings = await prisma.listing.findMany({
      where,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}