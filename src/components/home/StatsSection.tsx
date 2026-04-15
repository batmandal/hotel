'use client';

import React from 'react';
import { siteStats } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

export function StatsSection() {
  const { locale } = useLocale();
  const t = useTranslations(locale);

  return (
    <section className="bg-brand py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {siteStats.map((stat) => (
            <div key={stat.value} className="text-center text-white">
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-white/80">
                {locale === 'mn' ? (stat.labelMn ?? stat.label) : stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
