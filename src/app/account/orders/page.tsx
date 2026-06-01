import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Order } from '@/types';
import OrdersListClient from './orders-list-client';

export default async function OrdersPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const safeOrders = (orders as Order[]) ?? [];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-8%] top-14 h-80 w-80 rounded-full bg-[#f4dce8]/60 blur-3xl" />

      <div className="relative space-y-8">
        <section className="overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/78 p-6 shadow-lifted backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                My account
              </span>

              <h1 className="mt-4 font-display text-4xl text-dusk sm:text-5xl">
                Your orders
              </h1>

              <p className="mt-4 text-base leading-8 text-dusk/66 sm:text-lg">
                A complete view of your handcrafted pieces, payment status, and
                order activity — designed to feel clear, calm, and easy to revisit.
              </p>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-[1.4rem] border border-dusk/8 bg-pearl px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Orders
                </p>
                <p className="mt-2 font-display text-3xl text-dusk">
                  {safeOrders.length}
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-dusk/8 bg-pearl px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Latest activity
                </p>
                <p className="mt-2 text-sm font-medium text-dusk/70">
                  {safeOrders.length ? 'Recently updated' : 'No orders yet'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <OrdersListClient orders={safeOrders} />
      </div>
    </main>
  );
}