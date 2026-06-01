import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const supabase = await createServerSupabase();

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;

      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_payment_id: payment.id,
        })
        .eq('razorpay_order_id', payment.order_id);

      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('razorpay_order_id', payment.order_id)
        .single();

      if (order?.id) {
        await supabase.from('order_events').insert({
          order_id: order.id,
          label: 'Payment captured',
          details: `Webhook received for payment ${payment.id}.`,
        });
      }
    }

    if (event.event === 'refund.created') {
      const refund = event.payload.refund.entity;

      await supabase
        .from('orders')
        .update({
          payment_status: 'refunded',
          status: 'refunded',
        })
        .eq('razorpay_payment_id', refund.payment_id);

      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('razorpay_payment_id', refund.payment_id)
        .single();

      if (order?.id) {
        await supabase.from('order_events').insert({
          order_id: order.id,
          label: 'Refund created',
          details: `Refund ${refund.id} created for payment ${refund.payment_id}.`,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook/razorpay]', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}