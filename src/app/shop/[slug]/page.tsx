import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import { ProductClient } from '@/components/shop/product-client';
import { ProductCard } from '@/components/shop/product-card';
import type { Product, Review } from '@/types';
import { ProductDetailView } from '@/components/shop/product-detail-view';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: product } = await supabase
    .from('products')
    .select(
  `
  *,
  images:product_images(*),
  variants:product_variants(
    *,
    images:product_variant_images(*)
  ),
  collection:collections(name,slug)
  `
)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!product) notFound();

  const relatedPromise = product.collection_id
    ? supabase
        .from('products')
        .select('*, images:product_images(*), variants:product_variants(*)')
        .eq('status', 'active')
        .eq('collection_id', product.collection_id)
        .neq('id', product.id)
        .limit(4)
    : Promise.resolve({ data: [] });

  const [{ data: reviewsData }, { data: relatedData }] = await Promise.all([
    supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', product.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
    relatedPromise,
  ]);

  const reviews = (reviewsData ?? []) as Review[];
  const related = (relatedData ?? []) as Product[];

  const images = product.images?.length
    ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)
    : [
        {
          id: 'fallback',
          product_id: product.id,
          image_url:
            'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80',
          alt_text: product.name,
          sort_order: 0,
        },
      ];

  const primaryImage = images[0];
  const galleryImages = images.slice(1, 5);
  const startingPrice = getStartingPrice(product as Product);
  const highestPrice = getHighestPrice(product as Product);
  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const priceLabel =
    startingPrice !== highestPrice
      ? `₹${startingPrice.toLocaleString('en-IN')} - ₹${highestPrice.toLocaleString('en-IN')}`
      : `₹${startingPrice.toLocaleString('en-IN')}`;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(233,212,241,0.35),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,226,213,0.28),transparent_22%),linear-gradient(180deg,#fcfafb_0%,#f8f4f7_48%,#fbf9fb_100%)]" />
      <div className="absolute left-[-120px] top-20 -z-10 h-72 w-72 rounded-full bg-plum/10 blur-3xl animate-pulse" />
      <div className="absolute right-[-80px] top-40 -z-10 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl animate-pulse" />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-dusk/40">
          <Link href="/" className="transition hover:text-plum">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="transition hover:text-plum">
            Shop
          </Link>
          {product.collection?.name ? (
            <>
              <span>/</span>
              <span>{product.collection.name}</span>
            </>
          ) : null}
        </nav>

        <ProductDetailView
        product={product as Product}
        reviews={reviews}
        />

        <section
          className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          style={{ animation: 'fadeUp 0.9s ease both' }}
        >
          <div className="rounded-[2rem] border border-white/65 bg-white/78 p-6 shadow-[0_22px_60px_rgba(56,38,68,0.08)] backdrop-blur-xl sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-dusk/38">
              Product story
            </p>
            <h2 className="mt-3 font-display text-3xl text-dusk sm:text-4xl">
              Crafted with softness and detail
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-dusk/68 sm:text-[15px]">
              <p className="whitespace-pre-line">
                {product.description ||
                  'This piece is designed to feel graceful, polished, and easy to wear. Its visual softness is balanced with a carefully finished structure so it stands out without feeling loud.'}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/65 bg-white/78 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Clock3 size={18} className="text-plum" />
                <h3 className="text-lg font-semibold text-dusk">Made with care</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-dusk/62">
                Estimated making time: {formatLeadTime(product as Product)}. Each
                order is handled with attention to finish and presentation.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/65 bg-white/78 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-plum" />
                <h3 className="text-lg font-semibold text-dusk">Why it feels premium</h3>
              </div>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-dusk/62">
                <li>Refined silhouette with a soft luxury feel.</li>
                <li>Thoughtful finishing and styling flexibility.</li>
                <li>Suitable for gifting, dressing up, or elevated everyday wear.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mt-16 rounded-[2.25rem] border border-white/65 bg-white/78 p-6 shadow-[0_24px_80px_rgba(56,38,68,0.08)] backdrop-blur-xl sm:p-8"
          style={{ animation: 'fadeUp 1s ease both' }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-dusk/38">
                Social proof
              </p>
              <h2 className="mt-3 font-display text-3xl text-dusk sm:text-4xl">
                Reviews
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-2 shadow-soft">
              <span className="font-display text-2xl text-dusk">
                {reviews.length ? avgRating.toFixed(1) : '—'}
              </span>
              <div>
                <p className="text-sm font-semibold text-dusk">
                  {reviews.length ? `${reviews.length} review${reviews.length > 1 ? 's' : ''}` : 'No reviews yet'}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Verified customer feedback
                </p>
              </div>
            </div>
          </div>

          {!reviews.length ? (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-dusk/10 bg-white/70 px-6 py-10 text-center">
              <p className="font-medium text-dusk">No reviews yet</p>
              <p className="mt-2 text-sm text-dusk/52">
                This product is newly featured. Your first customer review will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <article
                  key={review.id}
                  className="group rounded-[1.8rem] border border-black/5 bg-white/88 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(56,38,68,0.10)]"
                  style={{ animation: `fadeUp 0.7s ease both`, animationDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dusk">
                        {review.profiles?.full_name ?? 'Customer'}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-dusk/38">
                        Verified purchase
                      </p>
                    </div>

                    <div className="rounded-full bg-[#fbf4ff] px-3 py-1.5 text-sm font-semibold text-plum">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>

                  {review.title ? (
                    <h3 className="mt-4 text-base font-semibold text-dusk">
                      {review.title}
                    </h3>
                  ) : null}

                  <p className="mt-3 text-sm leading-7 text-dusk/68">{review.body}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {related.length ? (
          <section className="mt-16" style={{ animation: 'fadeUp 1.05s ease both' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-dusk/38">
                  More to discover
                </p>
                <h2 className="mt-3 font-display text-3xl text-dusk sm:text-4xl">
                  You may also like
                </h2>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-plum transition hover:gap-3"
              >
                Explore the shop
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}