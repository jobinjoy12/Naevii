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
    <article
      className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 shadow-soft backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:shadow-lifted"
      style={{ animation: 'fadeUp 0.55s ease both' }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[0.96] overflow-hidden bg-[linear-gradient(160deg,rgba(244,220,232,0.35),rgba(255,255,255,1),rgba(234,216,251,0.35))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)] opacity-70" />

          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/12 to-transparent opacity-70 transition duration-500 group-hover:opacity-90" />

          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-dusk shadow-soft backdrop-blur">
              <Sparkles size={12} />
              New feel
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-dusk/40">
              {metaLabel}
            </p>

            <Link href={`/shop/${product.slug}`} className="block">
              <h3 className="mt-2 line-clamp-2 font-display text-3xl leading-[1.02] text-dusk transition duration-300 group-hover:text-plum">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="shrink-0 rounded-full border border-dusk/8 bg-pearl px-3 py-1.5 text-xs font-semibold text-dusk/60">
            Ready
          </div>
        </div>

        {product.short_description ? (
          <p className="mt-4 line-clamp-2 text-sm leading-7 text-dusk/60">
            {product.short_description}
          </p>
        ) : (
          <p className="mt-4 text-sm leading-7 text-dusk/48">
            A handcrafted piece designed with softness, detail, and a refined
            finish.
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
              Price
            </p>
            <p className="mt-1 font-display text-3xl text-dusk">
              ₹{Number(price).toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`inline-flex min-h-[46px] min-w-[148px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              added
                ? 'bg-[#edf8ef] text-[#32724b] ring-4 ring-[#d6eddc]'
                : 'bg-dusk text-white hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}