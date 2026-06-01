import Link from 'next/link';

const shopLinks = [
  { href: '/shop', label: 'Shop all' },
  { href: '/shop?collection=signature', label: 'Signature pieces' },
  { href: '/customs', label: 'Custom jewellery' },
];

const aboutLinks = [
  { href: '/meaning', label: 'The meaning of naevii' },
  { href: '/account', label: 'My account' },
  { href: '/checkout', label: 'Cart' },
];

const supportLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/returns', label: 'Returns' },
  { href: '/care', label: 'Jewellery care' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
];

export function Footer() {
  return (
    <footer className="section-shell pb-8 pt-10 sm:pb-10 sm:pt-16">
      <div className="overflow-hidden rounded-[2.4rem] border border-dusk/8 bg-white/80 shadow-lifted backdrop-blur-xl">
        <div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr] lg:px-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-block">
              <span className="wordmark-nav font-display text-4xl tracking-[-0.05em] text-dusk sm:text-5xl">
                naevii.co
              </span>
            </Link>

            <p className="mt-4 font-display text-xl italic leading-relaxed text-plum/90">
              The essence of pure beauty, expressed through handcrafted jewellery.
            </p>

            <p className="mt-4 text-sm leading-7 text-dusk/62">
              Soft in presence, refined in finish, and made to feel deeply personal.
              Each piece is crafted to hold beauty with quiet intention.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-dusk/45">
              <span className="rounded-full border border-dusk/8 bg-pearl px-3 py-2">
                Handmade
              </span>
              <span className="rounded-full border border-dusk/8 bg-pearl px-3 py-2">
                Custom
              </span>
              <span className="rounded-full border border-dusk/8 bg-pearl px-3 py-2">
                Pan-India
              </span>
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="border-t border-dusk/8 px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 text-sm text-dusk/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 naevii.co. All rights reserved.</p>

            <div className="flex flex-wrap items-center gap-4">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition duration-300 hover:text-plum"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: { href: string; label: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dusk/42">
        {title}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-dusk/68 transition duration-300 hover:text-plum"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}