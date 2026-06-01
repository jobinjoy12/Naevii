import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/account/profile-form';

export default async function ProfilePage() {
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

  const phone =
    profile?.phone || user.user_metadata?.phone || 'Add your mobile number';

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
                Profile
              </h1>

              <p className="mt-4 text-base leading-8 text-dusk/66 sm:text-lg">
                Keep your account details current so checkout feels faster,
                custom orders feel more personal, and every future order stays
                seamless.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Account name
                </p>
                <p className="mt-2 font-display text-2xl text-dusk">
                  {displayName}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Contact
                </p>
                <p className="mt-2 text-sm font-medium text-dusk/70">
                  {phone}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-dusk/8 pb-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,1),rgba(126,76,177,1))] text-sm font-semibold text-white shadow-soft">
              01
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                Personal details
              </p>
              <h2 className="font-display text-3xl text-dusk">Update profile</h2>
            </div>
          </div>

          <ProfileForm profile={profile} />
        </section>
      </div>
    </main>
  );
}