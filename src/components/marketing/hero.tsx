import Link from 'next/link';
import { Reveal } from './reveal';

const highlights = [
  'Handcrafted in small batches',
  'Custom charms and personalised edits',
  'Pan-India shipping',
];

const stats = [
  { label: 'Pieces crafted by hand', value: '200+' },
  { label: 'Custom stories created', value: '50+' },
  { label: 'Curated colour pairings', value: '12' },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-6 sm:pt-10 lg:pt-8">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="absolute left-[-18%] top-10 h-56 w-56 rounded-full bg-[#ead8fb]/45 blur-3xl sm:left-[-10%] sm:top-12 sm:h-72 sm:w-72" />
      <div className="absolute right-[-16%] top-6 h-64 w-64 rounded-full bg-[#f4dce8]/60 blur-3xl sm:right-[-8%] sm:top-10 sm:h-80 sm:w-80" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-pearl sm:h-40" />

      <div className="section-shell relative pb-14 pt-6 sm:pb-18 sm:pt-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-10">
        <div className="max-w-2xl">
          <Reveal className="mb-4 sm:mb-5">
            <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-plum/10 bg-white/72 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-plum shadow-soft backdrop-blur sm:min-h-0 sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-plum" />
              The essence of pure beauty
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/38 sm:text-xs sm:tracking-[0.36em]">
                Expressed through handcrafted jewellery
              </p>

              <h1 className="wordmark-glow wordmark-sheen font-display text-[3.45rem] leading-[0.92] tracking-[-0.06em] text-dusk min-[380px]:text-[3.9rem] sm:text-[5.8rem] lg:text-[8.8rem]">
                naevii.co
              </h1>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl font-display text-[1.55rem] italic leading-[1.45] text-plum/90 sm:mt-6 sm:max-w-2xl sm:text-3xl">
              naevii is the essence of pure beauty, translated into handcrafted pieces
              that feel soft, intentional, and personal.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-dusk/72 sm:mt-5 sm:max-w-xl sm:text-lg sm:leading-8">
              Discover bracelets, charms, and custom jewellery designed with quiet
              elegance, thoughtful detail, and a finish that feels deeply refined.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/shop"
                className="group inline-flex min-h-12 w-full items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white shadow-lifted transition-[transform,box-shadow,background-color] duration-300 active:scale-[0.985] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,45,142,0.22)] sm:min-h-0 sm:w-auto sm:duration-500"
              >
                Shop the collection
                <span className="ml-2 transition duration-300 group-hover:translate-x-1 sm:duration-500">
                  →
                </span>
              </Link>

              <Link
                href="/customs"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-plum/15 bg-white/72 px-6 py-3 text-sm font-semibold text-dusk shadow-soft backdrop-blur transition-[transform,border-color,background-color] duration-300 active:scale-[0.985] hover:-translate-y-0.5 hover:border-plum/30 hover:bg-white sm:min-h-0 sm:w-auto sm:duration-500"
              >
                Create a custom piece
              </Link>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="shrink-0 snap-start rounded-full border border-dusk/8 bg-white/72 px-4 py-2 text-sm text-dusk/70 shadow-soft backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={440}>
            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-dusk/8 pt-7 sm:mt-10 sm:grid-cols-3 sm:pt-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.25rem] border border-white/45 bg-white/42 p-4 shadow-soft backdrop-blur sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0"
                >
                  <p className="font-display text-[2rem] leading-none text-dusk sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-dusk/55 sm:mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mt-12 lg:mt-0">
          <div className="relative mx-auto max-w-[540px]">
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-3xl border border-white/60 bg-white/50 shadow-soft backdrop-blur lg:block animate-fade-up-delay-1 animate-float-card-c" />
            <div className="absolute -right-10 bottom-10 hidden h-36 w-36 rounded-full border border-plum/10 bg-white/45 blur-sm lg:block animate-fade-up-delay-2 animate-breathe-soft" />

            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1.08fr_0.92fr]">
              <div className="animate-fade-up relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/74 p-4 shadow-lifted backdrop-blur sm:rounded-[2rem] sm:p-5 lg:animate-float-card-a">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_42%),linear-gradient(160deg,rgba(91,45,142,0.12),rgba(244,220,232,0.4),rgba(255,255,255,0.94))]" />
                <div className="relative flex min-h-[360px] flex-col justify-between rounded-[1.4rem] border border-white/50 p-4 sm:h-[420px] sm:rounded-[1.5rem] sm:p-5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-dusk/45 sm:text-xs">
                    <span>Signature expression</span>
                    <span>01</span>
                  </div>

                  <div className="mx-auto h-44 w-44 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.96),rgba(244,220,232,0.86),rgba(91,45,142,0.22))] shadow-[inset_0_1px_18px_rgba(255,255,255,0.75),0_25px_50px_rgba(91,45,142,0.16)] animate-breathe-soft sm:h-56 sm:w-56" />

                  <div>
                    <p className="font-display text-[2rem] leading-none text-dusk sm:text-3xl">
                      Pastel Bloom
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-dusk/65">
                      A soft composition of colour, glow, and handcrafted balance —
                      created to feel delicate yet memorable.
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-dusk/60">From ₹999</span>
                      <span className="rounded-full bg-plum/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-plum sm:text-xs">
                        Bestseller
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="animate-fade-up-delay-1 overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/78 p-4 shadow-soft backdrop-blur sm:rounded-[1.75rem] sm:p-5 lg:animate-float-card-b">
                  <div className="rounded-[1.2rem] bg-gradient-to-br from-[#fff7fb] via-[#f3e9ff] to-[#efe7ff] p-5 sm:rounded-[1.35rem]">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45 sm:text-xs">
                      Personal meaning
                    </p>
                    <p className="mt-4 font-display text-[1.7rem] leading-tight text-dusk sm:text-2xl">
                      Crafted around your story
                    </p>
                    <p className="mt-2 text-sm leading-6 text-dusk/65">
                      Personal initials, chosen tones, and keepsake details designed to feel yours.
                    </p>
                  </div>
                </div>

                <div className="animate-fade-up-delay-2 overflow-hidden rounded-[1.5rem] border border-plum/10 bg-dusk p-5 text-white shadow-lifted sm:rounded-[1.75rem] lg:animate-float-card-c">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                    Brand essence
                  </p>
                  <p className="mt-4 font-display text-[2rem] leading-tight sm:text-3xl">
                    Pure beauty,
                    <br />
                    held in form.
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                    Soft in presence, refined in finish, and expressive in every handcrafted detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}