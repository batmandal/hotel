"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";

export default function ForbiddenPage() {
  const { locale } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 pt-32 pb-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">403</h1>
        <p className="mt-3 text-gray-600">
          {locale === "mn"
            ? "Танд энэ хуудсанд хандах эрх байхгүй байна."
            : "You do not have permission to access this page."}
        </p>
        <Link href="/" className="mt-6">
          <Button>
            {locale === "mn" ? "Нүүр хуудас руу буцах" : "Back to home"}
          </Button>
        </Link>
      </main>
    </div>
  );
}
