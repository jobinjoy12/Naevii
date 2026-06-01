'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Order } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#fff7e8] text-[#9a6a12] border-[#f3dfb2]',
  confirmed: 'bg-[#eef6ff] text-[#2d5d9f] border-[#d5e6ff]',
  processing: 'bg-[#eef6ff] text-[#2d5d9f] border-[#d5e6ff]',
  shipped: 'bg-[#f1efff] text-[#5a46b4] border-[#ddd8ff]',
  delivered: 'bg-[#edf8ef] text-[#32724b] border-[#d6eddc]',
  cancelled: 'bg-[#fff1f1] text-[#b14a4a] border-[#f2d4d4]',
  refunded: 'bg-[#f4f4f5] text-[#6c6d72] border-[#e4e4e7]',
  expired: 'bg-[#f4f4f5] text-[#6c6d72] border-[#e4e4e7]',
};

function getUiStatus(order: Order) {
  if (order.payment_status === 'paid') return 'confirmed';

  const createdAt = new Date(order.created_at).getTime();
  const ageMs = Date.now() - createdAt;
  const isExpired = ageMs > 30 * 60 * 1000;

  if (
    order.status === 'pending' &&
    order.razorpay_order_id &&
    !order.razorpay_payment_id
  ) {
    return isExpired ? 'expired' : 'pending';
  }

  return order.status;
}

function getStatusLabel(status: string) {
  if (status === 'pending') return 'Awaiting payment';
  if (status === 'expired') return 'Payment expired';
  return status;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersListClient({ orders }: { orders: Order[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const delivered = orders.filter(
      (order) => getUiStatus(order) === 'delivered'
    ).length;
    const pending = orders.filter(
      (order) => getUiStatus(order) === 'pending'
    ).length;
    const paid = orders.filter((order) => order.payment_status === 'paid').length;

    return { delivered, pending, paid };
  }, [orders]);

  async function ensureRazorpayLoaded() {
    if ((window as any).Razorpay) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener(
          'error',
          () => reject(new Error('Failed to load Razorpay SDK')),
          { once: true }
        );
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }

  async function retryPayment(orderId: string) {
    try {
      setLoadingId(orderId);

      const res = await fetch(`/api/account/orders/${orderId}/retry-payment`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retry payment');
      }

      await ensureRazorpayLoaded();

      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: 'naevii.co',
        description: `Order ${data.order_number}`,
        retry: {
          enabled: true,
          max_count: 4,
        },
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: data.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) {
            throw new Error('Payment verification failed');
          }

          window.location.href = `/checkout/success?order=${data.order_number}`;
        },
        modal: {
          ondismiss: function () {},
        },
        theme: {
          color: '#5b2d8e',
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Unable to retry payment');
    } finally {
      setLoadingId(null);
    }
  }

  if (!orders.length) {
    return (
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-10 text-center shadow-lifted backdrop-blur-xl sm:p-14">
        <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
          No orders yet
        </span>

        <h2 className="mt-6 font-display text-4xl text-dusk">
          Your order history will appear here
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-dusk/60">
          Once you place your first naevii order, you’ll be able to revisit payment
          status, items, and order details from this page.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,45,142,0.22)]"
        >
          Browse the shop
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.6rem] border border-dusk/8 bg-white/78 p-5 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
            Paid orders
          </p>
          <p className="mt-2 font-display text-3xl text-dusk">{stats.paid}</p>
        </div>

        <div className="rounded-[1.6rem] border border-dusk/8 bg-white/78 p-5 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
            Pending payment
          </p>
          <p className="mt-2 font-display text-3xl text-dusk">{stats.pending}</p>
        </div>

        <div className="rounded-[1.6rem] border border-dusk/8 bg-white/78 p-5 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
            Delivered
          </p>
          <p className="mt-2 font-display text-3xl text-dusk">
            {stats.delivered}
          </p>
        </div>
      </section>

      <div className="space-y-5">
        {orders.map((order, index) => {
          const uiStatus = getUiStatus(order);
          const canRetry =
            uiStatus === 'pending' &&
            !!order.razorpay_order_id &&
            !order.razorpay_payment_id;

          return (
            <article
              key={order.id}
              className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-lifted sm:p-6"
              style={{
                animation: `fadeUp 0.6s ease ${index * 80}ms both`,
              }}
            >
              <div className="flex flex-col gap-5 border-b border-dusk/8 pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,1),rgba(126,76,177,1))] text-sm font-semibold text-white shadow-soft">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                      Order number
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-dusk">
                      {order.order_number}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-dusk/58">
                      <span>{formatDate(order.created_at)}</span>
                      <span className="h-1 w-1 rounded-full bg-dusk/20" />
                      <span>
                        {order.order_items?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ) ?? 0}{' '}
                        item
                        {(order.order_items?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ) ?? 0) !== 1
                          ? 's'
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${STATUS_STYLES[uiStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                  >
                    {getStatusLabel(uiStatus)}
                  </span>

                  <p className="font-display text-3xl text-dusk">
                    ₹{Number(order.total_inr).toLocaleString('en-IN')}
                  </p>

                  {canRetry ? (
                    <button
                      type="button"
                      onClick={() => retryPayment(order.id)}
                      disabled={loadingId === order.id}
                      className="inline-flex items-center justify-center rounded-full bg-plum px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(91,45,142,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingId === order.id ? 'Opening…' : 'Pay now'}
                    </button>
                  ) : null}
                </div>
              </div>

              {order.order_items?.length ? (
                <div className="mt-5 space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-dusk/8 bg-pearl px-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-dusk">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-dusk/42">
                          {item.variant_label
                            ? `${item.variant_label} · `
                            : ''}
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-dusk/72">
                        ₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}