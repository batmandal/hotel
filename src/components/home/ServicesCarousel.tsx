'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hospitalityServices } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

export function ServicesCarousel() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
              {t.home?.services ?? 'Services'}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              {t.home?.premiumServices ?? 'Premium Hospitality Services'}
            </h2>
          </div>
          <Link href="/rooms">
            <Button variant="outline" className="gap-2 border-teal-500 text-teal-600">
              {t.home?.viewMore ?? 'View More'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div
          ref={scrollRef}
          className="mt-8 flex gap-6 overflow-x-auto pb-4 scroll-smooth md:snap-x md:snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {hospitalityServices.map((s) => (
            <div
              key={s.id}
              className="relative h-80 w-72 shrink-0 overflow-hidden rounded-xl md:snap-start"
            >
              <Image
                src={s.imageUrl}
                alt={s.name}
                fill
                className="object-cover"
                sizes="288px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm opacity-90">
                  {locale === 'mn' ? (s.taglineMn ?? s.tagline) : s.tagline}
                </p>
                <p className="mt-2 text-xl font-bold">{locale === 'mn' ? (s.nameMn ?? s.name) : s.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
