import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/src/lib/api-auth'
import { 
  generateFileName, 
  getUploadPath, 
  getPublicUrl, 
  processImage, 
  ensureDirectoryExists,
  validateFileType,
  validateFileSize,
  defaultUploadOptions 
} from '@/src/lib/upload-utils'

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const authResult = await requireAdmin(request)
    if (!authResult.success) {
      return authResult.error
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as 'listing' | 'agent'
    const entityId = formData.get('entityId') as string

    if (!file || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, entityType, entityId' },
        { status: 400 }
      )
    }

    // Validate file type and size
    if (!validateFileType(file.type, defaultUploadOptions.allowedTypes)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, JPG, and PNG are allowed' },
        { status: 400 }
      )
    }

    if (!validateFileSize(file.size, defaultUploadOptions.maxSize)) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Ensure directory exists
    const uploadDir = getUploadPath(entityType, entityId)
    await ensureDirectoryExists(uploadDir)

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = `${uploadDir}/${fileName}`

    // Process and save image
    const buffer = Buffer.from(await file.arrayBuffer())
    await processImage(buffer, filePath, defaultUploadOptions.quality)

    // Return public URL
    const publicUrl = getPublicUrl(entityType, entityId, fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      entityType,
      entityId
    })

  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (!authResult.success) {
      return authResult.error
    }

    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType') as 'listing' | 'agent'
    const entityId = searchParams.get('entityId')
    const fileName = searchParams.get('fileName')

    if (!entityType || !entityId || !fileName) {
      return NextResponse.json(
        { error: 'Missing required parameters: entityType, entityId, fileName' },
        { status: 400 }
      )
    }

    // Validate file name to prevent directory traversal
    if (fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      )
    }

    const filePath = `${process.cwd()}/public/images/${entityType}s/${entityId}/${fileName}`

    try {
      await fs.unlink(filePath)
      return NextResponse.json({ success: true, message: 'File deleted successfully' })
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        )
      }
      throw error
    }

  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

// Add fs import for DELETE endpoint
import fs from 'fs/promises'

// Disable body parser for multipart uploads
export const config = {
  api: {
    bodyParser: false,
  },
}