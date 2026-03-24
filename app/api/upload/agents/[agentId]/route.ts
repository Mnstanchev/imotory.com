import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/src/lib/api-auth'
import { 
  generateFileName, 
  getPublicUrl, 
  processImage, 
  ensureDirectoryExists,
  validateFileType,
  validateFileSize,
  defaultUploadOptions,
  getFilesInDirectory,
  deleteFile
} from '@/src/lib/upload-utils'
import fs from 'fs/promises'
import path from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const authResult = await requireAdmin(request)
    if (!authResult.success) {
      return authResult.error
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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

    const uploadDir = path.join(process.cwd(), 'public/images/agents', agentId)
    await ensureDirectoryExists(uploadDir)

    const fileName = generateFileName(file.name)
    const filePath = `${uploadDir}/${fileName}`

    const buffer = Buffer.from(await file.arrayBuffer())
    await processImage(buffer, filePath, defaultUploadOptions.quality)

    const publicUrl = getPublicUrl('agent', agentId, fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      agentId: agentId
    })

  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const uploadDir = path.join(process.cwd(), 'public/images/agents', agentId)
    const files = await getFilesInDirectory(uploadDir)
    
    const images = files.map(file => ({
      url: getPublicUrl('agent', agentId, file),
      fileName: file
    }))

    return NextResponse.json({ images })

  } catch (error) {

    return NextResponse.json({ images: [] })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const authResult = await requireAdmin(request)
    if (!authResult.success) {
      return authResult.error
    }

    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'fileName parameter is required' },
        { status: 400 }
      )
    }

    if (fileName.includes('/') || fileName.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'public/images/agents', agentId, fileName)
    await deleteFile(filePath)

    return NextResponse.json({ success: true, message: 'Image deleted successfully' })

  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

// Disable body parser for multipart uploads
export const config = {
  api: {
    bodyParser: false,
  },
}