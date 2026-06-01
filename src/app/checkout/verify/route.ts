import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';
console.log('[verify] module loaded');

export async function POST(request: NextRequest) {
  console.log('[verify] POST route hit');
  try {
    const body = await request.json();
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    console.log('[verify] Incoming payload', {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log('[verify] Missing required fields', {
        order_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const { data: orderRow, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, payment_status, razorpay_order_id')
      .eq('id', order_id)
      .single();

    console.log('[verify] Order fetch result', {
      orderRow,
      orderFetchError,
    });

    if (orderFetchError || !orderRow) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (orderRow.payment_status === 'paid') {
      console.log('[verify] Order already marked paid', { order_id });
      return NextResponse.json({ success: true, order_id });
    }

    if (orderRow.razorpay_order_id !== razorpay_order_id) {
      console.log('[verify] Razorpay order mismatch', {
        db_razorpay_order_id: orderRow.razorpay_order_id,
        incoming_razorpay_order_id: razorpay_order_id,
      });

      return NextResponse.json({ error: 'Razorpay order mismatch' }, { status: 400 });
    }

    const valid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    console.log('[verify] Signature validation result', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      valid,
    });

    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const {
  data: updatedOrder,
  error: updateError,
  status: updateStatus,
  statusText: updateStatusText,
} = await supabase
  .from('orders')
  .update({
    payment_status: 'paid',
    status: 'confirmed',
    razorpay_payment_id,
  })
  .eq('id', order_id)
  .select();

console.log('[verify] Supabase update result', {
  updatedOrder,
  updateError,
  updateStatus,
  updateStatusText,
});

if (updateError) {
  return NextResponse.json(
    { error: 'DB update failed', details: updateError.message },
    { status: 500 }
  );
}

if (!updatedOrder || updatedOrder.length === 0) {
  return NextResponse.json(
    { error: 'No order row was updated', order_id },
    { status: 500 }
  );
}

    const { data: eventInsertData, error: eventInsertError } = await supabase
      .from('order_events')
      .insert({
        order_id,
        label: 'Payment received',
        details: `Razorpay payment ${razorpay_payment_id} verified successfully.`,
      })
      .select();

    console.log('[verify] order_events insert result', {
      eventInsertData,
      eventInsertError,
    });

    return NextResponse.json({ success: true, order_id });
  } catch (error) {
    console.error('[verify] Unexpected error', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}