'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Globe, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

export function Header() {
  const { locale, setLocale } = useLocale();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const t = useTranslations(locale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      {/* Top utility bar - higher z so language dropdown appears above nav */}
      <div className="relative z-[60] border-b border-white/20 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm text-white">
          <div className="flex items-center gap-6">
            <a
              href="mailto:ubhotel.hotel@gmail.com"
              className="flex items-center gap-2 hover:text-teal-300"
            >
              <span className="sr-only">Email</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ubhotel.hotel@gmail.com
            </a>
            <a
              href="tel:+01236547587"
              className="flex items-center gap-2 hover:text-teal-300"
            >
              <span className="sr-only">Phone</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +01 236 547 587
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <Globe className="h-4 w-4" aria-hidden />
                <span>{locale === 'en' ? 'Eng' : 'MN'}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <ul
                  className="absolute right-0 top-full z-[100] mt-1 min-w-[100px] rounded-md border border-gray-200 bg-white py-1 text-gray-900 shadow-xl"
                  role="listbox"
                >
                  <li>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => { setLocale('en'); setLangOpen(false); }}
                    >
                      English
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => { setLocale('mn'); setLangOpen(false); }}
                    >
                      Монгол
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <Link href="/signup">
              <Button variant="default" size="sm" className="gap-2 bg-teal-600 hover:bg-teal-500">
                {t.nav.signup}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2 border-white text-white hover:bg-white/10">
                <User className="h-4 w-4" aria-hidden />
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/staff">
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="h-4 w-4" aria-hidden />
                {t.nav.addHotel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <nav className="relative z-50 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            UbHotel
          </Link>
          <ul className="flex items-center gap-8">
            <li><Link href="/" className="text-white hover:text-teal-300">{t.nav.home}</Link></li>
            <li><Link href="/rooms" className="text-white hover:text-teal-300">{t.nav.rooms}</Link></li>
            <li><Link href="/offers" className="text-white hover:text-teal-300">{t.nav.offers}</Link></li>
            <li>
              <Link href="/memberships" className="flex items-center gap-1 text-white hover:text-teal-300">
                {t.nav.memberships}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
            </li>
            <li>
              <Link href="/more" className="flex items-center gap-1 text-white hover:text-teal-300">
                {t.nav.more}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
