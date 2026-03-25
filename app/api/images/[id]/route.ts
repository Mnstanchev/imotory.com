import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const image = await prisma.image.findUnique({ where: { id } })
  if (!image) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
