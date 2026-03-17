import { Header } from '@/components/layout/Header';

export default function MembershipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
        <p className="mt-4 text-gray-600">Join our loyalty program for exclusive rates and benefits. (Coming soon)</p>
      </main>
    </div>
  );
}
