import { NextRequest } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export interface UploadOptions {
  maxSize: number
  allowedTypes: string[]
  uploadDir: string
  quality: number
}

export const defaultUploadOptions: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  uploadDir: path.join(process.cwd(), 'public/images'),
  quality: 80,
}

export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const hash = crypto.randomBytes(8).toString('hex')
  const extension = '.webp'
  return `${timestamp}-${hash}${extension}`
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

export function validateFileType(fileType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(fileType)
}

export function validateFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize
}

export async function processImage(
  buffer: Buffer,
  outputPath: string,
  quality: number = 80
): Promise<void> {
  await sharp(buffer)
    .webp({ quality })
    .toFile(outputPath)
}

export async function processImageToBuffer(
  buffer: Buffer,
  quality: number = 80
): Promise<Buffer> {
  return sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

export function getUploadPath(entityType: 'listing' | 'agent' | 'category', entityId?: string): string {
  const basePath = path.join(defaultUploadOptions.uploadDir, `${entityType}s`);
  return entityId ? path.join(basePath, entityId) : basePath;
}

export function getPublicUrl(entityType: 'listing' | 'agent' | 'category', entityId: string | undefined, fileName: string): string {
  const basePath = `/images/${entityType}s`;
  return entityId ? `${basePath}/${entityId}/${fileName}` : `${basePath}/${fileName}`;
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

export async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    await fs.rmdir(dirPath, { recursive: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

export async function getFilesInDirectory(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath)
    return files.filter(file => file.endsWith('.webp'))
  } catch {
    return []
  }
}

export async function handleImageUpload(file: File, uploadPath: string, entityId?: string): Promise<{ url: string }> {
  // Validate file type
  if (!validateFileType(file.type, defaultUploadOptions.allowedTypes)) {
    throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
  }

  // Validate file size
  if (!validateFileSize(file.size, defaultUploadOptions.maxSize)) {
    throw new Error('File size exceeds the maximum limit of 5MB.');
  }

  // Generate a unique filename
  const fileName = generateFileName(file.name);

  // Get the upload directory path
  const entityType = uploadPath === 'listings' ? 'listing' : 
                    uploadPath === 'agents' ? 'agent' : 'category';
  const uploadDir = getUploadPath(entityType, entityId);

  // Ensure the upload directory exists
  await ensureDirectoryExists(uploadDir);

  // Get the full file path
  const filePath = path.join(uploadDir, fileName);

  // Convert the file to a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Process and save the image
  await processImage(buffer, filePath, defaultUploadOptions.quality);

  // Return the public URL
  return {
    url: getPublicUrl(entityType, entityId, fileName)
  };
}

export async function moveTempImageToEntity(
  tempUrl: string, 
  entityType: 'listing' | 'agent' | 'category', 
  entityId: string
): Promise<string> {
  if (!tempUrl.startsWith('/images/temp/')) {
    // Image is not temporary, return as-is
    return tempUrl
  }

  const fileName = path.basename(tempUrl)
  const tempPath = path.join(process.cwd(), 'public', tempUrl)
  
  // Create destination directory
  const destDir = getUploadPath(entityType, entityId)
  await ensureDirectoryExists(destDir)
  
  const destPath = path.join(destDir, fileName)
  
  try {
    // Check if temp file exists
    await fs.access(tempPath)
    
    // Move file from temp to destination
    await fs.rename(tempPath, destPath)
    
    // Return new public URL
    return getPublicUrl(entityType, entityId, fileName)
  } catch (error) {
    console.error('Error moving temp image:', error)
    // If move fails, return original temp URL
    return tempUrl
  }
}