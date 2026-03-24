import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse, createErrorResponse } from '@/src/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        listings: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            images: true,
            propertyType: true,
            bedrooms: true,
            bathrooms: true,
            size: true,
            location: {
              select: { id: true, name: true, slug: true }
            },
            agent: {
              select: { id: true, name: true, email: true, phone: true }
            },
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { 
            listings: { where: { isActive: true } }
          }
        }
      }
    })

    if (!category) {
      return createErrorResponse('Category not found', 404)
    }

    return createResponse(category)
  } catch (error) {

    return createErrorResponse('Failed to fetch category', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { requireAdmin } = await import('@/src/lib/api-auth')
    const authResult = await requireAdmin(request)
    
    if (!authResult.success) {
      return authResult.error
    }

    const body = await request.json()
    const { name, slug, description, icon, sortOrder, isActive } = body

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, '-') }),
        ...(description && { description }),
        ...(icon && { icon }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        _count: {
          select: { listings: { where: { isActive: true } } }
        }
      }
    })

    return createResponse(category, 200, 'Category updated successfully')
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Category not found', 404)
    }
    if (error.code === 'P2002') {
      return createErrorResponse('Slug already exists', 400)
    }

    return createErrorResponse('Failed to update category', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { requireAdmin } = await import('@/src/lib/api-auth')
    const authResult = await requireAdmin(request)
    
    if (!authResult.success) {
      return authResult.error
    }

    await prisma.category.delete({
      where: { id }
    })

    return createResponse({ message: 'Category deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Category not found', 404)
    }
    if (error.code === 'P2014') {
      return createErrorResponse('Cannot delete category with active listings', 400)
    }

    return createErrorResponse('Failed to delete category', 500)
  }
}