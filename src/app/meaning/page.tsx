import Link from 'next/link';

const pillars = [
  {
    title: 'Pure beauty',
    copy:
      'At the heart of naevii is a quiet idea of beauty — one that feels soft, clear, and deeply felt rather than loud or excessive.',
  },
  {
    title: 'Handcrafted expression',
    copy:
      'Each piece is shaped through deliberate making, where colour, proportion, and finishing come together with care.',
  },
  {
    title: 'Personal meaning',
    copy:
      'Jewellery becomes more beautiful when it feels personal. Custom details, keepsake energy, and thoughtful design are part of the naevii experience.',
  },
];

export default function MeaningPage() {
  return (
    <main className="bg-pearl">
      <section className="section-shell pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
            The meaning of naevii
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] text-dusk sm:text-6xl lg:text-7xl">
            naevii.co
          </h1>
          <p className="mt-6 font-display text-2xl italic leading-relaxed text-plum/90 sm:text-3xl">
            The essence of pure beauty, expressed through handcrafted jewellery.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-dusk/68 sm:text-lg">
            naevii is more than a name. It is a brand world built around softness,
            refinement, individuality, and pieces designed to feel personal from the first glance.
          </p>
        </div>
      </section>

      <section className="section-shell py-16 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-dusk/8 bg-white p-6 shadow-soft"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-dusk/38">
                0{index + 1}
              </p>
              <h2 className="mt-4 font-display text-3xl text-dusk">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-dusk/66">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-24">
        <div className="grid gap-8 rounded-[2.4rem] border border-dusk/8 bg-white p-8 shadow-lifted sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
              House narrative
            </p>
            <h2 className="mt-4 font-display text-4xl text-dusk sm:text-5xl">
              Beauty that feels
              <br />
              quiet, lasting,
              <br />
              and intentional.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-dusk/68">
              Every naevii piece is created to hold more than ornament. It is meant to
              carry softness in form, elegance in finish, and meaning in the way it is chosen,
              gifted, or worn.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(160deg,rgba(244,220,232,0.68),rgba(255,255,255,1),rgba(91,45,142,0.08))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-dusk/42">
              What naevii stands for
            </p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-dusk/68">
              <p>Softness over excess.</p>
              <p>Meaning over ornament alone.</p>
              <p>Craft over mass-made sameness.</p>
              <p>Elegance that feels personal.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5"
          >
            Shop the collection
          </Link>
          <Link
            href="/customs"
            className="inline-flex items-center justify-center rounded-full border border-dusk/10 px-6 py-3 text-sm font-semibold text-dusk transition duration-500 hover:border-plum/30 hover:text-plum"
          >
            Create a custom piece
          </Link>
        </div>
      </section>
    </main>
  );
}