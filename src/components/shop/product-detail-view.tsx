'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { ProductClient } from '@/components/shop/product-client';
import type { Product, Review } from '@/types';

function formatLeadTime(product: Product) {
  if (product.handmade_days_min && product.handmade_days_max) {
    return `${product.handmade_days_min}-${product.handmade_days_max} days`;
  }
  if (product.handmade_days_min) return `${product.handmade_days_min}+ days`;
  return 'Made to order';
}

function getStartingPrice(product: Product) {
  if (!product.variants?.length) return product.price_inr;
  return Math.min(...product.variants.map((variant) => variant.price_inr));
}

function getHighestPrice(product: Product) {
  if (!product.variants?.length) return product.price_inr;
  return Math.max(...product.variants.map((variant) => variant.price_inr));
}

export function ProductDetailView({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const variants = product.variants ?? [];

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId]
  );

  const fallbackImages = product.images?.length
    ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const selectedVariantImages = selectedVariant?.images?.length
    ? [...selectedVariant.images].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const activeImages = selectedVariantImages.length
    ? selectedVariantImages
    : fallbackImages;

  const selectedImage =
    activeImages[selectedImageIndex]?.image_url ||
    activeImages[0]?.image_url ||
    '';

  const startingPrice = getStartingPrice(product);
  const highestPrice = getHighestPrice(product);
  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const priceLabel =
    startingPrice !== highestPrice
      ? `₹${startingPrice.toLocaleString('en-IN')} - ₹${highestPrice.toLocaleString('en-IN')}`
      : `₹${startingPrice.toLocaleString('en-IN')}`;

  function handleVariantChange(variantId: string) {
    setSelectedVariantId(variantId);
    setSelectedImageIndex(0);
  }

  function handleThumbClick(variantId: string, imageIndex: number) {
    setSelectedVariantId(variantId);
    setSelectedImageIndex(imageIndex);
  }

  return (
    <section className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-14">
      <div className="space-y-4">
        <div
          className="group relative overflow-hidden rounded-[2.5rem] border border-white/65 bg-white/75 p-3 shadow-[0_24px_80px_rgba(56,38,68,0.10)] backdrop-blur-xl"
          style={{ animation: 'fadeUp 0.65s ease both' }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]" />

          <div className="relative aspect-[0.96] overflow-hidden rounded-[2rem] bg-[linear-gradient(140deg,rgba(246,227,236,0.55),rgba(255,255,255,1),rgba(235,225,250,0.55))]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_52%)] opacity-80" />

            <Image
  src={selectedImage}
  alt={selectedVariant?.color ? `${product.name} - ${selectedVariant.color}` : product.name}
  fill
  priority
  className="object-cover transition duration-700 group-hover:scale-[1.04]"
  sizes="(max-width: 1024px) 100vw, 54vw"
/>

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/12 via-black/5 to-transparent opacity-80" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-dusk shadow-soft backdrop-blur">
                <Sparkles size={12} />
                Handcrafted
              </span>

              {product.featured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8fb] bg-[#faf5ff] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-plum shadow-soft">
                  Featured
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {activeImages.length ? (
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animation: 'fadeUp 0.8s ease both' }}
          >
            {activeImages.slice(0, 4).map((img, index) => {
              const active = selectedImageIndex === index;

              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`group relative overflow-hidden rounded-[1.5rem] border bg-white/80 p-2 text-left shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(56,38,68,0.12)] ${
                    active
                      ? 'border-plum ring-2 ring-plum/30'
                      : 'border-white/65'
                  }`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-pearl">
                    <Image
                      src={img.image_url}
                      alt={img.alt_text ?? product.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        className="self-start lg:sticky lg:top-24"
        style={{ animation: 'fadeUp 0.75s ease both' }}
      >
        <div className="rounded-[2.25rem] border border-white/65 bg-white/78 p-6 shadow-[0_24px_80px_rgba(56,38,68,0.10)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            {product.collection?.name ? (
              <span className="inline-flex items-center rounded-full border border-dusk/10 bg-pearl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-dusk/55">
                {product.collection.name}
              </span>
            ) : null}

            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Ready to order
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl leading-[0.98] text-dusk sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-dusk/66 sm:text-[15px]">
            {product.short_description ||
              'A refined handcrafted piece designed with softness, balance, and a quietly luxurious finish.'}
          </p>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-5 rounded-[1.75rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,245,250,0.92))] p-5 shadow-soft">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-dusk/38">
                Price
              </p>
              <p className="mt-1 font-display text-4xl leading-none text-dusk">
                {priceLabel}
              </p>

              {product.compare_at_price_inr ? (
                <p className="mt-2 text-sm text-dusk/42 line-through">
                  ₹{Number(product.compare_at_price_inr).toLocaleString('en-IN')}
                </p>
              ) : null}
            </div>

            <div className="grid min-w-[210px] grid-cols-3 gap-2">
              <div className="rounded-2xl border border-black/5 bg-white/80 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-dusk/35">
                  Rating
                </p>
                <p className="mt-1 text-sm font-semibold text-dusk">
                  {reviews.length ? avgRating.toFixed(1) : 'New'}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white/80 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-dusk/35">
                  Options
                </p>
                <p className="mt-1 text-sm font-semibold text-dusk">
                  {product.variants?.length || 1}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white/80 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-dusk/35">
                  Lead time
                </p>
                <p className="mt-1 text-sm font-semibold text-dusk">
                  {formatLeadTime(product)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-black/5 bg-white/78 p-4 shadow-soft">
              <div className="flex items-center gap-2 text-dusk">
                <Sparkles size={16} className="text-plum" />
                <p className="text-sm font-semibold">Artisan finish</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-dusk/58">
                Carefully detailed and polished for a premium look.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-black/5 bg-white/78 p-4 shadow-soft">
              <div className="flex items-center gap-2 text-dusk">
                <Truck size={16} className="text-plum" />
                <p className="text-sm font-semibold">Secure delivery</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-dusk/58">
                Packed thoughtfully to keep the piece safe in transit.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-black/5 bg-white/78 p-4 shadow-soft">
              <div className="flex items-center gap-2 text-dusk">
                <ShieldCheck size={16} className="text-plum" />
                <p className="text-sm font-semibold">Quality checked</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-dusk/58">
                Every order is reviewed before dispatch for consistency.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-[1.8rem] bg-[linear-gradient(135deg,rgba(91,45,142,0.08),rgba(244,220,232,0.32),rgba(255,255,255,0.94))] p-[1px] shadow-soft">
            <div className="rounded-[1.75rem] bg-white/88 p-4 sm:p-5">
              <ProductClient
  product={product}
  selectedVariantId={selectedVariantId}
  onVariantChange={handleVariantChange}
/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}