'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const image =
    product.images?.[0]?.image_url ??
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80';

  const firstVariant = product.variants?.[0] ?? null;
  const price = firstVariant?.price_inr ?? product.price_inr;

  const metaLabel = useMemo(() => {
    if (firstVariant) {
      return [firstVariant.color, firstVariant.size]
        .filter(Boolean)
        .join(' • ');
    }
    if (product.collection?.name) return product.collection.name;
    return 'Handcrafted piece';
  }, [
    firstVariant?.color,
    firstVariant?.size,
    product.collection?.name,
  ]);

  async function handleAddToCart() {
    addItem(product, firstVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
<article className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/82 shadow-soft backdrop-blur-xl transition duration-300 active:scale-[0.985] sm:rounded-[2rem] sm:duration-500 sm:hover:-translate-y-1.5 sm:hover:shadow-lifted"      style={{ animation: 'fadeUp 0.55s ease both' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[1.02] overflow-hidden bg-[linear-gradient(160deg,rgba(244,220,232,0.35),rgba(255,255,255,1),rgba(234,216,251,0.35))] sm:aspect-[0.96]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)] opacity-70" />

          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 sm:duration-700 sm:group-hover:scale-[1.045]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/12 to-transparent opacity-70 transition duration-500 sm:group-hover:opacity-90" />

          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-dusk shadow-soft backdrop-blur sm:px-3 sm:py-1.5 sm:text-[11px]">
              <Sparkles size={11} />
              New feel
            </span>
          </div>
        </div>
      </Link>

<div className="flex flex-1 flex-col p-4 sm:p-6">
    <div className="flex items-start justify-between gap-3 sm:gap-4">
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 sm:text-[11px]">
        {metaLabel}
      </p>

      <Link href={`/shop/${product.slug}`} className="block">
<h3 className="mt-1.5 font-display text-[1.34rem] leading-[1.12] text-dusk whitespace-normal break-words">          {product.name}
        </h3>
      </Link>
    </div>

    <div className="shrink-0 rounded-full border border-dusk/8 bg-pearl px-2 py-1 text-[9px] font-semibold text-dusk/55 sm:px-3 sm:py-1.5 sm:text-xs">
      Ready
    </div>
  </div>

  {product.short_description ? (
<p className="mt-4 hidden min-h-[56px] text-sm leading-7 text-dusk/60 sm:line-clamp-2 sm:block">      {product.short_description}
    </p>
  ) : (
    <p className="mt-4 hidden text-sm leading-7 text-dusk/48 sm:block">
      A handcrafted piece designed with softness, detail, and a refined finish.
    </p>
  )}

  <div className="mt-auto flex items-end justify-between gap-3 pt-4 sm:gap-4 sm:pt-5">
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/38 sm:text-xs">
        Price
      </p>
      <p className="mt-1 font-display text-[1.65rem] leading-none text-dusk sm:text-3xl">
        ₹{Number(price).toLocaleString('en-IN')}
      </p>
    </div>

    <button
      onClick={handleAddToCart}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 sm:min-w-[148px] sm:px-5 sm:py-3 sm:text-sm ${
        added
          ? 'bg-[#edf8ef] text-[#32724b] ring-4 ring-[#d6eddc]'
          : 'bg-dusk text-white active:scale-[0.985] sm:hover:-translate-y-0.5 sm:hover:bg-plum sm:hover:shadow-[0_14px_36px_rgba(91,45,142,0.22)]'
      }`}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? (
        <>
          <Check size={15} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={15} />
          <span className="hidden sm:inline">Add to cart</span>
          <span className="sm:hidden">Add</span>
        </>
      )}
    </button>
  </div>
</div>
    </article>
  );
}