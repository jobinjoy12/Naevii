import { createServerSupabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? supabase : null;
}

export async function POST(req: NextRequest) {
  const sb = await requireAdmin();
  if (!sb) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data, error } = await sb.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
export async function PUT(req: NextRequest) {
  const sb = await requireAdmin();
  if (!sb) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...rest } = await req.json();
  const { data, error } = await sb.from('products').update(rest).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
export async function DELETE(req: NextRequest) {
  const sb = await requireAdmin();
  if (!sb) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await sb.from('products').update({ status: 'archived' }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}