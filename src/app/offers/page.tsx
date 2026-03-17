import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { discounts } from '@/data/mockData';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discounts.map((d) => (
            <div key={d.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-teal-600">{d.code}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {d.type === 'percentage' ? `${d.value}% off` : `$${d.value} off`}
                {d.minNights != null && ` · Min ${d.minNights} nights`}
              </p>
              <p className="mt-2 text-xs text-gray-500">Valid until {d.validTo}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
