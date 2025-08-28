import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { stat } from 'fs/promises'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: imagePath } = await params
    
    if (!imagePath || imagePath.length === 0) {
      return new NextResponse('Image path required', { status: 400 })
    }

    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'public', 'images', ...imagePath)
    
    // Security check: ensure the path is within the public/images directory
    const publicImagesDir = path.join(process.cwd(), 'public', 'images')
    const resolvedPath = path.resolve(fullPath)
    const resolvedPublicDir = path.resolve(publicImagesDir)
    
    if (!resolvedPath.startsWith(resolvedPublicDir)) {
      return new NextResponse('Access denied', { status: 403 })
    }

    // Check if file exists and get stats
    let fileStats
    try {
      fileStats = await stat(resolvedPath)
      if (!fileStats.isFile()) {
        return new NextResponse('Not found', { status: 404 })
      }
    } catch (error) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(resolvedPath)
    
    // Determine content type based on file extension
    const ext = path.extname(resolvedPath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.webp':
        contentType = 'image/webp'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
    }

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Last-Modified': fileStats.mtime.toUTCString(),
        'ETag': `"${fileStats.mtime.getTime()}-${fileStats.size}"`,
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
