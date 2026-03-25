import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/src/lib/api-auth'
import { validateFileType, validateFileSize, defaultUploadOptions, processImageToBuffer } from '@/src/lib/upload-utils'
import { prisma } from '@/src/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (!authResult.success) return authResult.error

    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string | null
    const entityId = formData.get('entityId') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!validateFileType(file.type, defaultUploadOptions.allowedTypes)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, JPG, and PNG are allowed' }, { status: 400 })
    }
    if (!validateFileSize(file.size, defaultUploadOptions.maxSize)) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const webpBuffer = await processImageToBuffer(buffer)

    const image = await prisma.image.create({
      data: {
        data: webpBuffer,
        mimeType: 'image/webp',
        size: webpBuffer.length,
        entityType: entityType ?? 'temp',
        entityId: entityId ?? undefined,
      },
    })

    return NextResponse.json({
      success: true,
      url: `/api/images/${image.id}`,
      fileName: image.id,
      entityType,
      entityId,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (!authResult.success) return authResult.error

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('fileName') ?? searchParams.get('imageId')
    if (!imageId) return NextResponse.json({ error: 'imageId parameter is required' }, { status: 400 })

    const id = imageId.replace('/api/images/', '')
    await prisma.image.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
