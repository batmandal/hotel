'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateBookingTotal, getRefundPercentage, type PriceBreakdown } from '@/lib/booking';
import { Header } from '@/components/layout/Header';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceFromUsd, usdToMnt, formatMntAmount } from '@/lib/pricing';
import { Loader2 } from 'lucide-react';

const MOCK_OTP = '123456';

const PAYMENT_OPTIONS = [
  { id: 'qpay', labelMn: 'QPay (QR)', labelEn: 'QPay (QR)', accent: 'bg-violet-600' },
  { id: 'khan', labelMn: 'Хаан банк', labelEn: 'Khan Bank', accent: 'bg-blue-700' },
  { id: 'tdb', labelMn: 'Худалдаа хөгжлийн банк', labelEn: 'TDB / Trade & Development Bank', accent: 'bg-emerald-700' },
  { id: 'golomt', labelMn: 'Голомт банк', labelEn: 'Golomt Bank', accent: 'bg-rose-600' },
  { id: 'socialpay', labelMn: 'SocialPay', labelEn: 'SocialPay', accent: 'bg-sky-600' },
  { id: 'monpay', labelMn: 'MonPay', labelEn: 'MonPay', accent: 'bg-orange-600' },
] as const;

export default function BookPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = typeof params?.hotelId === 'string' ? params.hotelId : '';
  const preselectedRoomId = searchParams.get('room') ?? '';
  const { locale } = useLocale();
  const t = useTranslations(locale);

  const { userEmail } = useAuth();

  const [step, setStep] = useState<'details' | 'payment' | 'otp' | 'done'>('details');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('2025-04-01');
  const [checkOut, setCheckOut] = useState('2025-04-03');
  const [guests, setGuests] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [roomId, setRoomId] = useState(preselectedRoomId);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [confirmedBookingNumber, setConfirmedBookingNumber] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch hotel + rooms from API
  const [hotel, setHotel] = useState<any>(null);
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) return;
    Promise.all([
      fetch(`/api/hotels/${hotelId}`).then(r => r.json()),
      fetch(`/api/rooms?hotelId=${hotelId}`).then(r => r.json()),
    ]).then(([hotelJson, roomsJson]) => {
      setHotel(hotelJson.data ?? null);
      setAllRooms(roomsJson.data ?? []);
    }).finally(() => setLoading(false));
  }, [hotelId]);

  const availableRooms = useMemo(() => {
    if (!allRooms.length) return [];
    const minGuestsPerRoom = Math.ceil(guests / Math.max(1, roomCount));
    return allRooms.filter(
      (r) => r.status === 'available' && r.maxGuests >= minGuestsPerRoom
    );
  }, [allRooms, guests, roomCount]);

  useEffect(() => {
    const currentInList = availableRooms.some((r) => r.id === roomId);
    if (!currentInList && availableRooms.length > 0) {
      setRoomId(availableRooms[0].id);
    } else if (availableRooms.length === 0 && roomId) {
      setRoomId('');
    }
  }, [availableRooms, roomId]);

  const selectedRoom = roomId ? availableRooms.find((r) => r.id === roomId) ?? availableRooms[0] : availableRooms[0];
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
      roomCount,
      guests,
      maxGuestsPerRoom: selectedRoom.maxGuests,
      services: [],
      discount: discount ?? undefined,
    });
  }, [selectedRoom, nights, roomCount, guests, discountCode, appliedDiscount]);

  const handleApplyCode = () => {
    // Simple client-side check for known codes
    const knownCodes: Record<string, any> = {
      'WELCOME10': { code: 'WELCOME10', type: 'percentage', value: 10, minNights: 2 },
      'LONGSTAY': { code: 'LONGSTAY', type: 'percentage', value: 15, minNights: 5 },
      'FLAT50': { code: 'FLAT50', type: 'fixed', value: 50 },
    };
    const d = knownCodes[discountCode.toUpperCase()];
    if (d) setAppliedDiscount(d);
    else setAppliedDiscount(null);
  };

  const handleContinueToPayment = () => {
    if (breakdown) {
      setPaymentMethod(null);
      setStep('payment');
    }
  };

  const paymentQrPayload = useMemo(() => {
    if (!breakdown || !hotel) return 'UbHotel|QPay|DEMO';
    const mnt = usdToMnt(breakdown.totalAmount);
    return `UbHotel|QPay|DEMO|${hotel.id}|MNT${mnt}|T${Math.floor(breakdown.totalAmount * 100)}`;
  }, [breakdown, hotel]);

  const paymentQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(paymentQrPayload)}`;

  const handleContinueToOtp = () => {
    if (paymentMethod) setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp.trim() !== MOCK_OTP) {
      setOtpError(locale === 'mn' ? 'Код буруу байна. Демо код: 123456' : 'Invalid code. Use 123456 for demo.');
      return;
    }
    setOtpError('');
    setBookingLoading(true);

    try {
      // Find current user ID by email
      const userRes = await fetch(`/api/users?q=${encodeURIComponent(userEmail || '')}`);
      const userJson = await userRes.json();
      const currentUser = userJson.data?.[0];
      if (!currentUser) {
        setOtpError(locale === 'mn' ? 'Хэрэглэгч олдсонгүй. Нэвтэрнэ үү.' : 'User not found. Please log in.');
        setBookingLoading(false);
        return;
      }

      // Create booking in DB
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          hotelId: hotel.id,
          roomIds: selectedRoom ? [selectedRoom.id] : [],
          checkIn,
          checkOut,
          guests,
          basePricePerNight: selectedRoom?.basePricePerNight ?? 0,
          totalBase: breakdown?.totalBase ?? 0,
          extraPersonFee: breakdown?.extraPersonFee ?? 0,
          servicesTotal: breakdown?.servicesTotal ?? 0,
          discountAmount: breakdown?.discountAmount ?? 0,
          taxAmount: breakdown?.taxAmount ?? 0,
          serviceChargeAmount: breakdown?.serviceChargeAmount ?? 0,
          totalAmount: breakdown?.totalAmount ?? 0,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setConfirmedBookingNumber(json.data?.bookingNumber ?? '');
        setStep('done');
      } else {
        setOtpError(json.error || (locale === 'mn' ? 'Захиалга үүсгэхэд алдаа гарлаа' : 'Failed to create booking'));
      }
    } catch {
      setOtpError(locale === 'mn' ? 'Сервертэй холбогдож чадсангүй' : 'Could not connect to server');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-40"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 text-center">
          <p className="text-gray-500">{locale === 'mn' ? 'Буудал олдсонгүй.' : 'Hotel not found.'}</p>
          <Link href="/" className="mt-4 inline-block text-brand hover:underline">{locale === 'mn' ? 'Нүүр хуудас' : 'Back to home'}</Link>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-md px-4 pt-32 pb-16">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900">{locale === 'mn' ? 'Захиалга баталгаажлаа!' : 'Booking confirmed!'}</h1>
            <p className="mt-2 text-gray-600">{locale === 'mn' ? `${hotel.name} дахь захиалга амжилттай.` : `Your reservation at ${hotel.name} has been confirmed.`}</p>
            <p className="mt-4 text-sm text-gray-500">{locale === 'mn' ? 'Захиалгын дугаар' : 'Confirmation number'}: {confirmedBookingNumber}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link href="/my-bookings">
                <Button>{locale === 'mn' ? 'Миний захиалгууд' : 'My Bookings'}</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">{locale === 'mn' ? 'Нүүр хуудас' : 'Home'}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment' && breakdown && hotel) {
    const mntLabel = formatMntAmount(usdToMnt(breakdown.totalAmount));
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-lg px-4 pt-32 pb-16">
          <button
            type="button"
            onClick={() => setStep('details')}
            className="mb-4 text-sm font-medium text-brand hover:underline"
          >
            {locale === 'mn' ? '← Буцах (захиалгын мэдээлэл)' : '← Back to booking details'}
          </button>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              {locale === 'mn' ? 'Төлбөр төлөх' : 'Payment'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {locale === 'mn'
                ? 'QPay-ээр бол банкны апп-аар уншуулна уу. Эсвэл доорх банк, апп сонгоно уу (демо).'
                : 'Scan the QR with your bank app for QPay-style demo, or pick a bank / wallet below (demo).'}
            </p>
            <p className="mt-4 text-lg font-semibold text-brand">
              {locale === 'mn' ? 'Төлөх дүн: ' : 'Amount due: '}
              {formatPriceFromUsd(breakdown.totalAmount, locale)}
              {locale === 'en' && (
                <span className="ml-2 text-sm font-normal text-gray-500">({mntLabel})</span>
              )}
            </p>

            <div className="mt-6 rounded-xl border-2 border-violet-200 bg-violet-50/80 p-5 text-center">
              <p className="text-sm font-bold text-violet-900">QPay · QR</p>
              <p className="mt-1 text-xs text-violet-800/80 break-all px-2">{paymentQrPayload}</p>
              <div className="mt-4 flex justify-center rounded-lg bg-white p-3 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={paymentQrUrl} alt="" width={220} height={220} className="h-[220px] w-[220px]" />
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {locale === 'mn' ? 'Жинхэнэ QPay биш — зөвхөн демо QR.' : 'Not real QPay — demo QR only.'}
              </p>
            </div>

            <p className="mt-6 text-sm font-semibold text-gray-800">
              {locale === 'mn' ? 'Бусад апп / банк' : 'Other bank apps'}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold text-white transition shadow-sm ${
                    opt.accent
                  } ${paymentMethod === opt.id ? 'ring-4 ring-brand ring-offset-2' : 'opacity-90 hover:opacity-100'}`}
                >
                  {locale === 'mn' ? opt.labelMn : opt.labelEn}
                </button>
              ))}
            </div>

            <Button
              className="mt-8 w-full"
              size="lg"
              disabled={!paymentMethod}
              onClick={handleContinueToOtp}
            >
              {locale === 'mn' ? 'Дараах: OTP баталгаажуулалт' : 'Next: verify with OTP'}
            </Button>
            {!paymentMethod && (
              <p className="mt-2 text-center text-xs text-amber-700">
                {locale === 'mn' ? 'Төлбөрийн арга сонгоно уу.' : 'Please select a payment method.'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-md px-4 pt-32 pb-16">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <button
              type="button"
              onClick={() => setStep('payment')}
              className="mb-4 text-sm font-medium text-brand hover:underline"
            >
              {locale === 'mn' ? '← Төлбөр рүү буцах' : '← Back to payment'}
            </button>
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
            <Button onClick={handleVerifyOtp} disabled={bookingLoading} className="mt-4 w-full">
              {bookingLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{locale === 'mn' ? 'Захиалга үүсгэж байна...' : 'Creating booking...'}</> : t.booking.verify}
            </Button>
            <p className="mt-4 text-center text-xs text-gray-400">{locale === 'mn' ? 'Демо код: 123456' : 'Demo: enter 123456'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-4xl px-4 pt-32 pb-8">
        <h1 className="text-2xl font-bold text-gray-900">{locale === 'mn' ? `${hotel.name} захиалах` : `Book ${hotel.name}`}</h1>
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
              <label className="block text-sm font-medium text-gray-700">{t.booking.guests}</label>
              <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.booking.roomCount}</label>
              <Input type="number" min={1} value={roomCount} onChange={(e) => setRoomCount(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.booking.room}</label>
              <p className="mt-1 text-xs text-gray-500">{t.booking.availableRoomsFor}</p>
              <select
                value={roomId || (availableRooms[0]?.id ?? '')}
                onChange={(e) => setRoomId(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                {availableRooms.length === 0 ? (
                  <option value="">{locale === 'mn' ? 'Таньд тохирох боломжит өрөө олдсонгүй' : 'No rooms match your criteria'}</option>
                ) : (
                  availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>{r.typeName} – {locale === 'mn' ? 'хүн' : 'guests'}: {r.maxGuests} · {formatPriceFromUsd(r.basePricePerNight, locale)}/{locale === 'mn' ? 'шөнө' : 'night'}</option>
                  ))
                )}
              </select>
            </div>
            {selectedRoom && (selectedRoom.description ?? selectedRoom.descriptionMn) && (
              <div className="rounded-lg border border-brand-muted bg-brand-muted/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand">
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
                <Button variant="secondary" onClick={handleApplyCode}>{locale === 'mn' ? 'Хэрэглэх' : 'Apply'}</Button>
              </div>
              {appliedDiscount && <p className="mt-1 text-sm text-brand">Applied: {appliedDiscount.code}</p>}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold text-gray-900">{t.booking.total}</h2>
            {breakdown && (
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex justify-between gap-2 break-words">
                  <span>Base ({nights} {t.common.nights} × {roomCount} {locale === 'mn' ? 'өрөө' : 'rooms'})</span>
                  <span className="shrink-0 text-right">{formatPriceFromUsd(breakdown.totalBase, locale)}</span>
                </li>
                {breakdown.discountAmount > 0 && (
                  <li className="flex justify-between gap-2 break-words text-brand">
                    <span>{locale === 'mn' ? 'Хөнгөлөлт' : 'Discount'}</span>
                    <span className="shrink-0 text-right">−{formatPriceFromUsd(breakdown.discountAmount, locale)}</span>
                  </li>
                )}
                <li className="flex justify-between gap-2 break-words">
                  <span>{locale === 'mn' ? 'Татвар' : 'Tax'}</span>
                  <span className="shrink-0 text-right">{formatPriceFromUsd(breakdown.taxAmount, locale)}</span>
                </li>
                <li className="flex justify-between gap-2 break-words">
                  <span>{locale === 'mn' ? 'Үйлчилгээний төлбөр' : 'Service'}</span>
                  <span className="shrink-0 text-right">{formatPriceFromUsd(breakdown.serviceChargeAmount, locale)}</span>
                </li>
                <li className="mt-4 flex justify-between gap-2 border-t pt-4 text-lg font-bold text-gray-900 break-words">
                  <span>{locale === 'mn' ? 'Нийт' : 'Total'}</span>
                  <span className="shrink-0 text-right">{formatPriceFromUsd(breakdown.totalAmount, locale)}</span>
                </li>
              </ul>
            )}
            <Button onClick={handleContinueToPayment} className="mt-6 w-full" size="lg">
              {locale === 'mn' ? 'Төлбөр төлөх рүү' : 'Continue to payment'}
            </Button>
            {breakdown && (
              <p className="mt-4 text-xs text-gray-500">
                {locale === 'mn'
                  ? `Буцаалтын нөхцөл: 30+ хоног өмнө ${getRefundPercentage(30)}%, 14+ хоног ${getRefundPercentage(14)}%, 7+ хоног ${getRefundPercentage(7)}%, 3+ хоног ${getRefundPercentage(3)}%.`
                  : `Refund: ${getRefundPercentage(30)}% at 30+ days, ${getRefundPercentage(14)}% at 14+, ${getRefundPercentage(7)}% at 7+, ${getRefundPercentage(3)}% at 3+ days before check-in.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
