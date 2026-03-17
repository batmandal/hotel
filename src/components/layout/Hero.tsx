'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

export function Hero() {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  return (
    <section className="relative h-screen w-full">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920"
          alt="Luxury resort with pool and lounge area"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 pt-48 pb-32 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/90">
          {t.hero.tagline}
        </p>
        <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          {t.hero.title}
          <span className="italic text-teal-400"> {t.hero.titleHighlight} </span>
          {t.hero.titleEnd}
        </h1>
        <p className="max-w-2xl text-lg text-white/90">
          {t.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
