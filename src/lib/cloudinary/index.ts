// Server-side: signed upload (for admin product images)
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = 'naevii/products'
): Promise<{ url: string; public_id: string }> {
  const { v2: cloudinary } = await import('cloudinary');

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key:    process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

// Client-side: unsigned upload preset (for custom order inspiration images)
export async function uploadUnsigned(file: File): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', 'naevii/customs');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return { url: data.secure_url, public_id: data.public_id };
}