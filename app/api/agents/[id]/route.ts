import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse, createErrorResponse } from '@/src/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await prisma.agent.findUnique({
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
            listingType: true,
            bedrooms: true,
            bathrooms: true,
            size: true,
            location: {
              select: { id: true, name: true, slug: true }
            },
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { 
            listings: { where: { isActive: true } }
          }
        }
      }
    })

    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }

    return createResponse(agent)
  } catch (error) {

    return createErrorResponse('Failed to fetch agent', 500)
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
    const { name, email, phone, bio, avatar, socialLinks, isActive } = body

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(socialLinks && { socialLinks }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        _count: {
          select: { listings: true }
        }
      }
    })

    return createResponse(agent, 200, 'Agent updated successfully')
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Agent not found', 404)
    }
    if (error.code === 'P2002') {
      return createErrorResponse('Email already exists', 400)
    }

    return createErrorResponse('Failed to update agent', 500)
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

    await prisma.agent.delete({
      where: { id: id }
    })

    return createResponse({ message: 'Agent deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('Agent not found', 404)
    }
    if (error.code === 'P2014') {
      return createErrorResponse('Cannot delete agent with active listings', 400)
    }

    return createErrorResponse('Failed to delete agent', 500)
  }
}