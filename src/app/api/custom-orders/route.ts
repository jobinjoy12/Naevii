import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('BODY:', body);

    const { data, error } = await supabase
  .from('custom_orders')
  .insert([
    {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      category: body.category,
      budget_range: body.budget_range || null,
      inspiration_urls: body.inspiration_urls
        ? [body.inspiration_urls]
        : [],
      notes: body.notes,
    },
  ])
  .select();

  

    if (error) {
      console.error('SUPABASE ERROR:', error);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('ROUTE ERROR:', err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}