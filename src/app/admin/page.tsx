'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookings, getHotelById } from '@/data/mockData';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

export default function AdminPortalPage() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const handleExportPdf = () => {
    setExporting('pdf');
    setTimeout(() => setExporting(null), 1500);
  };
  const handleExportExcel = () => {
    setExporting('excel');
    setTimeout(() => setExporting(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">
        <h1 className="text-2xl font-bold text-gray-900">{t.admin.title}</h1>
        <div className="mt-6 flex gap-4">
          <Button variant="secondary" onClick={handleExportPdf} disabled={!!exporting} className="gap-2">
            <FileText className="h-4 w-4" aria-hidden />
            {t.admin.exportPdf}
          </Button>
          <Button variant="secondary" onClick={handleExportExcel} disabled={!!exporting} className="gap-2">
            <Table className="h-4 w-4" aria-hidden />
            {t.admin.exportExcel}
          </Button>
        </div>
        {exporting && (
          <p className="mt-2 text-sm text-teal-600">Exporting {exporting.toUpperCase()}... (mock)</p>
        )}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.admin.bookings}</h2>
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">Booking #</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Hotel</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Check-in</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Check-out</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const hotel = getHotelById(b.hotelId);
                  return (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="px-4 py-3">{b.bookingNumber}</td>
                      <td className="px-4 py-3">{hotel?.name ?? '-'}</td>
                      <td className="px-4 py-3">{b.checkIn}</td>
                      <td className="px-4 py-3">{b.checkOut}</td>
                      <td className="px-4 py-3">{b.status}</td>
                      <td className="px-4 py-3">${b.totalAmount} {b.currency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.admin.revenue}</h2>
          <p className="text-gray-600">
            Total revenue (mock): $
            {bookings
              .filter((b) => b.status !== 'cancelled')
              .reduce((sum, b) => sum + b.totalAmount, 0)
              .toFixed(2)}{' '}
            USD
          </p>
        </section>
      </main>
    </div>
  );
}
