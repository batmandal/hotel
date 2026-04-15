'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Wifi } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { getHotelBySlug, getRoomsByHotelId, getLocationById } from '@/data/mockData';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { formatPriceFromUsd } from '@/lib/pricing';

export default function HotelDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const fullHotel = useMemo(() => getHotelBySlug(slug), [slug]);
  const location = fullHotel ? getLocationById(fullHotel.locationId) : undefined;
  const rooms = fullHotel ? getRoomsByHotelId(fullHotel.id) : [];

  if (!fullHotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-gray-500">Hotel not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative h-[40vh] w-full pt-32">
        <Image
          src={fullHotel.imageUrls?.[0] ?? 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920'}
          alt={fullHotel.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" aria-hidden />
              <span>{fullHotel.starRating} {t.common.star} · {fullHotel.category}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">{fullHotel.name}</h1>
            {location && (
              <p className="mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden />
                {location.name}, {fullHotel.address}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-gray-700">{fullHotel.description}</p>
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900">Amenities</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {fullHotel.amenities?.map((a) => (
                  <li key={a} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <Wifi className="h-4 w-4 text-brand" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-brand wrap-break-word">
                {formatPriceFromUsd(fullHotel.basePricePerNight, locale)}
                <span className="text-base font-normal text-gray-500"> {t.common.perNight}</span>
              </p>
              <Link href={`/book/${fullHotel.id}`}>
                <Button className="mt-4 w-full" size="lg">{t.common.bookNow}</Button>
              </Link>
            </div>
          </div>
        </div>
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Rooms</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-lg border bg-white p-4">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/hotels/${fullHotel.slug}/rooms/${room.id}`} className="font-medium text-gray-900 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand rounded">
                      {room.typeName}
                    </Link>
                    <p className="text-sm text-gray-500">Room {room.number} · Floor {room.floor}</p>
                    <p className="mt-1 text-sm text-gray-600">Up to {room.maxGuests} guests</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-semibold text-brand wrap-break-word max-w-48 sm:max-w-none">{formatPriceFromUsd(room.basePricePerNight, locale)} {t.common.perNight}</p>
                    <div className="flex gap-2">
                      <Link href={`/hotels/${fullHotel.slug}/rooms/${room.id}`}>
                        <Button size="sm" variant="outline">{locale === 'mn' ? 'Дэлгэрэнгүй' : 'Details'}</Button>
                      </Link>
                      <Link href={`/book/${fullHotel.id}?room=${room.id}`}>
                        <Button size="sm" variant="secondary">Select</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                {(room.description ?? room.descriptionMn) && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {locale === 'mn' ? 'Өрөөний тайлбар' : 'Room description'}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {locale === 'mn' && room.descriptionMn ? room.descriptionMn : room.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
