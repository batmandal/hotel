'use client';

import React, { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { getRoomsByHotelId, hotels } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import type { RoomStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusColors: Record<RoomStatus, string> = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-amber-100 text-amber-800',
  maintenance: 'bg-red-100 text-red-800',
  reserved: 'bg-blue-100 text-blue-800',
  cleaning: 'bg-gray-100 text-gray-800',
};

export default function StaffPortalPage() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [selectedHotelId, setSelectedHotelId] = useState(hotels[0]?.id ?? '');

  const rooms = useMemo(
    () => (selectedHotelId ? getRoomsByHotelId(selectedHotelId) : []),
    [selectedHotelId]
  );

  const statusLabels: Record<RoomStatus, string> = {
    available: t.staff.available,
    occupied: t.staff.occupied,
    maintenance: t.staff.maintenance,
    reserved: t.staff.reserved,
    cleaning: t.staff.cleaning,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">{t.staff.title}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Hotel</label>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.staff.roomStatus}</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  'rounded-lg border p-4',
                  statusColors[room.status]
                )}
              >
                <div className="font-semibold">Room {room.number}</div>
                <div className="text-sm opacity-90">{room.typeName}</div>
                <div className="mt-2 text-xs font-medium uppercase">
                  {statusLabels[room.status]}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.staff.bookings}</h2>
          <p className="text-sm text-gray-500">View and manage today’s check-ins/check-outs from the grid above. Room status updates are reflected in real time (mock).</p>
        </section>
      </main>
    </div>
  );
}
