'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getHotelsWithLocation, getRoomsByHotelId } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { MapPin, Heart, Bed, Bath, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'standard' | 'deluxe' | 'suite' | 'villa' | 'family';

const FILTERS: { value: FilterType; labelEn: string; labelMn: string }[] = [
  { value: 'all', labelEn: 'All', labelMn: 'Бүгд' },
  { value: 'standard', labelEn: 'Standard', labelMn: 'Стандарт' },
  { value: 'deluxe', labelEn: 'Deluxe', labelMn: 'Делюкс' },
  { value: 'suite', labelEn: 'Suite', labelMn: 'Сүүт' },
  { value: 'villa', labelEn: 'Villa', labelMn: 'Вилла' },
  { value: 'family', labelEn: 'Family', labelMn: 'Гэр бүл' },
];

function roomMatchesFilter(roomTypeName: string, filter: FilterType): boolean {
  if (filter === 'all') return true;
  const lower = roomTypeName.toLowerCase();
  if (filter === 'standard') return lower.includes('standard');
  if (filter === 'deluxe') return lower.includes('deluxe');
  if (filter === 'suite') return lower.includes('suite');
  if (filter === 'villa') return lower.includes('villa');
  if (filter === 'family') return lower.includes('family');
  return true;
}

export function ExploreRoomsSection() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [filter, setFilter] = useState<FilterType>('all');

  const hotels = useMemo(() => getHotelsWithLocation(), []);
  const allRoomsWithHotel = useMemo(() => {
    const list: { room: ReturnType<typeof getRoomsByHotelId>[0]; hotel: (typeof hotels)[0] }[] = [];
    hotels.forEach((hotel) => {
      getRoomsByHotelId(hotel.id).forEach((room) => {
        list.push({ room, hotel });
      });
    });
    return list;
  }, [hotels]);

  const filtered = useMemo(
    () => allRoomsWithHotel.filter(({ room }) => roomMatchesFilter(room.typeName, filter)),
    [allRoomsWithHotel, filter]
  );

  const displayRooms = filtered.slice(0, 8);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
              {t.home?.ourRooms ?? 'Our All Rooms'}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              {t.home?.exploreRooms ?? 'Explore All Our Rooms'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200',
                  'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                  filter === f.value
                    ? 'bg-teal-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:border-teal-400 hover:bg-teal-50/50'
                )}
              >
                {locale === 'mn' ? f.labelMn : f.labelEn}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayRooms.length === 0 ? (
            <p className="col-span-full py-8 text-center text-gray-500">
              No rooms match this filter.
            </p>
          ) : displayRooms.map(({ room, hotel }) => (
            <article
              key={room.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Link
                href={`/hotels/${hotel.slug}/rooms/${room.id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={hotel.imageUrls?.[0] ?? 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'}
                    alt={room.typeName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded bg-gray-800/90 px-2 py-1 text-xs font-medium text-white">
                    {room.typeName}
                  </span>
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50"
                    aria-label="Save"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-teal-600">
                    ${room.basePricePerNight} {t.home?.startFrom ?? 'Start from'}
                  </p>
                  <h3 className="mt-2 font-semibold text-gray-900">{room.typeName}</h3>
                  <p className="mt-1 text-sm text-gray-600">{hotel.name}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" aria-hidden />
                      1 {t.common?.rooms ?? 'Room'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" aria-hidden />
                      1 Bathroom
                    </span>
                    {room.sizeSqm != null && (
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" aria-hidden />
                        {room.sizeSqm} m²
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {hotel.location?.name ?? hotel.address}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      ★ {hotel.starRating}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        {displayRooms.length > 0 && (
        <div className="mt-12 text-center">
          <Link href="/rooms">
            <Button size="lg" className="gap-2 active:scale-[0.98] transition-transform">
              {t.home?.viewMore ?? 'View More'} <span className="text-lg">›</span>
            </Button>
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}
