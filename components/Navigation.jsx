'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Buy & Sell', href: '/real-estate' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="container-shell flex h-18 min-h-16 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-lg font-black text-white shadow-lg shadow-blue-200">
            L
          </span>
          <span>
            <span className="block text-xl font-black leading-none text-slate-950">LoanHub</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Smart loans</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 text-xl font-black text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? '×' : '☰'}
        </button>

        <div className={`${open ? 'block' : 'hidden'} absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-4 shadow-xl md:static md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/compare" className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-blue-700 md:inline-flex">
          Get Started
        </Link>
      </nav>
    </header>
  );
}
