'use client';

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHotelsWithLocation } from '@/data/mockData';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import type { HotelCategory } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const q = searchParams.get('q') ?? '';
  const locationId = searchParams.get('location') ?? '';
  const category = searchParams.get('category') ?? '';
  const rating = searchParams.get('rating') ?? '';

  const hotels = useMemo(() => {
    let list = getHotelsWithLocation();
    if (q?.trim()) {
      const lower = q.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(lower) ||
          h.description?.toLowerCase().includes(lower) ||
          h.location?.name?.toLowerCase().includes(lower)
      );
    }
    if (locationId) list = list.filter((h) => h.locationId === locationId);
    if (category) list = list.filter((h) => h.category === (category as HotelCategory));
    if (rating) list = list.filter((h) => h.starRating >= parseInt(rating, 10));
    return list;
  }, [q, locationId, category, rating]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="border-b bg-white py-4 pt-28">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <article
              key={hotel.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <Link href={`/hotels/${hotel.slug}`} className="block">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={hotel.imageUrls?.[0] ?? '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-sm text-white">
                    <Star className="h-4 w-4 fill-current" aria-hidden />
                    {hotel.starRating} {t.common.star}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900">{hotel.name}</h2>
                  {hotel.location && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                      {hotel.location.name}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{hotel.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-teal-600">
                      {t.common.from} ${hotel.basePricePerNight}
                      <span className="text-sm font-normal text-gray-500">{t.common.perNight}</span>
                    </span>
                    <Button size="sm">{t.common.viewDetails}</Button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        {hotels.length === 0 && (
          <p className="py-12 text-center text-gray-500">No hotels match your search. Try different filters.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 pt-28 py-8">
          <p className="text-center text-gray-500">Loading search...</p>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
