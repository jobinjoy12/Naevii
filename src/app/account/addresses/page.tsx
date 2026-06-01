import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function formatDate(date?: string | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AddressesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const safeAddresses = addresses ?? [];
  const latestAddress = safeAddresses[0];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-8%] top-14 h-80 w-80 rounded-full bg-[#f4dce8]/60 blur-3xl" />

      <div className="relative space-y-8">
        <section className="overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/78 p-6 shadow-lifted backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                My account
              </span>

              <h1 className="mt-4 font-display text-4xl text-dusk sm:text-5xl">
                Addresses
              </h1>

              <p className="mt-4 text-base leading-8 text-dusk/66 sm:text-lg">
                A calm, clear place to revisit your saved delivery details for
                faster future orders.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Saved addresses
                </p>
                <p className="mt-2 font-display text-3xl text-dusk">
                  {safeAddresses.length}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Latest update
                </p>
                <p className="mt-2 text-sm font-medium text-dusk/70">
                  {latestAddress?.created_at
                    ? formatDate(latestAddress.created_at)
                    : 'No address yet'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!safeAddresses.length ? (
          <section className="rounded-[2rem] border border-white/60 bg-white/82 p-10 text-center shadow-lifted backdrop-blur-xl sm:p-14">
            <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
              Empty address book
            </span>

            <h2 className="mt-6 font-display text-4xl text-dusk">
              No saved addresses yet
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-dusk/60">
              Addresses are saved automatically when you place an order, so your
              next checkout can feel faster and more effortless.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,45,142,0.22)]"
              >
                Browse the shop
              </Link>
            </div>
          </section>
        ) : (
          <section className="space-y-5">
            {safeAddresses.map((addr, index) => (
              <article
                key={addr.id}
                className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-lifted sm:p-6"
                style={{
                  animation: `fadeUp 0.6s ease ${index * 80}ms both`,
                }}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,1),rgba(126,76,177,1))] text-sm font-semibold text-white shadow-soft">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-3xl text-dusk">
                          {addr.full_name}
                        </h2>

                        {index === 0 ? (
                          <span className="inline-flex rounded-full border border-plum/12 bg-plum/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-plum">
                            Latest
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-7 text-dusk/66">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                      </p>
                      <p className="text-sm leading-7 text-dusk/66">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-sm leading-7 text-dusk/66">{addr.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="rounded-[1.2rem] border border-dusk/8 bg-pearl px-4 py-3 text-sm text-dusk/62">
                      Delivery ready
                    </div>

                    {addr.created_at ? (
                      <p className="text-xs uppercase tracking-[0.16em] text-dusk/38">
                        Saved on {formatDate(addr.created_at)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}