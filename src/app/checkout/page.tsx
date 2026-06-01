'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
] as const;

type FormState = {
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

const FIELD_CONFIG: Array<{
  id: keyof FormState;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  span?: string;
}> = [
  {
    id: 'full_name',
    label: 'Full name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
  },
  {
    id: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '10-digit mobile number',
    required: true,
  },
  {
    id: 'line1',
    label: 'Address line 1',
    type: 'text',
    placeholder: 'House name, street, area',
    required: true,
    span: 'sm:col-span-2',
  },
  {
    id: 'line2',
    label: 'Address line 2',
    type: 'text',
    placeholder: 'Apartment, landmark (optional)',
    required: false,
    span: 'sm:col-span-2',
  },
  {
    id: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'City',
    required: true,
  },
  {
    id: 'postal_code',
    label: 'PIN code',
    type: 'text',
    placeholder: 'PIN code',
    required: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, clearCart, total, removeItem, updateQty } =
    useCartStore();

  const [form, setForm] = useState<FormState>({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'IN',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotalAmount = subtotal();
  const shippingAmount = shipping();
  const totalAmount = total();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function updateForm(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) return;

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

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length || loading) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        shipping_address: form,
        items: items.map((item) => ({
          variant_id: item.variant?.id ?? item.product.id,
          quantity: item.quantity,
        })),
      };

      const createRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(createData.error ?? 'Failed to create order');
      }

      if (!createData.order_id || !createData.razorpay_order_id) {
        throw new Error('Invalid create-order response');
      }

      await loadRazorpayScript();

      await new Promise<void>((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: createData.amount,
          currency: createData.currency,
          name: 'naevii.co',
          description: 'Handcrafted Jewellery Order',
          order_id: createData.razorpay_order_id,
          prefill: {
            name: form.full_name,
            contact: form.phone,
          },
          theme: {
            color: '#5b2d8e',
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: createData.order_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                throw new Error(
                  verifyData.error ?? 'Payment verification failed'
                );
              }

              clearCart();
              router.push(
                `/checkout/success?order=${encodeURIComponent(
                  createData.order_number
                )}`
              );
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });

        razorpay.open();
      });
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <main className="relative overflow-hidden bg-pearl">
        <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[#ead8fb]/50 blur-3xl" />
        <div className="absolute right-[-8%] top-16 h-80 w-80 rounded-full bg-[#f4dce8]/70 blur-3xl" />

        <section className="section-shell relative flex min-h-[70vh] items-center py-14 sm:py-20">
          <div className="mx-auto max-w-2xl rounded-[2.2rem] border border-white/60 bg-white/80 p-8 text-center shadow-lifted backdrop-blur-xl sm:p-12">
            <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
              Checkout
            </span>

            <h1 className="mt-6 font-display text-4xl text-dusk sm:text-5xl">
              Your cart feels empty
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-dusk/68">
              Add a few pieces you love, then return here to complete your order
              with secure payment and delivery across India.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,45,142,0.22)]"
              >
                Go to shop
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[#ead8fb]/50 blur-3xl" />
      <div className="absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-[#f4dce8]/70 blur-3xl" />

      <section className="section-shell relative py-10 sm:py-14 lg:py-16">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-plum/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum shadow-soft backdrop-blur">
              Secure checkout
            </span>

            <h1 className="mt-4 font-display text-4xl text-dusk sm:text-5xl lg:text-6xl">
              Complete your order
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-dusk/68 sm:text-lg">
              A refined final step for your handcrafted order — shipping details
              on the left, a live order summary on the right, and secure Razorpay
              payment when you’re ready.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-dusk/8 bg-white/70 px-4 py-2 text-sm text-dusk/60 shadow-soft backdrop-blur">
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </div>
            <div className="rounded-full border border-dusk/8 bg-white/70 px-4 py-2 text-sm text-dusk/60 shadow-soft backdrop-blur">
              Pan-India shipping
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-lifted backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-plum text-sm font-semibold text-white shadow-soft">
                01
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-dusk/40">
                  Delivery details
                </p>
                <h2 className="font-display text-3xl text-dusk">
                  Shipping address
                </h2>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                {FIELD_CONFIG.map((field) => (
                  <label
                    key={field.id}
                    className={`block ${field.span ?? ''}`}
                  >
                    <span className="mb-2 block text-sm font-medium text-dusk/70">
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      value={form[field.id]}
                      onChange={(e) => updateForm(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition duration-300 placeholder:text-dusk/30 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dusk/70">
                    State
                  </span>
                  <select
                    value={form.state}
                    onChange={(e) => updateForm('state', e.target.value)}
                    required
                    className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition duration-300 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-[1.6rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(248,235,243,0.72),rgba(255,255,255,0.96),rgba(243,233,255,0.78))] p-5 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-plum">
                    Secure payment
                  </p>
                  <p className="mt-3 text-sm leading-7 text-dusk/66">
                    You’ll be redirected to Razorpay to complete payment safely.
                    Your order summary stays unchanged until payment is verified.
                  </p>
                </div>
              </div>

              {error ? (
                <div className="rounded-[1.4rem] border border-[#e8c7d8] bg-[#fff7fb] px-4 py-3 text-sm text-[#8e3d62]">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 border-t border-dusk/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm leading-7 text-dusk/56">
                  By continuing, you confirm that your shipping information is
                  accurate and your order is ready for payment.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-w-[250px] items-center justify-center rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition duration-500 hover:-translate-y-0.5 hover:bg-plum disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-3">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing…
                    </span>
                  ) : (
                    <>Pay ₹{totalAmount.toLocaleString('en-IN')} with Razorpay</>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] border border-dusk/8 bg-dusk text-white shadow-lifted">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Order summary
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <h2 className="font-display text-3xl">Your pieces</h2>
                  <p className="text-sm text-white/60">
                    {itemCount} item{itemCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="max-h-[420px] space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.92),rgba(244,220,232,0.75),rgba(91,45,142,0.22))] text-xs font-semibold uppercase tracking-[0.18em] text-dusk shadow-[inset_0_1px_10px_rgba(255,255,255,0.45)]">
                        0{index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-medium text-white">
                              {item.product.name}
                            </p>
                            {item.variant ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                                {item.variant.color}
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs uppercase tracking-[0.16em] text-white/45 transition hover:text-white"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                item.quantity > 1 &&
                                updateQty(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-white transition hover:bg-white/10"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-white">
                            ₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                <div className="space-y-3 text-sm text-white/68">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingAmount === 0
                        ? 'Free'
                        : `₹${shippingAmount.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-medium text-white/80">Total</span>
                  <span className="font-display text-3xl text-white">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-plum">
                Why this feels secure
              </p>

              <div className="mt-5 grid gap-3">
                {[
                  'Razorpay-secured payment flow',
                  'Live order total before payment',
                  'Editable quantities before checkout',
                  'Shipping details collected clearly',
                ].map((point, index) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[1.2rem] border border-dusk/8 bg-pearl px-4 py-3"
                  >
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum text-xs font-semibold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-dusk/66">{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.4rem] bg-[linear-gradient(160deg,rgba(243,233,255,0.88),rgba(255,255,255,1),rgba(248,235,243,0.78))] px-5 py-4">
                <p className="font-display text-2xl text-dusk">
                  Handcrafted order,
                  <br />
                  refined final step.
                </p>
                <p className="mt-2 text-sm leading-7 text-dusk/62">
                  Your checkout should feel as considered as the piece you’re
                  about to receive.
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href="/shop"
                  className="text-sm font-medium text-plum transition hover:text-dusk"
                >
                  Continue shopping →
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}