import { auth } from '@/src/lib/auth'
import { createErrorResponse } from '@/src/lib/api-utils'
import { NextRequest, NextResponse } from 'next/server'
import { Session } from 'next-auth'

type AuthResult = { success: true; session: Session } | { success: false; error: NextResponse }

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: createErrorResponse('Authentication required', 401) }
  }
  
  return { success: true, session }
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: createErrorResponse('Authentication required', 401) }
  }
  
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
    return { success: false, error: createErrorResponse('Admin access required', 403) }
  }
  
  return { success: true, session }
}

export async function requireAgentOrAdmin(request: NextRequest): Promise<AuthResult> {
  const session = await auth()
  
  if (!session?.user) {
    return { success: false, error: createErrorResponse('Authentication required', 401) }
  }
  
  if (!['AGENT', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return { success: false, error: createErrorResponse('Agent or admin access required', 403) }
  }
  
  return { success: true, session }
}

export async function getCurrentUser(request: NextRequest) {
  const session = await auth()
  return session?.user || null
}