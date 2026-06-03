import { createServerSupabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/', request.url), {
    status: 303,
  });
}