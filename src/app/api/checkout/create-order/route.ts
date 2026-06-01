import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { addressSchema } from '@/lib/validations';

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value = 'NAE-';
  for (let i = 0; i < 8; i++) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const addressResult = addressSchema.safeParse(body.shipping_address);
    if (!addressResult.success) {
      return NextResponse.json({ error: 'Invalid shipping address' }, { status: 422 });
    }

    const items: { variant_id: string; quantity: number }[] = body.items ?? [];
    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 422 });
    }

    const supabase = await createServerSupabase();
    const {
    data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const variantIds = items.map((item) => item.variant_id);

    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('id, product_id, price_inr, stock')
      .in('id', variantIds);

    if (variantsError) {
      return NextResponse.json({ error: 'Failed to load variants' }, { status: 500 });
    }

    const missingIds = items
      .filter((item) => !variants?.find((variant) => variant.id === item.variant_id))
      .map((item) => item.variant_id);

    let fallbackProducts: { id: string; product_id: string; price_inr: number; stock: number }[] = [];

    if (missingIds.length) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price_inr, name')
        .in('id', missingIds);

      if (productsError) {
        return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
      }

      fallbackProducts = (products ?? []).map((product) => ({
        id: product.id,
        product_id: product.id,
        price_inr: Number(product.price_inr),
        stock: 999,
      }));
    }

    const allPurchasable = [...(variants ?? []), ...fallbackProducts];

    let subtotal = 0;
    const normalizedItems: {
      variant_id: string;
      product_id: string;
      quantity: number;
      price_inr: number;
    }[] = [];

    for (const item of items) {
      const matched = allPurchasable.find((entry) => entry.id === item.variant_id);

      if (!matched) {
        return NextResponse.json({ error: 'Product not found' }, { status: 422 });
      }

      if (matched.stock < item.quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 422 });
      }

      subtotal += Number(matched.price_inr) * item.quantity;

      normalizedItems.push({
        variant_id: matched.id,
        product_id: matched.product_id,
        quantity: item.quantity,
        price_inr: Number(matched.price_inr),
      });
    }

    const shippingFee = subtotal >= 599 ? 0 : 79;
const total = subtotal + shippingFee;
const orderNumber = generateOrderNumber();

const razorpayOrder = await createRazorpayOrder(total, orderNumber);

console.log('[auth] route user', user?.id ?? null);

const { data: insertedOrder, error: orderInsertError } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    order_number: orderNumber,
    status: 'pending',
    payment_status: 'pending',
    subtotal_inr: subtotal,
    shipping_inr: shippingFee,
    discount_inr: 0,
    total_inr: total,
    shipping_address: addressResult.data,
    razorpay_order_id: razorpayOrder.id,
  })
  .select('id, order_number, razorpay_order_id')
  .single();

console.log('[create-order] inserted order with razorpay id', {
  insertedOrder,
  orderInsertError,
  razorpayOrderId: razorpayOrder.id,
});

if (orderInsertError || !insertedOrder) {
  return NextResponse.json(
    { error: orderInsertError?.message ?? 'Failed to create order' },
    { status: 500 }
  );
}

const productIds = normalizedItems.map((item) => item.product_id);

const { data: productRows, error: productRowsError } = await supabase
  .from('products')
  .select('id, name')
  .in('id', productIds);

if (productRowsError) {
  return NextResponse.json({ error: 'Failed to load product names' }, { status: 500 });
}

const productMap = Object.fromEntries((productRows ?? []).map((row) => [row.id, row.name]));

const { error: orderItemsError } = await supabase.from('order_items').insert(
  normalizedItems.map((item) => ({
    order_id: insertedOrder.id,
    product_id: item.product_id,
    product_variant_id: item.variant_id === item.product_id ? null : item.variant_id,
    product_name: productMap[item.product_id] ?? 'Product',
    quantity: item.quantity,
    price_inr: item.price_inr,
  }))
);

if (orderItemsError) {
  return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
}

await supabase.from('order_events').insert({
  order_id: insertedOrder.id,
  label: 'Order created',
  details: 'Pending order created and Razorpay order initialized.',
});

console.log('[create-order] response payload', {
  order_id: insertedOrder.id,
  order_number: insertedOrder.order_number,
  razorpay_order_id: razorpayOrder.id,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
});

return NextResponse.json({
  order_id: insertedOrder.id,
  order_number: insertedOrder.order_number,
  razorpay_order_id: razorpayOrder.id,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
});
  } catch (error) {
    console.error('[checkout/create-order]', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}