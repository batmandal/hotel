'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Wifi, Bed, ArrowLeft, Play } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { getHotelBySlug, getRoomsByHotelId, getLocationById, getRoomById } from '@/data/mockData';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200';
const DEFAULT_ROOM_VIDEO_THUMB = 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=1200';
const DEFAULT_ROOM_VIDEO_URL = 'https://www.youtube.com/embed/1Gv5l0Z4x8o?autoplay=1';

export default function RoomDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const roomId = typeof params?.roomId === 'string' ? params.roomId : '';
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const hotel = useMemo(() => getHotelBySlug(slug), [slug]);
  const room = useMemo(() => getRoomById(roomId), [roomId]);
  const location = hotel ? getLocationById(hotel.locationId) : undefined;
  const hotelRooms = hotel ? getRoomsByHotelId(hotel.id) : [];
  const roomBelongsToHotel = hotel && room && hotelRooms.some((r) => r.id === room.id);

  const videoUrl = room?.videoUrl ?? DEFAULT_ROOM_VIDEO_URL;
  const videoThumb = room?.videoThumbnailUrl ?? DEFAULT_ROOM_VIDEO_THUMB;

  if (!hotel || !room || !roomBelongsToHotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-gray-500">{!hotel ? 'Hotel not found.' : 'Room not found.'}</p>
        <Link href={hotel ? `/hotels/${slug}` : '/'} className="mt-4 inline-block text-teal-600 hover:underline">
          {hotel ? 'Back to hotel' : 'Back to home'}
        </Link>
      </div>
    );
  }

  const roomDescription = locale === 'mn' && room.descriptionMn ? room.descriptionMn : room.description;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href={`/hotels/${slug}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {locale === 'mn' ? 'Зочид буудлын хуудас руу буцах' : 'Back to hotel'}
          </Link>

          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="relative aspect-video w-full">
              <Image
                src={hotel.imageUrls?.[0] ?? DEFAULT_ROOM_IMAGE}
                alt={room.typeName}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              <div className="absolute left-0 top-0 p-4">
                <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow">
                  {room.typeName}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{room.typeName}</h1>
                  <p className="mt-1 text-gray-500">
                    Room {room.number} · Floor {room.floor} · Up to {room.maxGuests} guests
                  </p>
                  {location && (
                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                      {hotel.name}, {location.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-teal-600">
                    ${room.basePricePerNight}
                    <span className="text-base font-normal text-gray-500"> {t.common.perNight}</span>
                  </p>
                  <Link href={`/book/${hotel.id}?room=${room.id}`} className="mt-3 block">
                    <Button size="lg" className="w-full sm:w-auto">{t.common.bookNow}</Button>
                  </Link>
                </div>
              </div>

              {roomDescription && (
                <section className="mt-8 border-t border-gray-100 pt-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {locale === 'mn' ? 'Өрөөний тайлбар' : 'Room description'}
                  </h2>
                  <p className="mt-3 text-gray-700 leading-relaxed">{roomDescription}</p>
                </section>
              )}

              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'mn' ? 'Өрөөний видео' : 'Room video'}
                </h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg">
                  {videoPlaying && videoUrl ? (
                    <iframe
                      src={videoUrl}
                      title={locale === 'mn' ? `${room.typeName} - видео` : `${room.typeName} video`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={videoThumb}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 896px) 100vw, 896px"
                      />
                      <button
                        type="button"
                        onClick={() => setVideoPlaying(true)}
                        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-teal-600 shadow-xl transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-4 focus:ring-teal-400"
                        aria-label={locale === 'mn' ? 'Видео тоглуулах' : 'Play video'}
                      >
                        <Play className="h-8 w-8 fill-current pl-1" aria-hidden />
                      </button>
                    </>
                  )}
                </div>
              </section>

              <section className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  {locale === 'mn' ? 'Тоноглох боломж' : 'Amenities'}
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm text-teal-800"
                    >
                      <Wifi className="h-4 w-4 text-teal-600" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>

              {(room.sizeSqm ?? room.maxExtraBeds) && (
                <section className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
                  {room.sizeSqm != null && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-teal-600" aria-hidden />
                      {room.sizeSqm} m²
                    </span>
                  )}
                  {room.maxExtraBeds > 0 && (
                    <span>
                      {locale === 'mn' ? 'Нэмэлт ор' : 'Extra beds'}: up to {room.maxExtraBeds}
                    </span>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
