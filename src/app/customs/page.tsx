'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customOrderSchema } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CUSTOM_CATEGORIES = [
  { label: 'Bracelet', value: 'bracelet' },
  { label: 'Necklace', value: 'necklace' },
  { label: 'Anklet', value: 'anklet' },
  { label: 'Charm piece', value: 'charm_piece' },
  { label: 'Gift set', value: 'gift_set' },
  { label: 'Something else', value: 'other' },
] as const;

type CustomOrderValues = {
  full_name: string;
  email: string;
  phone: string;
  category: string;
  notes: string;
};

export default function CustomsPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomOrderValues>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      category: '',
      notes: '',
    },
    mode: 'onTouched',
  });

  const notesValue = watch('notes');
  const noteCount = useMemo(() => (notesValue ? notesValue.length : 0), [notesValue]);

  async function onSubmit(values: CustomOrderValues) {
    console.log('custom-order-request', values);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
    reset();
  }

  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="pointer-events-none absolute left-[-12%] top-6 h-64 w-64 animate-pulse rounded-full bg-[#ead8fb]/45 blur-3xl sm:left-[-8%] sm:top-8 sm:h-80 sm:w-80 sm:bg-[#ead8fb]/50" />
      <div className="pointer-events-none absolute right-[-12%] top-14 h-80 w-80 animate-pulse rounded-full bg-[#f4dce8]/55 blur-3xl sm:right-[-8%] sm:top-20 sm:h-96 sm:w-96 sm:bg-[#f4dce8]/65" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent sm:h-56" />

      <section className="section-shell relative py-10 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[0.95fr_1.05fr] xl:items-start xl:gap-8">
          {/* Left: editorial intro */}
          <div
            className="space-y-5 sm:space-y-6"
            style={{ animation: 'fadeUp 0.7s ease both' }}
          >
            <span className="inline-flex min-h-8 items-center rounded-full border border-plum/10 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-plum shadow-soft backdrop-blur sm:px-4 sm:py-2 sm:text-[11px]">
              Custom jewellery
            </span>

            <div>
              <h1 className="font-display text-[2.6rem] leading-[0.98] text-dusk sm:text-5xl lg:text-7xl">
                Create a piece
                <br />
                that feels
                <br />
                deeply yours
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-dusk/66 sm:mt-6 sm:text-lg sm:leading-8">
                Share your idea, occasion, palette, or preferred silhouette and
                naevii will help shape it into a custom piece with softness,
                clarity, and handcrafted detail.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-[1.35rem] border border-dusk/8 bg-white/72 p-4 shadow-soft backdrop-blur sm:rounded-[1.6rem] sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/38 sm:text-xs">
                  Designed for
                </p>
                <p className="mt-2 font-display text-[1.55rem] leading-tight text-dusk sm:text-2xl">
                  Gifts, keepsakes,
                  <br />
                  personal pieces
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-dusk/8 bg-white/72 p-4 shadow-soft backdrop-blur sm:rounded-[1.6rem] sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/38 sm:text-xs">
                  Response flow
                </p>
                <p className="mt-2 text-sm leading-7 text-dusk/66">
                  Submit your idea, and we’ll review the request, align on details,
                  and guide the next step with care.
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.82),rgba(250,241,247,0.96),rgba(244,233,255,0.88))] p-5 shadow-lifted backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-plum sm:text-xs">
                What to include
              </p>

              <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
                {[
                  'The type of piece you want',
                  'Preferred colour palette or mood',
                  'Any gifting, date, or occasion context',
                  'References, inspiration, or finishing notes',
                ].map((point, index) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[1.1rem] border border-dusk/8 bg-white/75 px-4 py-3 sm:rounded-[1.2rem]"
                  >
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum text-xs font-semibold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-dusk/66">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div
            className="relative"
            style={{ animation: 'fadeUp 0.8s ease 120ms both' }}
          >
            <div className="overflow-hidden rounded-[1.8rem] border border-white/65 bg-white/82 shadow-lifted backdrop-blur-xl sm:rounded-[2.2rem]">
              <div className="border-b border-dusk/8 px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(91,45,142,1),rgba(126,76,177,1))] text-sm font-semibold text-white shadow-soft sm:h-11 sm:w-11">
                    01
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/38 sm:text-xs">
                      Request form
                    </p>
                    <h2 className="font-display text-[1.75rem] leading-tight text-dusk sm:text-3xl">
                      Tell us your idea
                    </h2>
                  </div>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-dusk/60 sm:mt-4">
                  Keep it simple but specific. The clearer your request, the easier
                  it is to shape a beautiful first response.
                </p>
              </div>

              {submitted ? (
                <div className="px-5 py-8 sm:px-8 sm:py-12">
                  <div className="rounded-[1.5rem] border border-[#e8d9f7] bg-[linear-gradient(160deg,rgba(244,233,255,0.85),rgba(255,255,255,1),rgba(250,241,247,0.92))] p-5 shadow-soft sm:rounded-[1.8rem] sm:p-6">
                    <span className="inline-flex min-h-8 items-center rounded-full border border-plum/10 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-plum sm:px-4 sm:py-2 sm:text-[11px]">
                      Request received
                    </span>

                    <h3 className="mt-4 font-display text-[2.4rem] leading-tight text-dusk sm:mt-5 sm:text-4xl">
                      Thank you
                    </h3>

                    <p className="mt-3 max-w-xl text-[15px] leading-7 text-dusk/66 sm:text-base sm:leading-8">
                      Your custom order request has been noted. We’ll review the
                      details and reach out with the next step.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-dusk/10 px-5 py-3 text-sm font-semibold text-dusk transition duration-300 active:scale-[0.985] hover:border-plum/30 hover:text-plum sm:mt-7"
                    >
                      Submit another request
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-8 sm:py-8"
                >
                  <div className="space-y-5">
                    <div>
                      <Input
                        label="Full name"
                        placeholder="Your full name"
                        {...register('full_name')}
                      />
                      {errors.full_name ? (
                        <p className="mt-2 text-sm text-[#9b4667]">
                          {errors.full_name.message as string}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                      />
                      {errors.email ? (
                        <p className="mt-2 text-sm text-[#9b4667]">
                          {errors.email.message as string}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        {...register('phone')}
                      />
                      {errors.phone ? (
                        <p className="mt-2 text-sm text-[#9b4667]">
                          {errors.phone.message as string}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-base font-medium text-dusk/74 sm:text-sm">
                        Category
                      </label>
                      <select
  {...register('category')}
  aria-invalid={!!errors.category}
  className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition duration-300 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10 aria-[invalid=true]:border-[#c97a98] aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-[#f3d7e2]"
>
  <option value="">Select a category</option>
  {CUSTOM_CATEGORIES.map((category) => (
    <option key={category.value} value={category.value}>
      {category.label}
    </option>
  ))}
</select>
                      {errors.category ? (
                        <p className="mt-2 text-sm text-[#9b4667]">
                          {errors.category.message as string}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <label className="block text-base font-medium text-dusk/74 sm:text-sm">
                          Describe your idea
                        </label>
                        <span className="text-xs uppercase tracking-[0.14em] text-dusk/35">
                          {noteCount}/500
                        </span>
                      </div>

                      <textarea
                        className="min-h-[140px] w-full rounded-[1.2rem] border border-dusk/10 bg-white px-4 py-3.5 text-base leading-7 text-dusk outline-none transition duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10 sm:min-h-[170px] sm:rounded-[1.4rem] sm:text-sm"
                        placeholder="Describe the piece, your preferred colours, style references, gifting occasion, or any details that would help us understand your vision."
                        maxLength={500}
                        {...register('notes')}
                      />

                      {errors.notes ? (
                        <p className="mt-2 text-sm text-[#9b4667]">
                          {errors.notes.message as string}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-dusk/46">
                          A few thoughtful details help us respond more accurately.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-3.5 sm:rounded-[1.5rem] sm:px-5 sm:py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-plum sm:text-xs">
                      Before you submit
                    </p>
                    <p className="mt-2 text-sm leading-7 text-dusk/62">
                      Share only the details needed for this request. Once reviewed,
                      we can refine materials, timing, and design direction together.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-dusk/8 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                    <p className="max-w-md text-[13px] leading-7 text-dusk/56 sm:text-sm">
                      By submitting this form, you agree to be contacted regarding
                      your custom order request.
                    </p>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="min-h-[52px] w-full rounded-full bg-dusk px-6 text-base text-white transition duration-300 active:scale-[0.985] sm:w-auto sm:min-w-[220px] sm:text-sm sm:duration-500 sm:hover:-translate-y-0.5 sm:hover:bg-plum disabled:opacity-70"
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit request'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}