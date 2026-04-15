"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getHotelsWithLocation,
  getRoomsByHotelId,
} from "@/data/mockData";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { MapPin, Heart, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPriceFromUsd } from "@/lib/pricing";

type FilterType = "all" | "standard" | "deluxe" | "suite" | "twin" | "family";

const FILTERS: { value: FilterType; labelEn: string; labelMn: string }[] = [
  { value: "all", labelEn: "All", labelMn: "Бүгд" },
  { value: "standard", labelEn: "Standard", labelMn: "Стандарт" },
  { value: "deluxe", labelEn: "Deluxe", labelMn: "Делюкс" },
  { value: "suite", labelEn: "Suite", labelMn: "Сүүт" },
  { value: "twin", labelEn: "Twin", labelMn: "Твин" },
  { value: "family", labelEn: "Family", labelMn: "Гэр бүл" },
];

const ALLOWED_TYPES: FilterType[] = [
  "all",
  "standard",
  "deluxe",
  "suite",
  "twin",
  "family",
];

function roomMatchesFilter(roomTypeName: string, filter: FilterType): boolean {
  if (filter === "all") return true;
  const lower = roomTypeName.toLowerCase();
  if (filter === "standard") return lower.includes("standard");
  if (filter === "deluxe") return lower.includes("deluxe");
  if (filter === "suite") return lower.includes("suite");
  if (filter === "twin") return lower.includes("twin");
  if (filter === "family") return lower.includes("family");
  return true;
}

const rp = (t: ReturnType<typeof useTranslations>) =>
  (
    t as {
      roomsPage?: {
        location: string;
        allLocations: string;
        checkIn: string;
        checkOut: string;
        guests: string;
        roomType: string;
        minHotelStars?: string;
        anyStars?: string;
        bathroom?: string;
        noRoomsMatch: string;
      };
    }
  ).roomsPage;

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const r = rp(t);

  const [filter, setFilter] = useState<FilterType>("all");
  const [minStars, setMinStars] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<number>(1);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && ALLOWED_TYPES.includes(typeParam as FilterType)) {
      setFilter(typeParam as FilterType);
    } else {
      setFilter("all");
    }
    const starsParam = searchParams.get("stars");
    if (starsParam) {
      const n = parseInt(starsParam, 10);
      setMinStars(!Number.isNaN(n) && n >= 1 && n <= 5 ? n : 0);
    } else {
      setMinStars(0);
    }
  }, [searchParams]);

  const hotels = useMemo(() => getHotelsWithLocation(), []);
  const allRoomsWithHotel = useMemo(() => {
    const list: {
      room: ReturnType<typeof getRoomsByHotelId>[0];
      hotel: (typeof hotels)[0];
    }[] = [];
    hotels.forEach((hotel) => {
      getRoomsByHotelId(hotel.id).forEach((room) => {
        list.push({ room, hotel });
      });
    });
    return list;
  }, [hotels]);

  const filtered = useMemo(() => {
    return allRoomsWithHotel.filter(({ room, hotel }) => {
      if (!roomMatchesFilter(room.typeName, filter)) return false;
      if (minStars > 0 && hotel.starRating < minStars) return false;
      if (guests > 0 && room.maxGuests < guests) return false;
      if (checkIn && checkOut) {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        if (outDate <= inDate) return false;
      }
      if (checkIn || checkOut) {
        if (room.status !== "available") return false;
      }
      return true;
    });
  }, [
    allRoomsWithHotel,
    filter,
    minStars,
    guests,
    checkIn,
    checkOut,
  ]);

  const displayRooms = filtered.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {t.home?.exploreRooms ?? "Explore All Our Rooms"}
          </h1>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-gray-700">
              {r?.roomType ?? (locale === "mn" ? "Шүүлтүүр" : "Filters")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  {r?.minHotelStars ??
                    (locale === "mn"
                      ? "Зочид буудлын од (хамгийн багадаа)"
                      : "Hotel star rating (min.)")}
                </label>
                <select
                  value={minStars === 0 ? "" : String(minStars)}
                  onChange={(e) =>
                    setMinStars(e.target.value ? Number(e.target.value) : 0)
                  }
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">
                    {r?.anyStars ?? (locale === "mn" ? "Аль ч" : "Any")}
                  </option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  {r?.checkIn ?? "Check-in"}
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  {r?.checkOut ?? "Check-out"}
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">
                  {r?.guests ?? "Guests"}
                </label>
                <Input
                  type="number"
                  min={1}
                  value={guests || ""}
                  onChange={(e) =>
                    setGuests(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
                    "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                    filter === f.value
                      ? "bg-brand text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:border-brand-soft hover:bg-brand-muted/50",
                  )}
                >
                  {locale === "mn" ? f.labelMn : f.labelEn}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayRooms.map(({ room, hotel }) => (
              <article
                key={room.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Link
                  href={`/hotels/${hotel.slug}/rooms/${room.id}`}
                  className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={
                        room.imageUrls?.[0] ??
                        hotel.imageUrls?.[0] ??
                        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"
                      }
                      alt={room.typeName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <span className="absolute left-3 top-3 rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white">
                      {room.typeName}
                    </span>
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand"
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
                    <h2 className="mt-2 font-semibold text-gray-900">
                      {room.typeName}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">{hotel.name}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" aria-hidden />1{" "}
                        {t.common?.rooms ?? "Room"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" aria-hidden />1{" "}
                        {r?.bathroom ??
                          (locale === "mn" ? "Угаалгын өрөө" : "Bathroom")}
                      </span>
                      {room.sizeSqm && (
                        <span className="flex items-center gap-1">
                          <Square className="h-4 w-4" aria-hidden />
                          {room.sizeSqm} m²
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-4 w-4" aria-hidden />
                        {hotel.address}
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
          {filtered.length > 8 && (
            <div className="mt-12 text-center">
              <Link href="/rooms">
                <Button
                  size="lg"
                  className="gap-2 transition-transform active:scale-[0.98]"
                >
                  {t.home?.viewMore ?? "View More"}{" "}
                  <span className="text-lg">›</span>
                </Button>
              </Link>
            </div>
          )}
          {displayRooms.length === 0 && (
            <p className="py-12 text-center text-gray-500">
              {r?.noRoomsMatch ??
                (locale === "mn"
                  ? "Таны шүүлтүүрт тохирох өрөө олдсонгүй."
                  : "No rooms match your filters.")}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function RoomsPage() {
  const { locale } = useLocale();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pb-16 pt-32">
            <div className="mx-auto max-w-7xl px-4">
              <p className="text-center text-gray-500">
                {locale === "mn" ? "Ачаалж байна..." : "Loading..."}
              </p>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <RoomsPageContent />
    </Suspense>
  );
}
