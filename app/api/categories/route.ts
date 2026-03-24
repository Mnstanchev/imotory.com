import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse, createErrorResponse, parseQueryParams } from '@/src/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { categoryQuerySchema } = await import('@/src/lib/validation')
    const query = categoryQuerySchema.parse(parseQueryParams(request.nextUrl.searchParams))
    
    const where = {
      ...(query.isActive !== undefined && { isActive: query.isActive }),
    }
    
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          _count: {
            select: { listings: { where: { isActive: true } } }
          }
        }
      }),
      prisma.category.count({ where })
    ])
    
    const totalPages = Math.ceil(total / query.limit)
    
    return createResponse({
      categories,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1
      }
    })
  } catch (error) {

    return createErrorResponse('Failed to fetch categories', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/src/lib/api-auth')
    const authResult = await requireAdmin(request)
    
    if (!authResult.success) {
      return authResult.error
    }
    
    const { validateRequest } = await import('@/src/lib/validation')
    const body = await request.json()
    
    const validation = validateRequest(body, (await import('@/src/lib/validation')).createCategorySchema)
    if (!validation.success) {
      return validation.error
    }
    
    const { name, slug, description, icon, sortOrder } = validation.data
    
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description: description || {},
        icon,
        sortOrder,
      },
      include: {
        _count: {
          select: { listings: { where: { isActive: true } } }
        }
      }
    })
    
    return createResponse(category, 201, 'Category created successfully')
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('Slug already exists', 400)
    }

    return createErrorResponse('Failed to create category', 500)
  }
}