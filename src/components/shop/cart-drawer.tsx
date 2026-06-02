'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FREE_SHIPPING_THRESHOLD = 599;

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    shipping,
    total,
    removeItem,
    updateQty,
  } = useCartStore();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const subtotalAmount = subtotal();
  const shippingAmount = shipping();
  const totalAmount = total();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotalAmount
  );
  const progress = Math.min(
    100,
    (subtotalAmount / FREE_SHIPPING_THRESHOLD) * 100
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[rgba(29,23,33,0.34)] backdrop-blur-[6px] max-md:bg-[rgba(29,23,33,0.42)] max-md:backdrop-blur-[10px]"
        onClick={closeCart}
        style={{ animation: 'cartBackdropIn 260ms ease-out both' }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col overflow-hidden bg-white/88 shadow-[0_20px_80px_rgba(23,18,28,0.24)] backdrop-blur-2xl max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:h-[92dvh] max-md:rounded-t-[1.8rem] max-md:border-t max-md:border-white/50 max-md:shadow-[0_-10px_40px_rgba(23,18,28,0.18)] sm:max-w-[440px] sm:border-l sm:border-white/50 lg:max-w-[470px]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{ animation: 'cartSlideIn 420ms cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Mobile top handle + close bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/72 px-5 py-3 backdrop-blur-xl max-md:rounded-t-[1.8rem] sm:hidden">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-plum">
              <ShoppingBag size={13} />
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dusk/8 bg-white/80 text-dusk transition duration-300 active:scale-[0.985] hover:bg-pearl hover:text-plum"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Desktop header */}
        <div className="relative overflow-hidden border-b border-dusk/8 px-5 py-5 max-md:hidden sm:px-6">
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(244,220,232,0.35),rgba(255,255,255,0))]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                <ShoppingBag size={14} />
                Shopping bag
              </span>
              <h2 className="mt-4 font-display text-3xl text-dusk sm:text-4xl">
                Your cart
              </h2>
              <p className="mt-1 text-sm text-dusk/56">
                {itemCount} item{itemCount !== 1 ? 's' : ''} selected
              </p>
            </div>
            <button
              onClick={closeCart}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dusk/8 bg-white/70 text-dusk transition duration-300 hover:-translate-y-0.5 hover:bg-pearl hover:text-plum"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,0.12),rgba(244,220,232,0.55),rgba(255,255,255,1))] text-plum shadow-soft">
              <ShoppingBag size={34} />
            </div>
            <h3 className="mt-6 font-display text-3xl text-dusk">
              Your cart is empty
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-dusk/60">
              Add a few handcrafted pieces you love, then return here to review
              your order before checkout.
            </p>
            <button
              onClick={closeCart}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:bg-plum"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {/* Shipping progress card */}
              <div className="rounded-[1.4rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(244,220,232,0.5),rgba(255,255,255,0.98),rgba(243,233,255,0.7))] p-4 shadow-soft sm:rounded-[1.6rem]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-plum sm:text-xs">
                      Delivery note
                    </p>
                    <p className="mt-2 text-sm leading-7 text-dusk/66">
                      {shippingAmount === 0
                        ? 'You’ve unlocked free shipping on this order.'
                        : `You’re ₹${remainingForFreeShipping.toLocaleString(
                            'en-IN'
                          )} away from free shipping.`}
                    </p>
                  </div>
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-plum shadow-soft">
                    <Truck size={18} />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/80">
                  <div
                    className="h-full rounded-full bg-plum transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 space-y-4">
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    className="group rounded-[1.35rem] border border-dusk/8 bg-white p-3 shadow-[0_10px_28px_rgba(33,28,26,0.05)] transition duration-300 active:scale-[0.985] sm:rounded-[1.5rem] sm:p-3 sm:hover:-translate-y-0.5 sm:hover:shadow-[0_16px_34px_rgba(33,28,26,0.08)]"
                    style={{
                      animation: `fadeUp 0.45s ease ${index * (typeof window !== 'undefined' && window.innerWidth < 640 ? 35 : 70)}ms both`,
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-pearl sm:rounded-[1.2rem]">
                        {item.product.images?.[0]?.image_url ? (
                          <Image
                            src={item.product.images[0].image_url}
                            alt={
                              item.variant?.color
                                ? `${item.product.name} - ${item.variant.color}`
                                : item.product.name
                            }
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.04]"
                            sizes="96px"
                          />
                        ) : (
                          <div className="h-full w-full bg-[linear-gradient(160deg,rgba(244,220,232,0.55),rgba(255,255,255,1),rgba(234,216,251,0.45))]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-5 text-dusk break-words line-clamp-2">
  {item.product.name}
</p>
                            {item.variant ? (
                              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-dusk/42 sm:text-[11px]">
                                {[item.variant.color, item.variant.size]
                                  .filter(Boolean)
                                  .join(' • ')}
                              </p>
                            ) : null}
                            <p className="mt-2 text-xs text-dusk/45">
                              ₹{item.price_inr.toLocaleString('en-IN')} each
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-dusk/35 transition duration-300 hover:bg-[#fff1f1] hover:text-[#b14a4a]"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-dusk/10 bg-pearl/60 p-1">
                            <button
                              onClick={() =>
                                item.quantity > 1 &&
                                updateQty(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-dusk/55 transition duration-300 hover:bg-white hover:text-dusk disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-medium text-dusk">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-dusk/55 transition duration-300 hover:bg-white hover:text-dusk"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-dusk">
                            ₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Bottom sticky CTA area */}
            <div className="border-t border-dusk/8 bg-white/92 px-5 py-5 max-md:sticky max-md:bottom-0 max-md:bg-white/96 max-md:backdrop-blur-xl sm:px-6">
              <div className="rounded-[1.3rem] border border-dusk/8 bg-pearl px-4 py-4 sm:rounded-[1.4rem]">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dusk">Secure checkout</p>
                    <p className="mt-1 text-xs leading-6 text-dusk/56">
                      Review your order, confirm delivery details, and complete
                      payment safely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-dusk/68">
                  <span>Subtotal</span>
                  <span>₹{subtotalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-dusk/68">
                  <span>Shipping</span>
                  <span>
                    {shippingAmount === 0 ? (
                      <span className="font-medium text-green-700">Free</span>
                    ) : (
                      `₹${shippingAmount.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-dusk/8 pt-3">
                  <span className="font-medium text-dusk">Total</span>
                  <span className="font-display text-[1.8rem] text-dusk sm:text-3xl">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition duration-300 active:scale-[0.985] sm:min-h-0 sm:duration-500 sm:hover:-translate-y-0.5 sm:hover:bg-plum sm:hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]"
                >
                  Proceed to checkout
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={closeCart}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-dusk/10 bg-white px-6 py-3 text-sm font-medium text-dusk/70 transition duration-300 active:scale-[0.985] sm:min-h-0 sm:duration-300 hover:border-plum/20 hover:bg-pearl hover:text-plum"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}