"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

const ROOM_TYPES = [
  { code: "villa", labelEn: "Villa", labelMn: "Вилла", icon: "🏠", count: 4 },
  {
    code: "hotel",
    labelEn: "Hotel",
    labelMn: "Зочид буудлын",
    icon: "🏨",
    count: 10,
  },
  {
    code: "resort",
    labelEn: "Resort",
    labelMn: "Зуслан",
    icon: "🌴",
    count: 6,
  },
  { code: "suite", labelEn: "Suite", labelMn: "Сүүт", icon: "🛏️", count: 8 },
  {
    code: "deluxe",
    labelEn: "Deluxe",
    labelMn: "Делюкс",
    icon: "✨",
    count: 12,
  },
  {
    code: "family",
    labelEn: "Family",
    labelMn: "Гэр бүл",
    icon: "👨‍👩‍👧",
    count: 5,
  },
];

export function RoomTypesSection() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [selected, setSelected] = useState("hotel");

  return (
    <section className="bg-white mx-auto max-w-7xl px-4 py-16 ">
      <div className="text-center">
        <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
          {t.home?.categories ?? "Categories"}
        </span>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          {t.home?.luxuryChoices ?? "Luxury & Comfort Choices"}
        </h2>
      </div>
      <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {ROOM_TYPES.map((type) => (
          <Link
            key={type.code}
            href={`/rooms?type=${type.code}`}
            onClick={() => setSelected(type.code)}
            className={cn(
              "flex flex-col items-center rounded-xl border-2 p-6 transition-all duration-200",
              "hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
              selected === type.code
                ? "border-teal-500 bg-teal-50 shadow-sm"
                : "border-teal-200 bg-white hover:border-teal-300",
            )}
          >
            <span className="text-3xl" aria-hidden>
              {type.icon}
            </span>
            <span className="mt-3 font-medium text-gray-900">
              {locale === "mn" ? type.labelMn : type.labelEn}
            </span>
            <span className="mt-1 text-sm text-gray-500">
              {type.count} {t.home?.items ?? "Items"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
