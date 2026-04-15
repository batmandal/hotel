'use client';

import Link from 'next/link';
import { MapPin, Star, BedDouble, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/LocaleContext';

export function AboutSummarySection() {
  const { locale } = useLocale();

  const highlights = [
    {
      icon: Star,
      valueEn: '5-Star',
      valueMn: '5 Одтой',
      labelEn: 'Rated Hotel',
      labelMn: 'Зочид буудал',
    },
    {
      icon: BedDouble,
      valueEn: '45+',
      valueMn: '45+',
      labelEn: 'Rooms',
      labelMn: 'Өрөө',
    },
    {
      icon: Clock,
      valueEn: '5+ Years',
      valueMn: '5+ Жил',
      labelEn: 'of Service',
      labelMn: 'Үйлчилгээ',
    },
    {
      icon: MapPin,
      valueEn: 'Ulaanbaatar',
      valueMn: 'Улаанбаатар',
      labelEn: 'City Center',
      labelMn: 'Хотын төв',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground shadow-sm">
              {locale === 'mn' ? 'Бидний тухай' : 'About Us'}
            </span>
            <h2 className="mt-4 font-display italic text-3xl font-bold text-gray-900">
              UbHotel
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              {locale === 'mn'
                ? 'UbHotel нь Улаанбаатар хотын төвд байрлах 5 одтой зочид буудал. Стандарт өрөөнөөс люкс сүүт хүртэл бүх төрлийн өрөөтэй бөгөөд жим, усан сан, ресторан зэрэг үйлчилгээгээр зочдоо угтдаг.'
                : 'UbHotel is a 5-star hotel in the heart of Ulaanbaatar. From standard rooms to luxury suites, we offer gym, pool, restaurant, and more to welcome every guest.'}
            </p>
            <p className="mt-3 leading-relaxed text-gray-600">
              {locale === 'mn'
                ? 'Сүхбаатар талбайн ойролцоо байрлах манай буудал хотын төв болон бизнес дүүрэгт ойрхон.'
                : 'Located near Sukhbaatar Square, our hotel is close to the city center and business district.'}
            </p>
            <Link href="/more" className="mt-6 inline-block">
              <Button variant="outline" className="gap-2 border-brand text-brand hover:bg-brand-muted">
                {locale === 'mn' ? 'Дэлгэрэнгүй' : 'Learn More'}
              </Button>
            </Link>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.labelEn}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted">
                  <h.icon className="h-6 w-6 text-brand" />
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {locale === 'mn' ? h.valueMn : h.valueEn}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {locale === 'mn' ? h.labelMn : h.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
