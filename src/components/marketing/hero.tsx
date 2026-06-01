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
    <section className="relative isolate overflow-hidden pt-8 sm:pt-12">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-8%] top-10 h-80 w-80 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-pearl" />

      <div className="section-shell relative grid items-center gap-14 pb-18 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        <div className="max-w-2xl">
          <Reveal className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-plum/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-plum shadow-soft backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-plum" />
              The essence of pure beauty
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.36em] text-dusk/38">
                Expressed through handcrafted jewellery
              </p>

              <h1 className="wordmark-glow wordmark-sheen font-display text-[4.6rem] leading-[0.9] tracking-[-0.05em] text-dusk sm:text-[6.7rem] lg:text-[8.8rem]">
                naevii.co
              </h1>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl font-display text-2xl italic leading-relaxed text-plum/90 sm:text-3xl">
              naevii is the essence of pure beauty, translated into handcrafted pieces
              that feel soft, intentional, and personal.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-5 max-w-xl text-base leading-8 text-dusk/72 sm:text-lg">
              Discover bracelets, charms, and custom jewellery designed with quiet
              elegance, thoughtful detail, and a finish that feels deeply refined.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white shadow-lifted transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(91,45,142,0.22)]"
              >
                Shop the collection
                <span className="ml-2 transition duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/custom"
                className="inline-flex items-center justify-center rounded-full border border-plum/15 bg-white/70 px-6 py-3 text-sm font-semibold text-dusk shadow-soft backdrop-blur transition duration-500 hover:-translate-y-0.5 hover:border-plum/30 hover:bg-white"
              >
                Create a custom piece
              </Link>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-dusk/8 bg-white/70 px-4 py-2 text-sm text-dusk/70 shadow-soft backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={440}>
            <div className="mt-10 grid gap-4 border-t border-dusk/8 pt-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-dusk">{stat.value}</p>
                  <p className="mt-1 text-sm text-dusk/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative">
  <div className="relative mx-auto max-w-[540px]">
    <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-3xl border border-white/60 bg-white/50 shadow-soft backdrop-blur lg:block animate-fade-up-delay-1 animate-float-card-c" />
    <div className="absolute -right-10 bottom-10 hidden h-36 w-36 rounded-full border border-plum/10 bg-white/45 blur-sm lg:block animate-fade-up-delay-2 animate-breathe-soft" />

    <div className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr]">
      <div className="animate-fade-up animate-float-card-a relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-lifted backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_42%),linear-gradient(160deg,rgba(91,45,142,0.12),rgba(244,220,232,0.4),rgba(255,255,255,0.94))]" />
        <div className="relative flex h-[420px] flex-col justify-between rounded-[1.5rem] border border-white/50 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-dusk/45">
            <span>Signature expression</span>
            <span>01</span>
          </div>

          <div className="mx-auto h-56 w-56 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.96),rgba(244,220,232,0.86),rgba(91,45,142,0.22))] shadow-[inset_0_1px_18px_rgba(255,255,255,0.75),0_25px_50px_rgba(91,45,142,0.16)] animate-breathe-soft" />

          <div>
            <p className="font-display text-3xl text-dusk">Pastel Bloom</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-dusk/65">
              A soft composition of colour, glow, and handcrafted balance —
              created to feel delicate yet memorable.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-medium text-dusk/60">From ₹999</span>
              <span className="rounded-full bg-plum/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum">
                Bestseller
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="animate-fade-up-delay-1 animate-float-card-b overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur">
          <div className="rounded-[1.35rem] bg-gradient-to-br from-[#fff7fb] via-[#f3e9ff] to-[#efe7ff] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-dusk/45">
              Personal meaning
            </p>
            <p className="mt-4 font-display text-2xl text-dusk">
              Crafted around your story
            </p>
            <p className="mt-2 text-sm leading-6 text-dusk/65">
              Personal initials, chosen tones, and keepsake details designed to feel yours.
            </p>
          </div>
        </div>

        <div className="animate-fade-up-delay-2 animate-float-card-c overflow-hidden rounded-[1.75rem] border border-plum/10 bg-dusk p-5 text-white shadow-lifted">
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">
            Brand essence
          </p>
          <p className="mt-4 font-display text-3xl">
            Pure beauty,
            <br />
            held in form.
          </p>
          <p className="mt-3 text-sm leading-6 text-white/70">
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