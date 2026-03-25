import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/src/lib/api-auth'
import { validateFileType, validateFileSize, defaultUploadOptions, processImageToBuffer } from '@/src/lib/upload-utils'
import { prisma } from '@/src/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params
    const authResult = await requireAdmin(request)
    if (!authResult.success) return authResult.error

    const formData = await request.formData()
    const file = formData.get('file') as File

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
        entityType: 'listing',
        entityId: listingId,
      },
    })

    return NextResponse.json({
      success: true,
      url: `/api/images/${image.id}`,
      fileName: image.id,
      listingId,
    })
  } catch (error) {
    console.error('Listing upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { listingId } = await params
  const images = await prisma.image.findMany({
    where: { entityType: 'listing', entityId: listingId },
    select: { id: true },
  })
  return NextResponse.json({
    images: images.map(img => ({ url: `/api/images/${img.id}`, fileName: img.id })),
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params
    const authResult = await requireAdmin(request)
    if (!authResult.success) return authResult.error

    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    if (!fileName) return NextResponse.json({ error: 'fileName parameter is required' }, { status: 400 })

    // fileName is the image id
    const imageId = fileName.replace('/api/images/', '')
    await prisma.image.deleteMany({
      where: { id: imageId, entityType: 'listing', entityId: listingId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete listing image error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
