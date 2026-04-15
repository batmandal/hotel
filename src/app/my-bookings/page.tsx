'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { bookings, users, hotels, rooms as allRooms } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowLeft, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import type { BookingStatus } from '@/types';
import { formatPriceFromUsd } from '@/lib/pricing';

type StatusFilter = 'all' | 'upcoming' | 'active' | 'past' | 'cancelled';

const statusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed': return 'success' as const;
    case 'checked_in': return 'info' as const;
    case 'checked_out': return 'neutral' as const;
    case 'cancelled': return 'danger' as const;
    case 'no_show': return 'danger' as const;
    case 'pending': return 'warning' as const;
    default: return 'neutral' as const;
  }
};

export default function MyBookingsPage() {
  const { userEmail } = useAuth();
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const currentUser = useMemo(() => users.find(u => u.email === userEmail), [userEmail]);

  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings
      .filter(b => b.userId === currentUser.id)
      .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  }, [currentUser]);

  const filteredBookings = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return myBookings.filter(b => {
      switch (filter) {
        case 'upcoming': return b.status === 'confirmed' && b.checkIn > today;
        case 'active': return b.status === 'checked_in';
        case 'past': return b.status === 'checked_out';
        case 'cancelled': return b.status === 'cancelled' || b.status === 'no_show';
        default: return true;
      }
    });
  }, [myBookings, filter]);

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: locale === 'mn' ? 'Бүгд' : 'All' },
    { key: 'upcoming', label: locale === 'mn' ? 'Удахгүй' : 'Upcoming' },
    { key: 'active', label: locale === 'mn' ? 'Идэвхтэй' : 'Active' },
    { key: 'past', label: locale === 'mn' ? 'Өнгөрсөн' : 'Past' },
    { key: 'cancelled', label: locale === 'mn' ? 'Цуцлагдсан' : 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 hover:text-brand transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'mn' ? 'Миний захиалгууд' : 'My Bookings'}
          </h1>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                filter === f.key
                  ? 'bg-brand text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              {locale === 'mn' ? 'Захиалга олдсонгүй' : 'No bookings found'}
            </p>
            <Link href="/rooms">
              <Button className="mt-4 bg-brand hover:bg-brand-hover">
                {locale === 'mn' ? 'Өрөө хайх' : 'Browse Rooms'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(b => {
              const hotel = hotels.find(h => h.id === b.hotelId);
              const roomNumbers = b.roomIds
                .map(rid => allRooms.find(r => r.id === rid)?.number || rid)
                .join(', ');

              return (
                <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{hotel?.name || 'UbHotel'}</h3>
                        <Badge variant={statusBadgeVariant(b.status)}>
                          {b.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-700">{locale === 'mn' ? 'Өрөө:' : 'Room:'}</span>{' '}
                          {roomNumbers}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">{locale === 'mn' ? 'Огноо:' : 'Dates:'}</span>{' '}
                          {b.checkIn} → {b.checkOut} ({b.nights} {locale === 'mn' ? 'шөнө' : 'nights'})
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">{locale === 'mn' ? 'Зочид:' : 'Guests:'}</span>{' '}
                          {b.guests} {locale === 'mn' ? 'хүн' : 'guests'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {locale === 'mn' ? 'Захиалгын дугаар:' : 'Booking #:'} {b.bookingNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-brand break-words max-w-[min(100%,14rem)] sm:max-w-xs">{formatPriceFromUsd(b.totalAmount, locale)}</p>
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {locale === 'mn' ? 'Цуцлах' : 'Cancel'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
