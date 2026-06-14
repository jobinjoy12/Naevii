import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { ProductCard } from '@/components/shop/product-card';
import type { Product, Collection } from '@/types';

type ShopPageProps = {
  searchParams: Promise<{
    collection?: string;
    sort?: string;
  }>;
};

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
] as const;

function buildShopHref({
  collection,
  sort,
}: {
  collection?: string;
  sort?: string;
}) {
  const params = new URLSearchParams();

  if (collection) params.set('collection', collection);
  if (sort) params.set('sort', sort);

  const query = params.toString();
  return query ? `/shop?${query}` : '/shop';
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabase();

  const collection = params.collection;
  const sort = params.sort ?? 'newest';

  const orderMap: Record<string, { column: string; ascending: boolean }> = {
    newest: { column: 'created_at', ascending: false },
    oldest: { column: 'created_at', ascending: true },
    price_asc: { column: 'price_inr', ascending: true },
    price_desc: { column: 'price_inr', ascending: false },
  };

  const { column, ascending } = orderMap[sort] ?? orderMap.newest;

  let query = supabase
  .from('products')
  .select(`
    *,
    images:product_images(*),
    variants:product_variants(*),
    collection:collections(name,slug)
  `)
  .eq('status', 'active')
  .order(column, { ascending });

  if (collection) {
    const { data: matchedCollection } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', collection)
      .single();

    if (matchedCollection?.id) {
      query = query.eq('collection_id', matchedCollection.id);
    }
  }

  const [
    { data: products },
    { data: collections },
  ] = await Promise.all([
    query,
    supabase.from('collections').select('*').order('sort_order'),
  ]);

  const productList = (products ?? []) as Product[];
  const collectionList = (collections ?? []) as Collection[];
  const activeCollection =
    collectionList.find((item) => item.slug === collection) ?? null;
  const activeSort =
    sortOptions.find((option) => option.value === sort) ?? sortOptions[0];

  const title = activeCollection ? activeCollection.name : 'Shop all';
  const subtitle = activeCollection
    ? 'A focused selection of handcrafted pieces, presented with softness, detail, and intention.'
    : 'Handmade with love — curated pieces designed to feel personal, elegant, and giftable.';

  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute left-[-10%] top-8 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-10%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-14 lg:px-8 lg:py-16">
        <section
          className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/82 p-6 shadow-lifted backdrop-blur-xl sm:p-8 lg:p-10"
          style={{ animation: 'fadeUp 0.65s ease both' }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                Curated storefront
              </span>

              <h1 className="mt-4 font-display text-5xl leading-[0.95] text-dusk sm:text-6xl">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(250,241,247,0.95),rgba(244,233,255,0.9))] px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Showing
                </p>
                <p className="mt-2 font-display text-4xl text-dusk">
                  {productList.length}
                </p>
                <p className="mt-1 text-sm text-dusk/56">
                  piece{productList.length === 1 ? '' : 's'} available
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Sorted by
                </p>
                <p className="mt-2 font-display text-3xl text-dusk">
                  {activeSort.label}
                </p>
                <p className="mt-1 text-sm text-dusk/56">
                  Refine by collection or price
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]"
          style={{ animation: 'fadeUp 0.7s ease 80ms both' }}
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-4 shadow-soft backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                  Collections
                </p>
                <p className="mt-1 text-sm text-dusk/58">
                  Browse by mood, style, or category.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={buildShopHref({ sort })}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  !collection
                    ? 'bg-dusk text-white shadow-soft'
                    : 'border border-dusk/10 bg-white text-dusk hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum'
                }`}
              >
                All
              </Link>

              {collectionList.map((item, index) => (
                <Link
                  key={item.id}
                  href={buildShopHref({ collection: item.slug, sort })}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    collection === item.slug
                      ? 'bg-plum text-white shadow-[0_12px_28px_rgba(91,45,142,0.18)]'
                      : 'border border-dusk/10 bg-white text-dusk hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum'
                  }`}
                  style={{
                    animation: `fadeUp 0.45s ease ${index * 45}ms both`,
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-4 shadow-soft backdrop-blur-xl sm:p-5 lg:min-w-[320px]">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
              Sort
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {sortOptions.map((option, index) => (
                <Link
                  key={option.value}
                  href={buildShopHref({
                    collection: collection ?? undefined,
                    sort: option.value,
                  })}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    sort === option.value
                      ? 'bg-dusk text-white shadow-soft'
                      : 'border border-dusk/10 bg-white text-dusk hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum'
                  }`}
                  style={{
                    animation: `fadeUp 0.45s ease ${index * 45}ms both`,
                  }}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mt-8"
          style={{ animation: 'fadeUp 0.75s ease 120ms both' }}
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                Catalogue
              </p>
              <h2 className="mt-2 font-display text-3xl text-dusk sm:text-4xl">
                {activeCollection ? `${activeCollection.name} pieces` : 'All available pieces'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeCollection ? (
                <Link
                  href={buildShopHref({ sort })}
                  className="inline-flex items-center rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-sm font-medium text-plum transition hover:bg-plum/10"
                >
                  Clear collection
                </Link>
              ) : null}

              <div className="inline-flex items-center rounded-full border border-dusk/10 bg-white px-4 py-2 text-sm text-dusk/58">
                {productList.length} result{productList.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {!productList.length ? (
            <div className="overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/82 px-6 py-16 text-center shadow-soft backdrop-blur-xl sm:px-10 sm:py-20">
              <div className="mx-auto max-w-xl">
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(244,220,232,0.55),rgba(255,255,255,1),rgba(234,216,251,0.5))] text-3xl shadow-soft">
                  ✦
                </div>

                <h3 className="mt-6 font-display text-4xl text-dusk">
                  No products found
                </h3>

                <p className="mt-4 text-sm leading-7 text-dusk/58 sm:text-base">
                  Try another collection or change the sort selection to explore
                  more handcrafted pieces.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:bg-plum"
                  >
                    View all products
                  </Link>

                  <Link
                    href={buildShopHref({ sort: 'newest' })}
                    className="inline-flex items-center justify-center rounded-full border border-dusk/10 bg-white px-6 py-3 text-sm font-medium text-dusk transition duration-300 hover:bg-pearl"
                  >
                    Reset filters
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 auto-rows-fr sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
              {productList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}