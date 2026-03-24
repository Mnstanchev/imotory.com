import { NextResponse } from 'next/server';
import { z } from 'zod';
import slugify from 'slugify';
import { LocationType } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { validateRequest } from '@/src/lib/validation';
import { createResponse, createErrorResponse } from '@/src/lib/api-utils';

const locationSchema = z.object({
  name: z.object({
    en: z.string().min(2, 'Name in English is required'),
    bg: z.string().min(2, 'Name in Bulgarian is required'),
    ru: z.string().min(2, 'Name in Russian is required'),
  }),
  type: z.nativeEnum(LocationType),
  parentId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(body, locationSchema);
    if (!validation.success) {
      return validation.error;
    }
    const validatedData = validation.data;



    // Generate slug from English name
    const slug = slugify(validatedData.name.en, { lower: true, strict: true });

    // Check if slug already exists
    const existingLocation = await prisma.location.findUnique({
      where: { slug },
    });

    if (existingLocation) {
          return createErrorResponse('A location with this name already exists', 400);
    }

    // If parentId is provided, validate parent exists and check hierarchy
    if (validatedData.parentId) {
      const parent = await prisma.location.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parent) {
            return createErrorResponse('Parent location not found', 400);
      }

      // Validate location hierarchy (account for optional MUNICIPALITY enum)
      const hasMunicipality = Object.prototype.hasOwnProperty.call(LocationType, 'MUNICIPALITY');
      const parentForCity = hasMunicipality ? (LocationType as any).MUNICIPALITY : LocationType.REGION;
      const validHierarchy: Partial<Record<LocationType, LocationType | undefined>> = {
        [LocationType.COUNTRY]: undefined,
        [LocationType.REGION]: LocationType.COUNTRY,
        ...(hasMunicipality ? { [(LocationType as any).MUNICIPALITY]: LocationType.REGION } : {}),
        [LocationType.CITY]: parentForCity,
        [LocationType.NEIGHBORHOOD]: LocationType.CITY,
      } as any;

      const validParentType = (validHierarchy as any)[validatedData.type];
      if (validParentType && validParentType !== parent.type) {
            return createErrorResponse('Invalid location hierarchy', 400);
      }
    } else if (validatedData.type !== LocationType.COUNTRY) {
      // If no parent is provided, only COUNTRY type is allowed
          return createErrorResponse('Parent location is required for this location type', 400);
    }

    // Create location
    const location = await prisma.location.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        parentId: validatedData.parentId,
        slug,
      },
    });

    return createResponse(location, 201, 'Location created successfully');
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return createErrorResponse('Failed to create location', 500);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const normalizedSearch = search.trim().toLowerCase();
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};
    if (normalizedSearch) {
      where.OR = [
        // JSON path string_contains may be case-sensitive depending on the driver
        // Keep these for broad support
        { name: { path: ['en'], string_contains: search } },
        { name: { path: ['bg'], string_contains: search } },
        { name: { path: ['ru'], string_contains: search } },
        // Also search by slug with case-insensitive contains for reliability
        { slug: { contains: normalizedSearch, mode: 'insensitive' as any } },
      ];
    }
    if (type) {
      where.type = type;
    }

    // Get total count for pagination
    const total = await prisma.location.count({ where });

    // Get locations with pagination
    const locations = await prisma.location.findMany({
      where,
      include: {
        _count: {
          select: {
            children: true,
            listings: true,
          },
        },
      },
      // Avoid ordering by JSON field directly ("name") as it can fail on some drivers.
      // Sort by stable scalar fields instead.
      orderBy: [
        { type: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
      skip: limit === 100 ? 0 : skip, // Skip pagination if limit is 100 (get all)
      take: limit === 100 ? undefined : limit,
    });

    const totalPages = limit === 100 ? 1 : Math.ceil(total / limit);

    return createResponse({
      locations,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return createErrorResponse('Failed to fetch locations', 500);
  }
}