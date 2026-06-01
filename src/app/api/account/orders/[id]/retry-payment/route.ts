import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/razorpay';

const RETRY_WINDOW_MINUTES = 30;

function isExpired(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > RETRY_WINDOW_MINUTES * 60 * 1000;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        order_number,
        status,
        payment_status,
        total_inr,
        razorpay_order_id,
        razorpay_payment_id,
        created_at
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid' || order.razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 409 }
      );
    }

    if (order.status !== 'pending' && order.status !== 'expired') {
      return NextResponse.json(
        { error: 'Order is not retryable' },
        { status: 409 }
      );
    }

    const expired = isExpired(order.created_at);

    let razorpayOrderId = order.razorpay_order_id;

    if (!razorpayOrderId || expired) {
      const razorpayOrder = await createRazorpayOrder(
        Number(order.total_inr),
        order.order_number
      );

      razorpayOrderId = razorpayOrder.id;

      const nextStatus = order.status === 'expired' ? 'pending' : order.status;

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: nextStatus,
          payment_status: 'pending',
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to refresh payment order' },
          { status: 500 }
        );
      }

      await supabase.from('order_events').insert({
        order_id: order.id,
        label: 'Payment retry initialized',
        details: 'A new Razorpay order was generated for retry.',
      });
    } else {
      await supabase.from('order_events').insert({
        order_id: order.id,
        label: 'Payment retry opened',
        details: 'Existing Razorpay order reused for retry.',
      });
    }

    return NextResponse.json({
      order_id: order.id,
      order_number: order.order_number,
      razorpay_order_id: razorpayOrderId,
      amount: Number(order.total_inr) * 100,
      currency: 'INR',
      retryable_until: new Date(
        new Date(order.created_at).getTime() + RETRY_WINDOW_MINUTES * 60 * 1000
      ).toISOString(),
    });
  } catch (error) {
    console.error('[account/orders/retry-payment]', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment retry' },
      { status: 500 }
    );
  }
}