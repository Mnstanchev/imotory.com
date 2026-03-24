import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { createResponse, createErrorResponse, parseQueryParams } from '@/src/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { agentQuerySchema } = await import('@/src/lib/validation')
    const query = agentQuerySchema.parse(parseQueryParams(request.nextUrl.searchParams))
    
    const where = {
      ...(query.isActive !== undefined && { isActive: query.isActive }),
    }
    
    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          _count: {
            select: { listings: true }
          }
        }
      }),
      prisma.agent.count({ where })
    ])
    
    const totalPages = Math.ceil(total / query.limit)
    
    const response = {
      agents,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1
      }
    };
    

    return createResponse(response)
  } catch (error) {

    return createErrorResponse('Failed to fetch agents', 500)
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
    
    const validation = validateRequest(body, (await import('@/src/lib/validation')).createAgentSchema)
    if (!validation.success) {
      return validation.error
    }
    
    const { name, email, phone, bio, avatar, socialLinks, isActive } = validation.data
    
    const agent = await prisma.agent.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        bio: bio || {},
        avatar: '', // Will be updated after moving temp image
        socialLinks: socialLinks || {},
        isActive: isActive ?? true,
      },
      include: {
        _count: {
          select: { listings: true }
        }
      }
    })

    // Move temporary image to agent's directory if avatar was provided
    let finalAvatarUrl = avatar
    if (avatar) {
      try {
        const { moveTempImageToEntity } = await import('@/src/lib/upload-utils')
        finalAvatarUrl = await moveTempImageToEntity(avatar, 'agent', agent.id)
        
        // Update agent with final avatar URL
        await prisma.agent.update({
          where: { id: agent.id },
          data: { avatar: finalAvatarUrl }
        })
        
        // Update the agent object for response
        agent.avatar = finalAvatarUrl
      } catch (error) {
        console.error('Failed to move temp image:', error)
        // Keep original avatar URL if move fails
        await prisma.agent.update({
          where: { id: agent.id },
          data: { avatar: avatar }
        })
        agent.avatar = avatar
      }
    }
    
    return createResponse(agent, 201, 'Agent created successfully')
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('Email already exists', 400)
    }

    return createErrorResponse('Failed to create agent', 500)
  }
}