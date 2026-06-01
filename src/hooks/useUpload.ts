'use client';

import { useState } from 'react';
import { uploadUnsigned } from '@/lib/cloudinary';

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadUnsigned(file);
      return url;
    } catch (e) {
      setError('Upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}