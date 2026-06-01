import Link from 'next/link';
import {
  ArrowRight,
  Droplets,
  Gift,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from 'lucide-react';

const careTips = [
  {
    icon: Droplets,
    title: 'Keep away from water',
    description:
      'Avoid contact with water, perfume, lotion, sweat, and other liquids to help preserve the finish and detailing of your piece.',
  },
  {
    icon: SunMedium,
    title: 'Store away from direct sunlight',
    description:
      'Keep your piece in a cool, dry place and avoid prolonged exposure to sunlight or heat.',
  },
  {
    icon: MoonStar,
    title: 'Handle gently',
    description:
      'Our pieces are made with care and should be handled delicately. Avoid pulling, bending, or rough use.',
  },
  {
    icon: Gift,
    title: 'Store separately',
    description:
      'When not in use, place your piece in a soft pouch or box to help prevent scratches and tangling.',
  },
];

const supportNotes = [
  'Remove before showering, swimming, exercising, or sleeping.',
  'Avoid contact with sharp surfaces and excessive friction.',
  'Wipe gently with a soft dry cloth after use if needed.',
  'Keep away from chemicals, sprays, and cleaning products.',
];

export default function CarePage() {
  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-10%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />

      <section className="section-shell relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div
            className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/84 p-8 shadow-lifted backdrop-blur-xl sm:p-10 lg:p-12"
            style={{ animation: 'fadeUp 0.7s ease both' }}
          >
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
                  Product care
                </span>

                <h1 className="mt-5 font-display text-5xl leading-[0.95] text-dusk sm:text-6xl">
                  Care for your piece
                  <br />
                  with softness.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
                  Every piece deserves thoughtful care. These simple steps help
                  maintain its beauty, finish, and feel for longer.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(250,241,247,0.95),rgba(244,233,255,0.9))] px-5 py-5 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                    Care focus
                  </p>
                  <p className="mt-2 font-display text-3xl text-dusk">
                    Gentle handling
                  </p>
                  <p className="mt-2 text-sm leading-7 text-dusk/56">
                    Soft use and careful storage help preserve the piece over
                    time.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                    Support
                  </p>
                  <p className="mt-2 font-display text-3xl text-dusk">
                    Need help?
                  </p>
                  <p className="mt-2 text-sm leading-7 text-dusk/56">
                    Reach out if you are unsure how to care for a specific piece.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            style={{ animation: 'fadeUp 0.78s ease 90ms both' }}
          >
            {careTips.map((tip, index) => {
              const Icon = tip.icon;

              return (
                <article
                  key={tip.title}
                  className="group rounded-[1.8rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lifted"
                  style={{
                    animation: `fadeUp 0.6s ease ${index * 70}ms both`,
                  }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(244,220,232,0.5),rgba(255,255,255,1),rgba(234,216,251,0.42))] text-plum shadow-soft">
                    <Icon size={18} />
                  </div>

                  <h2 className="mt-5 font-display text-3xl leading-[1] text-dusk transition duration-300 group-hover:text-plum">
                    {tip.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-dusk/60">
                    {tip.description}
                  </p>
                </article>
              );
            })}
          </section>

          <section
            className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"
            style={{ animation: 'fadeUp 0.84s ease 140ms both' }}
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-soft backdrop-blur-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                    Everyday care
                  </p>
                  <h3 className="mt-2 font-display text-4xl text-dusk">
                    Keep it beautiful
                  </h3>
                </div>

                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                  <Sparkles size={16} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {supportNotes.map((note, index) => (
                  <div
                    key={note}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-dusk/8 bg-pearl px-4 py-4"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-plum text-[11px] font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-dusk/62">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-6 shadow-soft backdrop-blur-xl sm:p-8">
              <div className="rounded-[1.8rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(250,241,247,0.96),rgba(244,233,255,0.88))] p-6 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-dusk">
                      A thoughtful note
                    </p>
                    <p className="mt-2 text-sm leading-7 text-dusk/58">
                      Care guidance should stay clear, accurate, and easy to
                      scan, especially when it supports product understanding and
                      post-purchase confidence. [web:910][web:912]
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                  Need more guidance?
                </p>
                <h3 className="mt-2 font-display text-4xl text-dusk">
                  We’re here to help
                </h3>
                <p className="mt-4 text-sm leading-7 text-dusk/60">
                  If your item needs special handling or you have a question
                  about materials, contact us and include the product name or
                  order number so we can guide you more clearly. [web:912][web:914]
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]"
                >
                  Contact us
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-dusk/10 bg-white px-6 py-3.5 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
                >
                  Back to shop
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}