import Link from 'next/link';
import { Reveal } from './reveal';

const collections = [
  {
    title: 'Pure beauty, made tangible',
    copy:
      'Collections shaped by softness, delicate colour, and a handcrafted finish that feels elevated from the first glance.',
    accent: 'from-[#f8ebf3] via-[#f5efff] to-white',
    tag: 'Signature collection',
    href: '/shop?collection=signature',
  },
  {
    title: 'Crafted to feel personal',
    copy:
      'Custom charms and meaningful details designed to hold memory, gifting, and individuality with quiet elegance.',
    accent: 'from-[#f6efe6] via-[#fff9f2] to-white',
    tag: 'Custom pieces',
    href: '/custom',
  },
  {
    title: 'Softness in every detail',
    copy:
      'Every bracelet and charm is balanced to feel feminine, refined, and easy to wear across everyday moments.',
    accent: 'from-[#f2ecff] via-[#fbf8ff] to-white',
    tag: 'Everyday luxury',
    href: '/shop',
  },
];

const craftPoints = [
  'A refined design language built around softness, balance, and detail',
  'Small-batch craftsmanship for more intentional quality and finish',
  'Personalised options that make every piece feel more intimate and meaningful',
];

const testimonials = [
  {
    quote:
      'It feels soft, elegant, and premium in the most understated way.',
    name: 'Aparna',
    meta: 'Repeat customer',
  },
  {
    quote:
      'The piece felt personal from the moment I opened it. Beautifully made.',
    name: 'Megha',
    meta: 'Gift order',
  },
  {
    quote:
      'The customisation made it feel truly mine without losing that polished boutique finish.',
    name: 'Nimisha',
    meta: 'Custom charm order',
  },
];

export function HomeSections() {
  return (
    <>
      <section className="section-shell py-20 sm:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
            The meaning of naevii
          </p>
          <h2 className="mt-4 font-display text-4xl text-dusk sm:text-5xl">
            Pure beauty,
            <br className="hidden sm:block" /> made tangible through craft.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-dusk/68">
            naevii is more than a name — it is the essence of pure beauty,
translated into jewellery that feels soft, intentional, and quietly refined.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {collections.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
  <Link href={item.href} className="block h-full">
    <article className="group relative h-full overflow-hidden rounded-[2rem] border border-dusk/8 bg-white p-5 shadow-soft transition duration-700 hover:-translate-y-1 hover:shadow-lifted">
      <div className={`rounded-[1.6rem] bg-gradient-to-br ${item.accent} p-6`}>
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-dusk/8 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-dusk/55">
            {item.tag}
          </span>
          <span className="text-sm text-dusk/35">0{index + 1}</span>
        </div>

        <div className="my-8 h-56 rounded-[1.4rem] border border-white/60 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.96),rgba(255,255,255,0.72),rgba(91,45,142,0.14))] shadow-[inset_0_1px_12px_rgba(255,255,255,0.8),0_18px_34px_rgba(44,26,58,0.08)] transition duration-700 group-hover:scale-[1.02]" />

        <h3 className="font-display text-3xl text-dusk">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-dusk/65">{item.copy}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium text-dusk/55">Discover more</span>
          <span className="text-plum transition duration-500 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </article>
  </Link>
</Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-28">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[2.25rem] border border-dusk/8 bg-dusk p-8 text-white shadow-lifted sm:p-10">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                Pure beauty in process
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">
                Handcrafted with
                <br />
                softness and intent.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
                Every naevii piece begins with feeling — then takes form through colour,
                proportion, finishing, and the care that makes handmade work feel truly special.
              </p>

              <div className="mt-8 grid gap-4">
                {craftPoints.map((point, index) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/78">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[2rem] border border-dusk/8 bg-white p-6 shadow-soft">
                <p className="text-xs uppercase tracking-[0.22em] text-plum">
                  Quiet elegance
                </p>
                <div className="mt-6 h-64 rounded-[1.5rem] bg-[linear-gradient(160deg,rgba(244,220,232,0.65),rgba(255,255,255,1),rgba(91,45,142,0.09))]" />
                <p className="mt-6 font-display text-3xl text-dusk">Softness, styled beautifully</p>
                <p className="mt-2 text-sm leading-7 text-dusk/64">
                  Gentle colour stories and polished finishing designed to look elevated in every light.
                </p>
              </div>

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-dusk/8 bg-white p-6 shadow-soft sm:mt-12">
                <p className="text-xs uppercase tracking-[0.22em] text-plum">
                  Meaningful form
                </p>
                <div className="mt-6 h-64 rounded-[1.5rem] bg-[linear-gradient(160deg,rgba(237,232,245,0.9),rgba(255,255,255,1),rgba(244,220,232,0.42))]" />
                <p className="mt-6 font-display text-3xl text-dusk">Beauty with a personal soul</p>
                <p className="mt-2 text-sm leading-7 text-dusk/64">
                  Custom details and keepsake energy make every piece feel more intimate and lasting.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-24">
        <Reveal className="rounded-[2.4rem] border border-dusk/8 bg-white p-6 shadow-lifted sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
                Worn and remembered
              </p>
              <h2 className="mt-4 font-display text-4xl text-dusk sm:text-5xl">
                Jewellery that feels
                <br />
                personal before it
                <br />
                is even worn.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-dusk/68">
                The beauty of naevii lives in how each piece feels — soft to the eye,
refined in finish, and lasting in meaning.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5"
                >
                  Shop now
                </Link>
                <Link
                  href="/custom"
                  className="inline-flex items-center justify-center rounded-full border border-dusk/10 px-6 py-3 text-sm font-semibold text-dusk transition duration-500 hover:border-plum/30 hover:text-plum"
                >
                  Request a custom order
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[1.6rem] border border-dusk/8 bg-pearl px-5 py-5 shadow-soft"
                >
                  <div className="mb-4 flex items-center gap-1 text-[#c9a227]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span key={starIndex}>★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-dusk/72">“{item.quote}”</p>
                  <div className="mt-4 border-t border-dusk/8 pt-4">
                    <p className="font-medium text-dusk">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-dusk/42">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}