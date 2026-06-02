'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';

const navItems = [
  { href: '/shop', label: 'Shop' },
  { href: '/customs', label: 'Custom' },
  { href: '/meaning', label: 'Meaning' },
];

export function Navbar() {
  const itemCount = useCartStore((s) => s.count());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/55 bg-white/72 px-5 py-3 shadow-[0_8px_30px_rgba(44,26,58,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sm:px-6">
        <Link href="/" className="group relative shrink-0" aria-label="naevii home">
          <div className="flex flex-col leading-none">
            <span className="font-display text-[1.55rem] tracking-[-0.04em] text-dusk transition duration-500 group-hover:text-plum sm:text-[1.85rem]">
              naevii.co
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.28em] text-dusk/38 sm:text-[10px]">
              Pure beauty, handcrafted
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-[13px] font-medium uppercase tracking-[0.18em] text-dusk/66">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative transition duration-300 hover:text-plum"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="inline-flex h-11 items-center justify-center rounded-full border border-dusk/10 bg-white/70 px-4 text-sm font-medium text-dusk transition duration-300 hover:border-plum/30 hover:text-plum"
            >
              Account
            </Link>

            <Link
              href="/checkout"
              className="inline-flex h-11 items-center justify-center rounded-full bg-dusk px-4 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-plum"
            >
              Cart
              <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-white/14 px-2 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-dusk/10 bg-white/70 text-dusk transition duration-300 active:scale-[0.985] hover:border-plum/30 hover:text-plum md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-5 origin-center rounded-full bg-current transition duration-500 ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-0.5 w-5 origin-center rounded-full bg-current transition duration-500 ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Dimmed backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-dusk/20 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile sheet */}
      <div
        className={`absolute left-3 right-3 top-full z-50 mt-2 overflow-hidden rounded-[1.5rem] border border-white/50 bg-white/90 shadow-[0_10px_40px_rgba(44,26,58,0.12)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="h-1 w-8 rounded-full bg-dusk/15" />
        </div>

        <div className="px-5 pb-6 pt-1">
          <div className="mb-4 border-b border-dusk/8 pb-4">
            <p className="font-display text-2xl text-dusk">naevii.co</p>
            <p className="mt-1 text-sm leading-6 text-dusk/55">
              The essence of pure beauty, expressed through handcrafted jewellery.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3.5 text-[15px] font-medium text-dusk transition-all duration-300 active:scale-[0.985] active:bg-pearl/60 hover:bg-pearl hover:text-plum"
                style={{
                  transitionDelay: menuOpen ? `${index * 40}ms` : '0ms',
                }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-3 py-3.5 text-[15px] font-medium text-dusk transition-all duration-300 active:scale-[0.985] active:bg-pearl/60 hover:bg-pearl hover:text-plum"
              style={{
                transitionDelay: menuOpen ? `${navItems.length * 40}ms` : '0ms',
              }}
            >
              Account
            </Link>

            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="mt-3 inline-flex min-h-12 items-center justify-between rounded-full bg-dusk px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 active:scale-[0.985] hover:bg-plum"
            >
              <span>Cart</span>
              <span className="rounded-full bg-white/14 px-2.5 py-1 text-xs">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}