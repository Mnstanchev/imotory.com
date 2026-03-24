import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/src/lib/api-auth'
import { 
  generateFileName, 
  processImage, 
  ensureDirectoryExists,
  validateFileType,
  validateFileSize,
  defaultUploadOptions 
} from '@/src/lib/upload-utils'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Check admin access
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

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'public/images/temp')
    await ensureDirectoryExists(tempDir)

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = path.join(tempDir, fileName)

    // Process and save image
    const buffer = Buffer.from(await file.arrayBuffer())
    await processImage(buffer, filePath, defaultUploadOptions.quality)

    // Return temporary URL
    const tempUrl = `/images/temp/${fileName}`

    return NextResponse.json({
      success: true,
      url: tempUrl,
      fileName,
      isTemporary: true
    })

  } catch (error) {
    console.error('Temp upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
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