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
    <section className="space-y-5 sm:space-y-6">
      {/* Price & meta card */}
      <div
        className="overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/82 p-5 shadow-lifted backdrop-blur-xl sm:rounded-[2rem] sm:p-7"
        style={{ animation: 'fadeUp 0.55s ease both' }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-plum sm:px-4 sm:py-2 sm:text-[11px]">
              <Sparkles size={12} />
              Handcrafted piece
            </span>

            <div className="mt-4 flex flex-wrap items-end gap-2 sm:mt-5 sm:gap-3">
              <p className="font-display text-[2.4rem] leading-none text-dusk sm:text-4xl lg:text-5xl">
                ₹{Number(price).toLocaleString('en-IN')}
              </p>

              {comparePrice ? (
                <p className="pb-1 text-sm text-dusk/35 line-through sm:text-base">
                  ₹{Number(comparePrice).toLocaleString('en-IN')}
                </p>
              ) : null}

              {savings > 0 ? (
                <span className="mb-0.5 inline-flex rounded-full border border-[#d6eddc] bg-[#edf8ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#32724b] sm:mb-1">
                  Save ₹{Number(savings).toLocaleString('en-IN')}
                </span>
              ) : null}
            </div>
          </div>

          <div
            className={`shrink-0 self-start rounded-full px-4 py-2 text-sm font-medium ${
              inStock
                ? 'border border-[#d6eddc] bg-[#edf8ef] text-[#32724b]'
                : 'border border-[#f2d4d4] bg-[#fff1f1] text-[#b14a4a]'
            }`}
          >
            {inStock ? `${stock} in stock` : 'Out of stock'}
          </div>
        </div>

        {product.short_description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-dusk/66 sm:mt-5 sm:text-base">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3">
          {[
            { label: 'Finish', value: 'Thoughtfully made' },
            { label: 'Feel', value: 'Soft, refined, personal' },
            { label: 'Delivery', value: 'Pan-India shipping' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.1rem] border border-dusk/8 bg-pearl px-4 py-3.5 sm:rounded-[1.25rem] sm:py-4"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/38 sm:text-xs">
                {item.label}
              </p>
              <p className="mt-1.5 text-sm font-medium text-dusk/72 sm:mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      {hasVariants ? (
        <div
          className="rounded-[1.6rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
          style={{ animation: 'fadeUp 0.6s ease 80ms both' }}
        >
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/38 sm:text-xs">
              Variant selection
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] leading-tight text-dusk sm:text-3xl">
              Choose your variant
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {variants.map((variant) => {
              const active = selectedVariantId === variant.id;
              const disabled = variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleVariantSelect(variant.id, variant.stock ?? 0)}
                  className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.985] sm:py-3 ${
                    active
                      ? 'border-plum bg-plum text-white shadow-[0_12px_28px_rgba(91,45,142,0.2)]'
                      : 'border-dusk/10 bg-white text-dusk sm:hover:-translate-y-0.5 sm:hover:border-plum/20 sm:hover:bg-pearl'
                  } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
                >
                  {getVariantLabel(variant)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Quantity + CTAs */}
      <div
        className="rounded-[1.6rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
        style={{ animation: 'fadeUp 0.65s ease 140ms both' }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/38 sm:text-xs">
              Quantity
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center rounded-full border border-dusk/10 bg-pearl/60 p-1">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dusk/60 transition duration-300 active:scale-[0.985] hover:bg-white hover:text-dusk"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-dusk/60 transition duration-300 active:scale-[0.985] hover:bg-white hover:text-dusk disabled:cursor-not-allowed disabled:opacity-35"
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

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <button
              type="button"
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.985] sm:w-auto sm:min-w-[220px] ${
                added
                  ? 'bg-[#edf8ef] text-[#32724b] ring-4 ring-[#d6eddc]'
                  : 'bg-dusk text-white sm:hover:-translate-y-0.5 sm:hover:bg-plum sm:hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]'
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
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-dusk/10 bg-white px-6 py-3.5 text-sm font-medium text-dusk transition duration-300 active:scale-[0.985] sm:w-auto sm:min-w-[190px] sm:hover:-translate-y-0.5 sm:hover:border-plum/20 sm:hover:bg-pearl sm:hover:text-plum"
            >
              Go to checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Secure checkout',
              desc: 'Review your order and complete payment safely.',
            },
            {
              icon: Sparkles,
              title: 'Refined finish',
              desc: 'Designed to feel personal, elegant, and giftable.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-[1.1rem] border border-dusk/8 bg-pearl px-4 py-3.5 sm:rounded-[1.25rem] sm:py-4"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                <item.icon size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-dusk">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-dusk/56">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {product.description ? (
        <div
          className="rounded-[1.6rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
          style={{ animation: 'fadeUp 0.7s ease 200ms both' }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/38 sm:text-xs">
            Product details
          </p>
          <h3 className="mt-2 font-display text-[1.75rem] leading-tight text-dusk sm:text-3xl">
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