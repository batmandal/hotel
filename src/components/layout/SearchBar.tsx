"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { useTranslations } from "@/lib/i18n";
import { locations } from "@/data/mockData";
import { useLocale } from "@/context/LocaleContext";

const categoryOptions: SelectOption[] = [
  { value: "", label: "All" },
  { value: "resort", label: "Resort" },
  { value: "hotel", label: "Hotel" },
  { value: "villa", label: "Villa" },
  { value: "apartment", label: "Apartment" },
  { value: "hostel", label: "Hostel" },
  { value: "lodge", label: "Lodge" },
  { value: "boutique", label: "Boutique" },
];

const ratingOptions: SelectOption[] = [
  { value: "", label: "Any" },
  { value: "3", label: "3 Star" },
  { value: "4", label: "4 Star" },
  { value: "5", label: "5 Star" },
];

export function SearchBar() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [query, setQuery] = useState("");
  const [locationId, setLocationId] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  const locationOptions: SelectOption[] = [
    { value: "", label: t.search.location },
    ...locations.map((l) => ({ value: l.id, label: l.name })),
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query?.trim()) params.set("q", query.trim());
    if (locationId) params.set("location", locationId);
    if (category) params.set("category", category);
    if (rating) params.set("rating", rating);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="relative z-10 mx-auto -mt-32 max-w-6xl px-4 mb-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4 rounded-2xl bg-white p-4 shadow-xl sm:flex-nowrap sm:gap-3 sm:p-3"
      >
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="search-query"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            Find Hotel
          </label>
          <Input
            id="search-query"
            type="text"
            placeholder={t.search.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-40">
          <label
            htmlFor="search-location"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t.search.location}
          </label>
          <Select
            id="search-location"
            options={locationOptions}
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label
            htmlFor="search-category"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t.search.category}
          </label>
          <Select
            id="search-category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-32">
          <label
            htmlFor="search-rating"
            className="mb-1 block text-xs font-medium text-gray-500"
          >
            {t.search.rating}
          </label>
          <Select
            id="search-rating"
            options={ratingOptions}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="gap-2 shrink-0">
          <Search className="h-5 w-5" aria-hidden />
          {t.search.searchNow}
        </Button>
      </form>
    </div>
  );
}
