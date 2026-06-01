'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You are not signed in.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Profile updated successfully.');
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-dusk">
          Full name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-dusk outline-none focus:border-plum focus:ring-2 focus:ring-plum/20"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dusk">
          Phone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-dusk outline-none focus:border-plum focus:ring-2 focus:ring-plum/20"
          placeholder="10-digit mobile number"
        />
      </div>

      {message && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}