import { NextResponse } from 'next/server';
import { z } from 'zod';
import slugify from 'slugify';
import { LocationType } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { validateRequest } from '@/src/lib/validation';

const locationSchema = z.object({
  name: z.object({
    en: z.string().min(2, 'Name in English is required'),
    bg: z.string().min(2, 'Name in Bulgarian is required'),
    ru: z.string().min(2, 'Name in Russian is required'),
  }),
  type: z.nativeEnum(LocationType),
  parentId: z.string().optional(),
});

const locationUpdateSchema = z.object({
  name: z.object({
    en: z.string().min(2, 'Name in English is required'),
    bg: z.string().min(2, 'Name in Bulgarian is required'),
    ru: z.string().min(2, 'Name in Russian is required'),
  }).optional(),
  type: z.nativeEnum(LocationType).optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id },
    });

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = locationUpdateSchema.parse(body);

    // Check if this is just a status update
    const isStatusUpdate = Object.keys(body).length === 1 && 'isActive' in body;

    let updateData: any = {};

    if (isStatusUpdate) {
      // Simple status update
      updateData.isActive = validatedData.isActive;
    } else {
      // Full location update - validate required fields
      if (!validatedData.name || !validatedData.type) {
        return NextResponse.json(
          { error: 'Name and type are required for location updates' },
          { status: 400 }
        );
      }

      // Generate new slug if name changed
      const newSlug = slugify(validatedData.name.en, { lower: true, strict: true });

      // Check if new slug would conflict with existing location
      if (newSlug !== existingLocation.slug) {
        const slugExists = await prisma.location.findUnique({
          where: { slug: newSlug },
        });

        if (slugExists) {
          return NextResponse.json(
            { error: 'A location with this name already exists' },
            { status: 400 }
          );
        }
      }

      // Validate parent relationship if provided
      if (validatedData.parentId) {
        // Prevent self-reference
        if (validatedData.parentId === id) {
          return NextResponse.json(
            { error: 'Location cannot be its own parent' },
            { status: 400 }
          );
        }

        const parent = await prisma.location.findUnique({
          where: { id: validatedData.parentId },
        });

        if (!parent) {
          return NextResponse.json(
            { error: 'Parent location not found' },
            { status: 400 }
          );
        }

        // Validate location hierarchy (cover all enum members)
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
          return NextResponse.json(
            { error: 'Invalid location hierarchy' },
            { status: 400 }
          );
        }

        // Check for circular references
        let currentParent = parent as any;
        while (currentParent.parentId) {
          if (currentParent.parentId === id) {
            return NextResponse.json(
              { error: 'Circular reference detected in location hierarchy' },
              { status: 400 }
            );
          }
          currentParent = await prisma.location.findUnique({
            where: { id: currentParent.parentId },
          });
        }
      } else if (validatedData.type !== LocationType.COUNTRY) {
        return NextResponse.json(
          { error: 'Parent location is required for this location type' },
          { status: 400 }
        );
      }

      updateData = {
        name: validatedData.name,
        type: validatedData.type,
        parentId: validatedData.parentId,
        slug: newSlug,
      };

      // Include isActive if provided
      if (validatedData.isActive !== undefined) {
        updateData.isActive = validatedData.isActive;
      }
    }

    // Update location
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        children: true,
        listings: true,
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Check if location has children or listings
    if (location.children.length > 0 || location.listings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with associated children or listings' },
        { status: 400 }
      );
    }

    // Delete location
    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}