import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">More</h1>
        <ul className="mt-6 space-y-2">
          <li><Link href="/staff" className="text-teal-600 hover:underline">Staff Portal</Link></li>
          <li><Link href="/admin" className="text-teal-600 hover:underline">Admin Portal</Link></li>
        </ul>
      </main>
    </div>
  );
}
