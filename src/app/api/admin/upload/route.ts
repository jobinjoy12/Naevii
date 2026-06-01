import { createServerSupabase } from '@/lib/supabase/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Auth check — admin only
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData  = await req.formData();
  const file      = formData.get('file') as File | null;
  const folder    = (formData.get('folder') as string) ?? 'naevii/products';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, folder);

  return NextResponse.json({ url: result.url, public_id: result.public_id });
}