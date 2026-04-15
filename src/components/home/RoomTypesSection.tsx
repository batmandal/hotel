"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { getHotelById, rooms } from "@/data/mockData";
import { LayoutGrid, Bed, Sparkles, Sofa, BedDouble, Star, type LucideIcon } from "lucide-react";

type PickCode = "all" | "standard" | "deluxe" | "suite" | "twin" | "stars5";

const ROOM_PICKS: Array<{
  code: PickCode;
  labelEn: string;
  labelMn: string;
  icon: LucideIcon;
  descEn: string;
  descMn: string;
}> = [
  {
    code: "all",
    labelEn: "All rooms",
    labelMn: "Бүх өрөө",
    icon: LayoutGrid,
    descEn: "Browse all available room types.",
    descMn: "Бүх боломжит өрөөнүүдийг харах.",
  },
  {
    code: "standard",
    labelEn: "Standard",
    labelMn: "Стандарт",
    icon: Bed,
    descEn:
      "Comfortable room with essential amenities. Ideal for solo or couple stays.",
    descMn:
      "Шаардлагатай бүх тоноглолтой тав тухтай өрөө. Ганц болон хос зочдод тохиромжтой.",
  },
  {
    code: "deluxe",
    labelEn: "Deluxe",
    labelMn: "Делюкс",
    icon: Sparkles,
    descEn: "Spacious room with premium furnishings and city views.",
    descMn: "Том зайтай, дээд зэргийн тавилгатай, хотын харагдацтай өрөө.",
  },
  {
    code: "suite",
    labelEn: "Suite",
    labelMn: "Сүүт",
    icon: Sofa,
    descEn:
      "Separate living area with luxury amenities. Perfect for extended stays.",
    descMn:
      "Тусгай зочдын хэсэгтэй люкс өрөө. Урт хугацаанд буудаллахад тохиромжтой.",
  },
  {
    code: "twin",
    labelEn: "Twin",
    labelMn: "Твин",
    icon: BedDouble,
    descEn: "Two separate beds in one room. Great for friends or colleagues.",
    descMn: "Хоёр тусдаа ортой өрөө. Найз нөхөд, хамт олонд тохиромжтой.",
  },
  {
    code: "stars5",
    labelEn: "5-star property",
    labelMn: "5 одтой буудал",
    icon: Star,
    descEn: "Top-tier service and facilities at our 5-star hotel.",
    descMn: "Хамгийн өндөр зэрэглэлийн үйлчилгээ, тоноглол.",
  },
];

function roomMatchesPick(
  roomTypeName: string,
  hotelStarRating: number,
  code: PickCode,
): boolean {
  if (code === "all") return true;
  if (code === "stars5") return hotelStarRating >= 5;
  const lower = roomTypeName.toLowerCase();
  if (code === "standard") return lower.includes("standard");
  if (code === "deluxe") return lower.includes("deluxe");
  if (code === "suite") return lower.includes("suite");
  if (code === "twin") return lower.includes("twin");
  return true;
}

function hrefForPick(code: PickCode): string {
  if (code === "all") return "/rooms";
  if (code === "stars5") return "/rooms?stars=5";
  return `/rooms?type=${code}`;
}

export function RoomTypesSection() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const th = t.home as typeof t.home & {
    roomPicksBadge?: string;
    roomPicksTitle?: string;
    roomPicksSubtitle?: string;
  };
  const [selected, setSelected] = useState<PickCode>("all");

  const counts = useMemo(() => {
    const map: Record<PickCode, number> = {
      all: 0,
      standard: 0,
      deluxe: 0,
      suite: 0,
      twin: 0,
      stars5: 0,
    };
    for (const room of rooms) {
      const hotel = getHotelById(room.hotelId);
      const stars = hotel?.starRating ?? 0;
      map.all += 1;
      for (const pick of ROOM_PICKS) {
        if (pick.code === "all") continue;
        if (roomMatchesPick(room.typeName, stars, pick.code)) {
          map[pick.code] += 1;
        }
      }
    }
    return map;
  }, []);

  return (
    <section className="mx-auto max-w-7xl bg-white px-4 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground shadow-sm">
          {th?.roomPicksBadge ?? t.home?.categories ?? "Room types"}
        </span>
        <h2 className="mt-4 font-display italic text-3xl font-bold text-gray-900">
          {th?.roomPicksTitle ?? t.home?.luxuryChoices ?? "Room choices"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
          {th?.roomPicksSubtitle ?? ""}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {ROOM_PICKS.map((pick) => (
          <Link
            key={pick.code}
            href={hrefForPick(pick.code)}
            onClick={() => setSelected(pick.code)}
            className={cn(
              "group relative flex flex-col items-center rounded-xl border p-6 transition-all duration-200",
              "hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              selected === pick.code
                ? "border-brand bg-brand-muted shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
            )}
          >
            <pick.icon className="h-8 w-8 text-brand" aria-hidden />
            <span className="mt-3 text-center font-medium text-gray-900">
              {locale === "mn" ? pick.labelMn : pick.labelEn}
            </span>
            {/* Hover tooltip */}
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-3 text-xs leading-relaxed text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {locale === "mn" ? pick.descMn : pick.descEn}
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
