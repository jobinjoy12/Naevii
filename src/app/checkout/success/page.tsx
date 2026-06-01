import Link from 'next/link';

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

const nextSteps = [
  'Your payment has been received and your order is now recorded.',
  'We’ll begin preparing your handcrafted piece and share updates as it moves forward.',
  'You can revisit order status anytime from your account.',
];

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order?.trim();

  return (
    <main className="relative min-h-screen overflow-hidden bg-pearl">
      <div className="absolute left-[-8%] top-10 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-8%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />

      <section className="section-shell relative flex min-h-screen items-center py-12 sm:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div
              className="space-y-6"
              style={{ animation: 'fadeUp 0.7s ease both' }}
            >
              <span className="inline-flex rounded-full border border-plum/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum shadow-soft backdrop-blur">
                Order confirmed
              </span>

              <div>
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(237,248,239,1),rgba(255,255,255,1),rgba(214,237,220,0.9))] shadow-soft">
                  <span className="text-3xl text-[#32724b]">✓</span>
                </div>

                <h1 className="mt-6 font-display text-5xl leading-[0.95] text-dusk sm:text-6xl">
                  Thank you.
                  <br />
                  Your order is
                  <br />
                  confirmed.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
                  Your naevii order has been received successfully. We’ll now
                  take it forward with the same softness, care, and attention
                  that shaped the piece itself.
                </p>
              </div>

              <div className="grid gap-3">
                {nextSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-dusk/8 bg-white/72 px-4 py-4 shadow-soft backdrop-blur"
                    style={{
                      animation: `fadeUp 0.65s ease ${index * 90 + 120}ms both`,
                    }}
                  >
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum text-xs font-semibold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-dusk/66">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/84 p-6 shadow-lifted backdrop-blur-xl sm:p-8 lg:p-10"
              style={{ animation: 'fadeUp 0.8s ease 120ms both' }}
            >
              <div className="rounded-[1.8rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(250,241,247,0.96),rgba(244,233,255,0.88))] p-6 shadow-soft">
                <p className="text-xs uppercase tracking-[0.22em] text-dusk/38">
                  Order reference
                </p>

                {orderNumber ? (
                  <div className="mt-3 rounded-[1.4rem] border border-plum/10 bg-white/85 px-4 py-4">
                    <p className="font-mono text-sm font-semibold tracking-[0.06em] text-plum sm:text-base">
                      {orderNumber}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-dusk/56">
                    Your order has been confirmed successfully.
                  </p>
                )}

                <p className="mt-4 text-sm leading-7 text-dusk/62">
                  A confirmation message will be sent to your email. Handmade
                  orders generally move into preparation within 3–7 days,
                  depending on complexity and finishing.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-dusk/8 bg-pearl px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                    Payment
                  </p>
                  <p className="mt-2 text-sm font-medium text-dusk/72">
                    Received successfully
                  </p>
                </div>

                <div className="rounded-[1.4rem] border border-dusk/8 bg-pearl px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                    Tracking
                  </p>
                  <p className="mt-2 text-sm font-medium text-dusk/72">
                    Updates via account
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/account/orders"
                  className="inline-flex w-full items-center justify-center rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white transition duration-500 hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]"
                >
                  View my orders
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex w-full items-center justify-center rounded-full border border-dusk/10 bg-white px-6 py-3.5 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
                >
                  Continue shopping
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-dusk/40">
                Need help with your order? Use your account page to review status
                and reference your order number.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}