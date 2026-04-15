'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

const AUTO_ADVANCE_MS = 3000;

export function TestimonialsCarousel() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [index, setIndex] = useState(0);
  const current = testimonials[index] ?? testimonials[0];

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  if (!current) return null;

  return (
    <section id="testimonial" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground shadow-sm">
            {t.home?.testimonial ?? 'Testimonial'}
          </span>
          <h2 className="mt-4 font-display italic text-3xl font-bold text-gray-900">
            {t.home?.customerSay ?? 'Customer Say About Our Services'}
          </h2>
        </div>
        <div className="mt-12 flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:min-h-[280px] md:flex-row">
          <div className="relative h-64 w-full shrink-0 md:h-auto md:min-h-[280px] md:w-1/3">
            <Image
              src={current.roomImageUrl ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex min-h-[200px] flex-1 flex-col justify-center p-8 md:min-h-0 md:p-12">
            <Quote className="h-12 w-12 shrink-0 text-brand-muted" aria-hidden />
            <blockquote className="mt-4 min-h-[4.5rem] text-gray-700 md:min-h-[5rem]">
              {locale === 'mn' && current.textMn ? current.textMn : current.text}
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-muted" />
              <div>
                <p className="font-semibold text-gray-900">{current.author}</p>
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm hover:bg-brand-muted"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm hover:bg-brand-muted"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
