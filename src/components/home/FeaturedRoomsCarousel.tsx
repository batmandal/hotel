"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { getRecommendedRooms } from "@/data/mockData";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";

export function FeaturedRoomsCarousel() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [index, setIndex] = useState(0);
  const rooms = getRecommendedRooms();
  const visible = rooms.slice(0, 4);

  if (visible.length === 0) return null;

  return (
    <section className="bg-teal-50 py-16 ">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
              {t.home?.featuredHotels ?? "Featured Hotels"}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              {t.home?.premiumStays ?? "Check Out Premium Stays"}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-500 text-teal-600 transition-all hover:bg-teal-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setIndex((i) => Math.min(visible.length - 1, i + 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-500 text-teal-600 transition-all hover:bg-teal-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((room, i) => {
            const hotel = room.hotel;
            const slug = hotel?.slug ?? "UbHotel-ulaanbaatar";
            const imgUrl =
              hotel?.imageUrls?.[0] ??
              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600";
            return (
              <Link
                key={room.id}
                href={`/hotels/${slug}/rooms/${room.id}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg active:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
                    {index === i ? "Most Popular" : "Available"}
                  </span>
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Save"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-teal-600">
                    ${room.basePricePerNight}{" "}
                    {t.home?.startFrom ?? "Start from"}
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
