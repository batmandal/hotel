'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getHotelById, getRoomsByHotelId, discounts, extraServices } from '@/data/mockData';
import { calculateBookingTotal, getRefundPercentage, type PriceBreakdown } from '@/lib/booking';
import { Header } from '@/components/layout/Header';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';

const MOCK_OTP = '123456';

export default function BookPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = typeof params?.hotelId === 'string' ? params.hotelId : '';
  const preselectedRoomId = searchParams.get('room') ?? '';
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const [step, setStep] = useState<'details' | 'otp' | 'done'>('details');
  const [checkIn, setCheckIn] = useState('2025-04-01');
  const [checkOut, setCheckOut] = useState('2025-04-03');
  const [guests, setGuests] = useState(2);
  const [roomId, setRoomId] = useState(preselectedRoomId);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<typeof discounts[0] | null>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const hotel = useMemo(() => getHotelById(hotelId), [hotelId]);
  const rooms = useMemo(() => (hotel ? getRoomsByHotelId(hotel.id) : []), [hotel]);
  const selectedRoom = roomId ? rooms.find((r) => r.id === roomId) : rooms[0];
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const breakdown: PriceBreakdown | null = useMemo(() => {
    if (!selectedRoom || nights < 1) return null;
    const discount = appliedDiscount ?? discounts.find((d) => d.code === discountCode) ?? null;
    return calculateBookingTotal({
      basePricePerNight: selectedRoom.basePricePerNight,
      nights,
      roomCount: 1,
      guests,
      maxGuestsPerRoom: selectedRoom.maxGuests,
      services: [],
      discount: discount ?? undefined,
    });
  }, [selectedRoom, nights, guests, discountCode, appliedDiscount]);

  const handleApplyCode = () => {
    const d = discounts.find((x) => x.code.toUpperCase() === discountCode.toUpperCase());
    if (d) setAppliedDiscount(d);
    else setAppliedDiscount(null);
  };

  const handleContinueToOtp = () => {
    if (breakdown) setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp.trim() === MOCK_OTP) {
      setOtpError('');
      setStep('done');
    } else {
      setOtpError('Invalid code. Use 123456 for demo.');
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-gray-500">Hotel not found.</p>
        <Link href="/" className="mt-4 inline-block text-teal-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  if (step === 'done') {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-lg pt-28 pb-16">
          <h1 className="text-2xl font-bold text-gray-900">Booking confirmed!</h1>
          <p className="mt-2 text-gray-600">Your reservation at {hotel.name} has been confirmed.</p>
          <p className="mt-4 text-sm text-gray-500">Confirmation number: BK{Date.now().toString().slice(-6)}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg px-4 pt-28 pb-16">
          <h1 className="text-xl font-bold text-gray-900">{t.booking.otpTitle}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.booking.otpSent}</p>
          <Input
            type="text"
            placeholder={t.booking.otpPlaceholder}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-4"
            maxLength={6}
          />
          {otpError && <p className="mt-2 text-sm text-red-600">{otpError}</p>}
          <Button onClick={handleVerifyOtp} className="mt-4 w-full">{t.booking.verify}</Button>
          <p className="mt-4 text-center text-xs text-gray-400">Demo: enter 123456</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book {hotel.name}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.booking.checkIn}</label>
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.booking.checkOut}</label>
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Guests</label>
              <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room</label>
              <select
                value={roomId || (rooms[0]?.id ?? '')}
                onChange={(e) => setRoomId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.typeName} - ${r.basePricePerNight}/night</option>
                ))}
              </select>
            </div>
            {selectedRoom && (selectedRoom.description ?? selectedRoom.descriptionMn) && (
              <div className="rounded-lg border border-teal-100 bg-teal-50/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
                  {locale === 'mn' ? 'Өрөөний тайлбар' : 'Room description'}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {locale === 'mn' && selectedRoom.descriptionMn ? selectedRoom.descriptionMn : selectedRoom.description}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.booking.applyCode}</label>
              <div className="mt-1 flex gap-2">
                <Input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="e.g. WELCOME10" />
                <Button variant="secondary" onClick={handleApplyCode}>Apply</Button>
              </div>
              {appliedDiscount && <p className="mt-1 text-sm text-teal-600">Applied: {appliedDiscount.code}</p>}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold text-gray-900">{t.booking.total}</h2>
            {breakdown && (
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">Base ({nights} nights)</li>
                <li className="flex justify-between">${breakdown.totalBase.toFixed(2)}</li>
                {breakdown.discountAmount > 0 && (
                  <li className="flex justify-between text-teal-600">Discount -${breakdown.discountAmount.toFixed(2)}</li>
                )}
                <li className="flex justify-between">Tax ${breakdown.taxAmount.toFixed(2)}</li>
                <li className="flex justify-between">Service ${breakdown.serviceChargeAmount.toFixed(2)}</li>
                <li className="mt-4 flex justify-between border-t pt-4 text-lg font-bold text-gray-900">
                  Total ${breakdown.totalAmount.toFixed(2)} {hotel.currency}
                </li>
              </ul>
            )}
            <Button onClick={handleContinueToOtp} className="mt-6 w-full" size="lg">{t.booking.continue}</Button>
            {breakdown && (
              <p className="mt-4 text-xs text-gray-500">
                Refund policy: {getRefundPercentage(30)}% refund 30+ days before check-in, {getRefundPercentage(14)}% at 14+ days, {getRefundPercentage(7)}% at 7+ days, {getRefundPercentage(3)}% at 3+ days.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
