import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse, createErrorResponse, parseQueryParams, buildWhereClause } from '@/src/lib/api-utils'
import { listingQuerySchema } from '@/src/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params
    const searchParams = request.nextUrl.searchParams
    const parsedParams = parseQueryParams(searchParams)
    const query = listingQuerySchema.parse(parsedParams)
    
    // Verify agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    })
    
    if (!agent) {
      return createErrorResponse('Agent not found', 404)
    }
    
    const where = {
      ...buildWhereClause(parsedParams.filters),
      agentId
    }
    
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          agent: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              phone: true,
              avatar: true,
              isActive: true 
            }
          },
          location: {
            select: { id: true, name: true, slug: true, type: true }
          }
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.listing.count({ where })
    ])
    
    const totalPages = Math.ceil(total / query.limit)
    
    return createResponse({
      listings,
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        avatar: agent.avatar,
        isActive: agent.isActive
      },
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
    console.error('Error fetching agent listings:', error)
    return createErrorResponse('Failed to fetch agent listings', 500)
  }
}