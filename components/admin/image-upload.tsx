'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  entityType: 'listings' | 'agents' | 'categories';
  entityId?: string;
  disabled?: boolean;
  dragDropText?: string;
  fileTypesText?: string;
  remainingText?: string;
  chooseFilesText?: string;
}

export function ImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  entityType,
  entityId,
  disabled = false,
  dragDropText = 'Drag and drop images here, or click to select files',
  fileTypesText = 'JPEG, PNG, WebP up to 10MB each',
  remainingText = '{count} slots remaining',
  chooseFilesText = 'Choose Files'
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    onImagesChange(newImages);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    let uploadUrl: string;
    
    if (entityId) {
      // Use specific entity endpoint when entityId exists
      uploadUrl = `/api/upload/${entityType}/${entityId}`;
    } else {
      // Use temporary upload endpoint for uploads before entity creation
      uploadUrl = `/api/upload/temp`;
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url || data.path;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;
    
    const remainingSlots = maxImages - images.length;
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(uploadImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedUrls];
      updateImages(newImages);
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {

      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, entityType, entityId, disabled]);

  const removeImage = (indexToRemove: number) => {
    if (disabled) return;
    
    const newImages = images.filter((_, index) => index !== indexToRemove);
    updateImages(newImages);
    toast.success('Image removed');
  };

  const remainingSlots = maxImages - images.length;
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: disabled || uploading,
    maxFiles: remainingSlots
  });

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  {!disabled && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {remainingSlots > 0 && !disabled && (
        <Card className="border-dashed border-2 border-zinc-300 dark:border-zinc-700">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                {uploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-zinc-400 mx-auto animate-spin" />
                    <p className="text-zinc-600 dark:text-zinc-400">Uploading images...</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center">
                      {isDragActive ? (
                        <Upload className="h-12 w-12 text-blue-500" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-zinc-400" />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
                        {isDragActive ? 'Drop images here' : 'Upload images'}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {dragDropText}
                      </p>
                      <p className="text-xs text-zinc-400 mt-2">
                        {fileTypesText}. {remainingText.replace('{count}', remainingSlots.toString())}
                      </p>
                    </div>

                    <Button type="button" variant="outline" className="mt-4">
                      <Upload className="w-4 h-4 mr-2" />
                      {chooseFilesText}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Counter */}
      <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  );
}