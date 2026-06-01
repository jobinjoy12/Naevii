import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';

const contactCards = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@yourbrand.com',
    href: 'mailto:hello@yourbrand.com',
    hint: 'Best for order questions and general support.',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 00000 00000',
    href: 'tel:+910000000000',
    hint: 'Use your real support number here.',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@yourbrand',
    href: 'https://instagram.com/yourbrand',
    hint: 'A softer channel for casual queries and updates.',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Kanayannur, Kerala',
    href: '#',
    hint: 'Replace with your studio, office, or service region.',
  },
];

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden bg-pearl">
      <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#ead8fb]/45 blur-3xl" />
      <div className="absolute right-[-10%] top-16 h-96 w-96 rounded-full bg-[#f4dce8]/60 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/70 to-transparent" />

      <section className="section-shell relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div
            className="space-y-6"
            style={{ animation: 'fadeUp 0.7s ease both' }}
          >
            <span className="inline-flex rounded-full border border-plum/10 bg-plum/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-plum">
              Contact
            </span>

            <div>
              <h1 className="font-display text-5xl leading-[0.95] text-dusk sm:text-6xl">
                We’d love to
                <br />
                hear from you.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-dusk/66 sm:text-lg">
                Whether you have a question about an order, a custom request,
                product details, or a collaboration idea, send us a message and
                we’ll review it with care.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group rounded-[1.6rem] border border-white/60 bg-white/82 p-5 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lifted"
                    style={{
                      animation: `fadeUp 0.6s ease ${index * 70}ms both`,
                    }}
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(244,220,232,0.5),rgba(255,255,255,1),rgba(234,216,251,0.42))] text-plum shadow-soft">
                      <Icon size={18} />
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-dusk/38">
                      {item.label}
                    </p>

                    <p className="mt-2 font-medium text-dusk transition group-hover:text-plum">
                      {item.value}
                    </p>

                    <p className="mt-2 text-sm leading-7 text-dusk/56">
                      {item.hint}
                    </p>
                  </a>
                );
              })}
            </div>

            <div className="rounded-[1.8rem] border border-dusk/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(250,241,247,0.95),rgba(244,233,255,0.88))] p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-dusk">
                    Before you send your message
                  </p>
                  <p className="mt-2 text-sm leading-7 text-dusk/58">
                    Add your order number where relevant, mention the product
                    name if applicable, and keep your request clear so it’s easy
                    to assist you quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/84 p-6 shadow-lifted backdrop-blur-xl sm:p-8"
            style={{ animation: 'fadeUp 0.8s ease 120ms both' }}
          >
            <div className="rounded-[1.8rem] bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(250,241,247,0.96),rgba(244,233,255,0.88))] p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-dusk/38">
                    Send a message
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-dusk sm:text-4xl">
                    Let’s talk
                  </h2>
                </div>

                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                  <Sparkles size={16} />
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-dusk/58">
                This version is styled and ready for your backend. Point the
                form action to your API route, email handler, or Supabase edge
                function.
              </p>

              <form action="/api/contact" method="POST" className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Order help, product question, collaboration..."
                    className="w-full rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium tracking-[0.01em] text-dusk/74"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-2xl border border-dusk/10 bg-white px-4 py-3.5 text-sm text-dusk outline-none transition-all duration-300 placeholder:text-dusk/28 focus:-translate-y-0.5 focus:border-plum/35 focus:ring-4 focus:ring-plum/10"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-dusk/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-sm leading-7 text-dusk/52">
                    Share only the information needed for your request. Keep it
                    simple and easy to respond to.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-dusk px-6 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-plum hover:shadow-[0_14px_34px_rgba(91,45,142,0.22)]"
                  >
                    Send message
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-dusk/8 bg-pearl px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Orders
                </p>
                <p className="mt-2 text-sm leading-7 text-dusk/60">
                  Questions about shipping, status, or an existing purchase.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-dusk/8 bg-pearl px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-dusk/38">
                  Collaborations
                </p>
                <p className="mt-2 text-sm leading-7 text-dusk/60">
                  Brand partnerships, gifting, creator outreach, or custom ideas.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-dusk/10 bg-white px-5 py-3 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
              >
                Back to shop
              </Link>

              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center rounded-full border border-dusk/10 bg-white px-5 py-3 text-sm font-medium text-dusk transition duration-300 hover:-translate-y-0.5 hover:border-plum/20 hover:bg-pearl hover:text-plum"
              >
                View orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}