import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const displayName =
    profile?.full_name?.trim() ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Naevii customer';

  const email = user.email ?? 'Signed in';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('');

  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-10%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />

      <div className="section-shell relative py-10 sm:py-14 lg:py-16">
        <section className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/80 p-6 shadow-lifted backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                My account
              </span>

              <h1 className="mt-4 font-display text-4xl text-dusk sm:text-5xl lg:text-6xl">
                Welcome back
              </h1>

              <p className="mt-4 text-base leading-8 text-dusk/66 sm:text-lg">
                Review your orders, update your details, and manage your saved
                information in one calm, beautifully organised space.
              </p>
            </div>

            <div className="rounded-[2rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(250,241,247,0.95),rgba(244,233,255,0.86))] p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,1),rgba(126,76,177,1))] text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-soft">
                  {initials || 'N'}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-2xl text-dusk">
                    {displayName}
                  </p>
                  <p className="truncate text-sm text-dusk/58">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-4 shadow-soft backdrop-blur-xl">
            <div className="mb-4 rounded-[1.6rem] border border-dusk/8 bg-pearl px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                Navigation
              </p>
              <p className="mt-2 text-sm leading-7 text-dusk/60">
                Move through your account with clear, focused sections.
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-[1.2rem] border border-transparent px-4 py-3 text-sm font-medium text-dusk/72 transition-all duration-300 hover:-translate-y-0.5 hover:border-plum/12 hover:bg-pearl hover:text-plum"
                  style={{
                    animation: `fadeUp 0.5s ease ${index * 70}ms both`,
                  }}
                >
                  <span>{link.label}</span>
                  <span className="text-dusk/28 transition group-hover:text-plum">
                    →
                  </span>
                </Link>
              ))}

              <form action="/api/auth/signout" method="POST" className="pt-2">
                <button className="w-full rounded-[1.2rem] px-4 py-3 text-left text-sm font-medium text-dusk/42 transition-all duration-300 hover:bg-red-50 hover:text-red-500">
                  Sign out
                </button>
              </form>
            </nav>
          </aside>

          <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-6 lg:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}