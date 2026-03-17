import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { locations } from '@/data/mockData';

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/search?location=${loc.id}`}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-semibold text-gray-900">{loc.name}</h2>
              <p className="text-sm text-gray-500">{loc.country}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
