"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarDays, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";

export function SearchBar() {
  const router = useRouter();
  const { locale } = useLocale();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomCount, setRoomCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const guests = adults + children;
    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    params.set("rooms", String(roomCount));
    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <div className="relative z-10 mx-auto -mt-32 max-w-5xl px-4 mb-24">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-4 shadow-xl sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Check-in */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {locale === "mn" ? "Ирэх өдөр" : "Check-in"}
            </label>
            <Input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          {/* Check-out */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {locale === "mn" ? "Гарах өдөр" : "Check-out"}
            </label>
            <Input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          {/* Guests breakdown */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Users className="h-3.5 w-3.5" />
              {locale === "mn" ? "Зочид" : "Guests"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] font-medium text-gray-400 mb-0.5">
                  {locale === "mn" ? "Өрөө" : "Rooms"}
                </span>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={roomCount}
                  onChange={(e) => setRoomCount(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div>
                <span className="block text-[10px] font-medium text-gray-400 mb-0.5">
                  {locale === "mn" ? "Том хүн" : "Adults"}
                </span>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div>
                <span className="block text-[10px] font-medium text-gray-400 mb-0.5">
                  {locale === "mn" ? "Хүүхэд" : "Children"}
                </span>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>
          {/* Search button */}
          <div className="flex items-end">
            <Button type="submit" size="lg" className="h-10 w-full gap-2">
              <Search className="h-5 w-5" aria-hidden />
              {locale === "mn" ? "Хайх" : "Search"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
