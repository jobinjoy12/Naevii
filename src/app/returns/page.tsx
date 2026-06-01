import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-10%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />

      <section className="section-shell relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <div
            className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/84 p-8 text-center shadow-lifted backdrop-blur-xl sm:p-10"
            style={{ animation: 'fadeUp 0.7s ease both' }}
          >
            <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
              Returns policy
            </span>

            <h1 className="mt-5 font-display text-4xl text-dusk sm:text-5xl">
              No returns accepted
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
              We sincerely apologize, but we are currently not accepting any returns.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
              We follow a strict no return policy, and all purchases are considered final.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
              We truly appreciate your understanding, patience, and support. Thank you for shopping with us.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-dusk/8 bg-pearl px-5 py-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                Important note
              </p>
              <p className="mt-3 text-sm leading-7 text-dusk/60">
                If you have any issue with your order, please contact us and we will do our best to help.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]"
              >
                Back to shop
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-dusk/10 bg-white px-6 py-3.5 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}