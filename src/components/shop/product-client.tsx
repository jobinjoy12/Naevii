'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { Product, ProductVariant } from '@/types';

function getVariantLabel(variant: ProductVariant) {
  return [variant.color, variant.size].filter(Boolean).join(' / ') || 'Default';
}

export function ProductClient({
  product,
  selectedVariantId: selectedVariantIdProp,
  onVariantChange,
}: {
  product: Product;
  selectedVariantId?: string | null;
  onVariantChange?: (variantId: string) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

  const [internalSelectedVariantId, setInternalSelectedVariantId] = useState<string | null>(
  selectedVariantIdProp ?? variants[0]?.id ?? null
);

const selectedVariantId = selectedVariantIdProp ?? internalSelectedVariantId;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );

  const price = selectedVariant?.price_inr ?? product.price_inr;
  const comparePrice = product.compare_at_price_inr ?? null;
  const stock = selectedVariant?.stock ?? 99;
  const inStock = stock > 0;
  const savings =
    comparePrice && comparePrice > price ? comparePrice - price : 0;

  function handleDecrease() {
    setQty((q) => Math.max(1, q - 1));
  }

  function handleIncrease() {
    setQty((q) => Math.min(stock, q + 1));
  }

 function handleVariantSelect(variantId: string, variantStock: number) {
  if (!selectedVariantIdProp) {
    setInternalSelectedVariantId(variantId);
  }

  onVariantChange?.(variantId);

  setQty((currentQty) => Math.max(1, Math.min(currentQty, variantStock || 1)));
}

  function handleAddToCart() {
    if (!inStock) return;

    addItem(product, selectedVariant, qty);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  }

  return (
    <section className="space-y-6">
      <div
        className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-lifted backdrop-blur-xl sm:p-7"
        style={{ animation: 'fadeUp 0.55s ease both' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
              <Sparkles size={12} />
              Handcrafted piece
            </span>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="font-display text-4xl text-dusk sm:text-5xl">
                ₹{Number(price).toLocaleString('en-IN')}
              </p>

              {comparePrice ? (
                <p className="pb-1 text-base text-dusk/35 line-through">
                  ₹{Number(comparePrice).toLocaleString('en-IN')}
                </p>
              ) : null}

              {savings > 0 ? (
                <span className="mb-1 inline-flex rounded-full border border-[#d6eddc] bg-[#edf8ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#32724b]">
                  Save ₹{Number(savings).toLocaleString('en-IN')}
                </span>
              ) : null}
            </div>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              inStock
                ? 'border border-[#d6eddc] bg-[#edf8ef] text-[#32724b]'
                : 'border border-[#f2d4d4] bg-[#fff1f1] text-[#b14a4a]'
            }`}
          >
            {inStock ? `${stock} in stock` : 'Out of stock'}
          </div>
        </div>

        {product.short_description ? (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-dusk/66 sm:text-base">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
              Finish
            </p>
            <p className="mt-2 text-sm font-medium text-dusk/72">
              Thoughtfully made
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
              Feel
            </p>
            <p className="mt-2 text-sm font-medium text-dusk/72">
              Soft, refined, personal
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
              Delivery
            </p>
            <p className="mt-2 text-sm font-medium text-dusk/72">
              Pan-India shipping
            </p>
          </div>
        </div>
      </div>

      {hasVariants ? (
        <div
          className="rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-soft backdrop-blur-xl"
          style={{ animation: 'fadeUp 0.6s ease 80ms both' }}
        >
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
              Variant selection
            </p>
            <h2 className="mt-2 font-display text-3xl text-dusk">
              Choose your variant
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => {
              const active = selectedVariantId === variant.id;
              const disabled = variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleVariantSelect(variant.id, variant.stock ?? 0)}
                  className={`rounded-full border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'border-plum bg-plum text-white shadow-[0_12px_28px_rgba(91,45,142,0.2)]'
                      : 'border-dusk/10 bg-white text-dusk hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl'
                  } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
                >
                  {getVariantLabel(variant)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className="rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-soft backdrop-blur-xl"
        style={{ animation: 'fadeUp 0.65s ease 140ms both' }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
              Quantity
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-dusk/10 bg-pearl/60 p-1">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dusk/60 transition duration-300 hover:bg-white hover:text-dusk"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-[2.5rem] text-center text-sm font-semibold text-dusk">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={!inStock || qty >= stock}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dusk/60 transition duration-300 hover:bg-white hover:text-dusk disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="text-sm text-dusk/52">
                {inStock
                  ? 'Adjust quantity before adding to cart'
                  : 'This selection is currently unavailable'}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <button
              type="button"
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`inline-flex min-h-[52px] min-w-[220px] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                added
                  ? 'bg-[#edf8ef] text-[#32724b] ring-4 ring-[#d6eddc]'
                  : 'bg-dusk text-white hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to cart
                </>
              )}
            </button>

            <Link
              href="/checkout"
              className="inline-flex min-h-[52px] min-w-[190px] items-center justify-center gap-2 rounded-full border border-dusk/10 bg-white px-6 py-3.5 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
            >
              Go to checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
              <ShieldCheck size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-dusk">Secure checkout</p>
              <p className="mt-1 text-xs leading-6 text-dusk/56">
                Review your order and complete payment safely.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-dusk">Refined finish</p>
              <p className="mt-1 text-xs leading-6 text-dusk/56">
                Designed to feel personal, elegant, and giftable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {product.description ? (
        <div
          className="rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-soft backdrop-blur-xl"
          style={{ animation: 'fadeUp 0.7s ease 200ms both' }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
            Product details
          </p>
          <h3 className="mt-2 font-display text-3xl text-dusk">
            More about this piece
          </h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-dusk/66 sm:text-base">
            {product.description}
          </p>
        </div>
      ) : null}
    </section>
  );
}
