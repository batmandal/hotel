"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { getRecommendedRooms } from "@/data/mockData";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceFromUsd } from "@/lib/pricing";

export function FeaturedRoomsCarousel() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [index, setIndex] = useState(0);
  const rooms = getRecommendedRooms();
  if (rooms.length === 0) return null;

  return (
    <section className="bg-neutral-100 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground shadow-sm">
              {t.home?.featuredHotels ?? "Featured Hotels"}
            </span>
            <h2 className="mt-4 font-display italic text-3xl font-bold text-gray-900">
              {t.home?.premiumStays ?? "Check Out Premium Stays"}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm transition-all hover:bg-neutral-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setIndex((i) => Math.min(rooms.length - 1, i + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand shadow-sm transition-all hover:bg-neutral-50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {rooms.map((room, i) => {
            const hotel = room.hotel;
            const slug = hotel?.slug ?? "ubhotel-ulaanbaatar";
            const imgUrl =
              room.imageUrls?.[0] ??
              hotel?.imageUrls?.[0] ??
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600";
            return (
              <Link
                key={room.id}
                href={`/hotels/${slug}/rooms/${room.id}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg active:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={imgUrl}
                    alt={room.typeName}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white">
                    {index === i ? (locale === 'mn' ? 'Алдартай' : 'Popular') : (locale === 'mn' ? 'Боломжтой' : 'Available')}
                  </span>
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors hover:text-brand hover:bg-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    aria-label="Save"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-brand break-words">
                    {formatPriceFromUsd(room.basePricePerNight, locale)}
                  </p>
                  <h3 className="mt-1 font-medium text-gray-900">
                    {room.typeName}
                  </h3>
                  {hotel && (
                    <p className="mt-1 text-sm text-gray-500">{hotel.name}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
