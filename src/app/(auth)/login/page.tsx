'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) setError(error.message);
    else setSent(true);

    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="bg-mesh min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-10 shadow-lifted">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-semibold text-dusk">naevii.co</h1>
          <p className="mt-2 text-sm text-dusk/60">Sign in to your account</p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-mist px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-plum text-2xl text-white">
              ✉
            </div>
            <h2 className="font-display text-xl font-semibold text-dusk">Check your inbox</h2>
            <p className="mt-2 text-sm text-dusk/60">
              We sent a magic link to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="mt-6 text-sm text-plum underline underline-offset-4"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-dusk shadow-soft transition hover:shadow-lifted disabled:opacity-60"
            >
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <hr className="flex-1 border-black/10" />
              <span className="text-xs text-dusk/40">or</span>
              <hr className="flex-1 border-black/10" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dusk">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-dusk outline-none transition focus:border-plum focus:ring-2 focus:ring-plum/20"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-full bg-plum py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}