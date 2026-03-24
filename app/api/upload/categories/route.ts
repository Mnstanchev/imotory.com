import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/src/lib/api-utils';
import { handleImageUpload } from '@/src/lib/upload-utils';

export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/src/lib/api-auth');
    const authResult = await requireAdmin(request);
    
    if (!authResult.success) {
      return authResult.error;
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    const uploadPath = 'categories';
    const result = await handleImageUpload(file, uploadPath);

    return createResponse(result);
  } catch (error) {
    
    return createErrorResponse('Failed to upload image', 500);
  }
}