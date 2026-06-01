'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const supabase = createClient();

  const [name, setName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError('You need to be signed in to update your profile.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
        phone,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <div className="grid gap-5">
        <div className="rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
            Profile details
          </p>
          <p className="mt-2 text-sm leading-7 text-dusk/60">
            Keep your name and phone updated for smoother checkout and clearer
            order communication.
          </p>
        </div>

        <div>
          <label
            htmlFor="full_name"
            className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
          >
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
          >
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
          />
          <p className="mt-2 text-sm text-dusk/46">
            Used for order updates and delivery communication.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.3rem] border border-[#f2d4d4] bg-[#fff1f1] px-4 py-3 text-sm leading-6 text-[#b14a4a]">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-[1.3rem] border border-[#d6eddc] bg-[#edf8ef] px-4 py-3 text-sm leading-6 text-[#32724b]">
          Profile updated successfully.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-dusk/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-7 text-dusk/56">
          Your details stay tied to your account and help future purchases feel
          more effortless.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-[50px] min-w-[190px] items-center justify-center rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <span className="inline-flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving…
            </span>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </form>
  );
}