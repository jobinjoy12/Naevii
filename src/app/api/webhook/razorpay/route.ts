import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCustomerPaymentConfirmedEmail } from '@/lib/notifications/email';
// import {
//   sendAdminPaidOrderWhatsApp,
//   sendCustomerPaidWhatsApp,
// } from '@/lib/notifications/whatsapp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(rawBody: string, signature: string) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') ?? '';
    const eventId = request.headers.get('x-razorpay-event-id') ?? '';

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.event as string;

if (!eventId) {
  return NextResponse.json({ error: 'Missing x-razorpay-event-id' }, { status: 400 });
}

if (
  eventName !== 'payment.captured' &&
  eventName !== 'order.paid' &&
  eventName !== 'refund.created'
) {
  return NextResponse.json({ received: true, ignored: true });
}

const { data: existingEvent, error: existingEventError } = await supabase
  .from('webhook_events')
  .select('id')
  .eq('provider', 'razorpay')
  .eq('event_id', eventId)
  .maybeSingle();

if (existingEventError) {
  return NextResponse.json({ error: existingEventError.message }, { status: 500 });
}

if (existingEvent) {
  return NextResponse.json({ received: true, duplicate: true, eventId });
}

const { error: webhookEventInsertError } = await supabase
  .from('webhook_events')
  .insert({
    provider: 'razorpay',
    event_id: eventId,
    event_type: eventName,
    payload: event,
  });

if (webhookEventInsertError) {
  return NextResponse.json(
    { error: webhookEventInsertError.message },
    { status: 500 }
  );
}

    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const payment = event.payload?.payment?.entity ?? null;
      const orderEntity = event.payload?.order?.entity ?? null;

      const razorpayOrderId = payment?.order_id || orderEntity?.id;

      if (!razorpayOrderId) {
        return NextResponse.json({ error: 'Missing razorpay order id' }, { status: 400 });
      }

      const { data: order, error: orderFetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (orderFetchError || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (order.payment_status === 'paid') {
        return NextResponse.json({ received: true, duplicate: true, eventId });
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_payment_id: payment?.id ?? order.razorpay_payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      const { error: orderEventError } = await supabase.from('order_events').insert({
        order_id: order.id,
        label: 'Payment captured',
        details: `Webhook received for event ${eventName}${payment?.id ? ` and payment ${payment.id}` : ''}.`,
      });

      if (orderEventError) {
        console.error('[webhook/razorpay] failed to insert order event', orderEventError);
      }

      const customerName =
        order.shipping_address?.full_name || payment?.notes?.customerName || 'Customer';
      const customerEmail =
        order.shipping_address?.email || payment?.notes?.customerEmail || '';
      const customerPhone =
        order.shipping_address?.phone || payment?.notes?.customerPhone || '';

      const adminOrderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order.id}`;
      const trackingUrl =
        order.tracking_url || `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.id}`;

      try {
        if (customerEmail) {
          await sendCustomerPaymentConfirmedEmail({
            orderNumber: order.order_number,
            customerName,
            customerEmail,
            totalInr: Number(order.total_inr),
          });
        }

        // if (customerPhone) {
        //   await sendCustomerPaidWhatsApp({
        //     customerPhone,
        //     customerName,
        //     orderNumber: order.order_number,
        //     totalInr: Number(order.total_inr),
        //     trackingUrl,
        //     storeName: process.env.STORE_NAME || 'Our Store',
        //   });
        // }

        // await sendAdminPaidOrderWhatsApp({
        //   orderNumber: order.order_number,
        //   customerName,
        //   totalInr: Number(order.total_inr),
        //   phone: customerPhone || '-',
        //   adminOrderUrl,
        // });
      } catch (notificationError) {
        console.error('[webhook/razorpay] notification send failed', notificationError);
      }
    }

    if (eventName === 'refund.created') {
      const refund = event.payload?.refund?.entity;

      if (!refund?.payment_id) {
        return NextResponse.json({ error: 'Missing refund payment id' }, { status: 400 });
      }

      const { error: refundUpdateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'refunded',
          status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', refund.payment_id);

      if (refundUpdateError) {
        return NextResponse.json({ error: refundUpdateError.message }, { status: 500 });
      }

      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('razorpay_payment_id', refund.payment_id)
        .single();

      if (order?.id) {
        const { error: refundEventError } = await supabase.from('order_events').insert({
          order_id: order.id,
          label: 'Refund created',
          details: `Refund ${refund.id} created for payment ${refund.payment_id}.`,
        });

        if (refundEventError) {
          console.error('[webhook/razorpay] failed to insert refund event', refundEventError);
        }
      }
    }

    return NextResponse.json({ received: true, eventId });
  } catch (error) {
    console.error('[webhook/razorpay]', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}