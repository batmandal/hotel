'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Wifi, Bed, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { getHotelBySlug, getRoomsByHotelId, getLocationById, getRoomById } from '@/data/mockData';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { formatPriceFromUsd } from '@/lib/pricing';
import { getRoomImageGallery } from '@/lib/roomGallery';
import { cn } from '@/lib/utils';

const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200';

function BookingCard({
  locale,
  roomTypeName,
  priceLabel,
  perNight,
  bookLabel,
  bookHref,
  className,
}: {
  locale: string;
  roomTypeName: string;
  priceLabel: string;
  perNight: string;
  bookLabel: string;
  bookHref: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100/80 bg-white p-6 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-black/4',
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {locale === 'mn' ? 'Өрөө' : 'Room'}
      </p>
      <p className="mt-1 font-semibold text-gray-900 line-clamp-2">{roomTypeName}</p>
      <p className="mt-4 text-2xl font-bold text-brand wrap-break-word">
        {priceLabel}
        <span className="text-base font-normal text-gray-500"> {perNight}</span>
      </p>
      <Link href={bookHref} className="mt-4 block">
        <Button size="lg" className="h-12 w-full rounded-xl text-base font-semibold shadow-sm">
          {bookLabel}
        </Button>
      </Link>
    </div>
  );
}

export default function RoomDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const roomId = typeof params?.roomId === 'string' ? params.roomId : '';
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const hotel = useMemo(() => getHotelBySlug(slug), [slug]);
  const room = useMemo(() => getRoomById(roomId), [roomId]);
  const location = hotel ? getLocationById(hotel.locationId) : undefined;
  const hotelRooms = hotel ? getRoomsByHotelId(hotel.id) : [];
  const roomBelongsToHotel = hotel && room && hotelRooms.some((r) => r.id === room.id);

  const galleryImages = useMemo(() => {
    if (!hotel || !room) return [DEFAULT_ROOM_IMAGE];
    return getRoomImageGallery(room, hotel);
  }, [hotel, room]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [roomId]);

  useEffect(() => {
    if (activeImageIdx >= galleryImages.length) setActiveImageIdx(0);
  }, [galleryImages.length, activeImageIdx]);

  if (!hotel || !room || !roomBelongsToHotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-gray-500">{!hotel ? 'Hotel not found.' : 'Room not found.'}</p>
        <Link href={hotel ? `/hotels/${slug}` : '/'} className="mt-4 inline-block text-brand hover:underline">
          {hotel ? 'Back to hotel' : 'Back to home'}
        </Link>
      </div>
    );
  }

  const roomDescription = locale === 'mn' && room.descriptionMn ? room.descriptionMn : room.description;
  const priceLabel = formatPriceFromUsd(room.basePricePerNight, locale);
  const bookHref = `/book/${hotel.id}?room=${room.id}`;

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href={`/hotels/${slug}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-brand hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand rounded"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {locale === 'mn' ? 'Зочид буудлын хуудас руу буцах' : 'Back to hotel'}
          </Link>

          <div className="lg:grid lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start lg:gap-10">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/4">
                <div
                  className="relative aspect-video w-full bg-gray-100"
                  role="region"
                  aria-label={locale === 'mn' ? 'Өрөөний зураг' : 'Room photos'}
                >
                  <Image
                    src={galleryImages[activeImageIdx] ?? DEFAULT_ROOM_IMAGE}
                    alt={room.typeName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                  />
                  <div className="absolute left-0 top-0 p-4">
                    <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow">
                      {room.typeName}
                    </span>
                  </div>
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length)
                        }
                        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={locale === 'mn' ? 'Өмнөх зураг' : 'Previous photo'}
                      >
                        <ChevronLeft className="h-6 w-6" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((i) => (i + 1) % galleryImages.length)}
                        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={locale === 'mn' ? 'Дараагийн зураг' : 'Next photo'}
                      >
                        <ChevronRight className="h-6 w-6" aria-hidden />
                      </button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-black/45 px-2 py-1 text-xs font-medium text-white">
                        {activeImageIdx + 1} / {galleryImages.length}
                      </div>
                    </>
                  )}
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-gray-50/80 p-3">
                    {galleryImages.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setActiveImageIdx(i)}
                        className={cn(
                          'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                          activeImageIdx === i
                            ? 'border-brand shadow-md ring-2 ring-brand/25'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        )}
                        aria-label={
                          locale === 'mn'
                            ? `Зураг ${i + 1}, нийт ${galleryImages.length}`
                            : `Photo ${i + 1} of ${galleryImages.length}`
                        }
                        aria-current={activeImageIdx === i ? 'true' : undefined}
                      >
                        <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 lg:hidden">
                <BookingCard
                  locale={locale}
                  roomTypeName={room.typeName}
                  priceLabel={priceLabel}
                  perNight={t.common.perNight}
                  bookLabel={t.common.bookNow}
                  bookHref={bookHref}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm ring-1 ring-black/3 md:p-8">
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

                {roomDescription && (
                  <section className="mt-8 border-t border-gray-100 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {locale === 'mn' ? 'Өрөөний тайлбар' : 'Room description'}
                    </h2>
                    <p className="mt-3 leading-relaxed text-gray-700">{roomDescription}</p>
                  </section>
                )}

                <section className="mt-8 border-t border-gray-100 pt-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {locale === 'mn' ? 'Тоноглох боломж' : 'Amenities'}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {room.amenities.map((a) => (
                      <li
                        key={a}
                        className="flex items-center gap-2 rounded-full bg-brand-muted px-4 py-2 text-sm text-brand"
                      >
                        <Wifi className="h-4 w-4 text-brand" aria-hidden />
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>

                {(room.sizeSqm ?? room.maxExtraBeds) ? (
                  <section className="mt-6 flex flex-wrap gap-6 border-t border-gray-100 pt-6 text-sm text-gray-600">
                    {room.sizeSqm != null && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-brand" aria-hidden />
                        {room.sizeSqm} m²
                      </span>
                    )}
                    {room.maxExtraBeds > 0 && (
                      <span>
                        {locale === 'mn' ? 'Нэмэлт ор' : 'Extra beds'}: up to {room.maxExtraBeds}
                      </span>
                    )}
                  </section>
                ) : null}
              </div>
            </div>

            <aside className="mt-8 hidden lg:mt-0 lg:block">
              <div className="sticky top-28">
                <BookingCard
                  locale={locale}
                  roomTypeName={room.typeName}
                  priceLabel={priceLabel}
                  perNight={t.common.perNight}
                  bookLabel={t.common.bookNow}
                  bookHref={bookHref}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
