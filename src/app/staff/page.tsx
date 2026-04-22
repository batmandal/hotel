'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslations } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext';
import type { RoomStatus } from '@/types';
import { cn } from '@/lib/utils';
import { BedDouble, User, Wrench, Droplets, CheckCircle2, Maximize2, FileCheck2, ThermometerSun, UserPlus, CalendarPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaffLayout, type StaffTab } from '@/components/staff/StaffLayout';
import { formatPriceFromUsd } from '@/lib/pricing';
import { ReportPanel } from '@/components/reports/ReportPanel';

const statusColors: Record<RoomStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  available: { bg: 'bg-green-50/80', text: 'text-green-700', icon: CheckCircle2 },
  occupied: { bg: 'bg-amber-50/80', text: 'text-amber-700', icon: User },
  maintenance: { bg: 'bg-red-50/80', text: 'text-red-700', icon: Wrench },
  reserved: { bg: 'bg-blue-50/80', text: 'text-blue-700', icon: BedDouble },
  cleaning: { bg: 'bg-purple-50/80', text: 'text-purple-700', icon: Droplets },
};

type ApiRoom = { id: string; hotelId: string; typeCode: string; typeName: string; floor: number; number: string; status: RoomStatus; basePricePerNight: number; maxGuests: number; maxExtraBeds: number; beds: number | null; sizeSqm: number | null; amenities: string[]; };
type ApiBooking = { id: string; bookingNumber: string; userId: string; hotelId: string; checkIn: string; checkOut: string; status: string; roomIds: string[]; user: { id: string; name: string; email: string } };
type RegisteredGuest = { id: string; name: string; phone: string; email: string; createdAt: string };
type StaffBooking = { id: string; guestName: string; guestPhone: string; guestEmail: string; roomId: string; checkIn: string; checkOut: string; guests: number; createdAt: string };

export default function StaffPortalPage() {
  const { locale } = useLocale();
  const t = useTranslations(locale);
  const mn = locale === 'mn';

  const [activeTab, setActiveTab] = useState<StaffTab>('rooms');
  const [loading, setLoading] = useState(true);
  const [apiRooms, setApiRooms] = useState<ApiRoom[]>([]);
  const [apiBookings, setApiBookings] = useState<ApiBooking[]>([]);

  const [roomStatuses, setRoomStatuses] = useState<Record<string, RoomStatus>>({});
  const [roomCleanStates, setRoomCleanStates] = useState<Record<string, boolean>>({});
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // Guest registration state
  const [registeredGuests, setRegisteredGuests] = useState<RegisteredGuest[]>([]);
  const [guestLastName, setGuestLastName] = useState('');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [guestConfirmPassword, setGuestConfirmPassword] = useState('');
  const [guestError, setGuestError] = useState('');

  // Staff booking state
  const [staffBookings, setStaffBookings] = useState<StaffBooking[]>([]);
  const [bkLastName, setBkLastName] = useState('');
  const [bkFirstName, setBkFirstName] = useState('');
  const [bkPhone, setBkPhone] = useState('');
  const [bkEmail, setBkEmail] = useState('');
  const [bkRoomId, setBkRoomId] = useState('');
  const [bkCheckIn, setBkCheckIn] = useState('');
  const [bkCheckOut, setBkCheckOut] = useState('');
  const [bkGuests, setBkGuests] = useState(1);

  // ---- Fetch from API ----
  const fetchData = useCallback(async () => {
    const [roomsRes, bookingsRes] = await Promise.all([
      fetch('/api/rooms'),
      fetch('/api/bookings'),
    ]);
    const roomsJson = await roomsRes.json();
    const bookingsJson = await bookingsRes.json();
    setApiRooms(roomsJson.data ?? []);
    setApiBookings((bookingsJson.data ?? []).map((b: any) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      userId: b.userId,
      hotelId: b.hotelId,
      checkIn: typeof b.checkIn === 'string' ? b.checkIn.slice(0, 10) : b.checkIn,
      checkOut: typeof b.checkOut === 'string' ? b.checkOut.slice(0, 10) : b.checkOut,
      status: b.status,
      roomIds: b.roomIds ?? [],
      user: b.user ?? { id: b.userId, name: 'Тодорхойгүй', email: '-' },
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusLabels: Record<RoomStatus, string> = {
    available: t.staff.available,
    occupied: t.staff.occupied,
    maintenance: t.staff.maintenance,
    reserved: t.staff.reserved,
    cleaning: t.staff.cleaning,
  };

  const occupancyByRoom = useMemo(() => {
    const map: Record<string, { bookingNumber: string; guestName: string; guestEmail: string; checkIn: string; checkOut: string; bookingStatus: string }> = {};
    // checked_in → occupied
    apiBookings.forEach((b) => {
      if (b.status !== 'checked_in') return;
      b.roomIds.forEach((roomId) => {
        map[roomId] = { bookingNumber: b.bookingNumber, guestName: b.user.name, guestEmail: b.user.email, checkIn: b.checkIn, checkOut: b.checkOut, bookingStatus: b.status };
      });
    });
    // confirmed/pending → reserved
    apiBookings.forEach((b) => {
      if (b.status !== 'confirmed' && b.status !== 'pending') return;
      b.roomIds.forEach((roomId) => {
        if (!map[roomId]) {
          map[roomId] = { bookingNumber: b.bookingNumber, guestName: b.user.name, guestEmail: b.user.email, checkIn: b.checkIn, checkOut: b.checkOut, bookingStatus: b.status };
        }
      });
    });
    return map;
  }, [apiBookings]);

  const rooms = useMemo(() => {
    return apiRooms.map((room) => {
      const manualStatus = roomStatuses[room.id];
      let resolvedStatus: RoomStatus = manualStatus ?? room.status;
      if (!manualStatus) {
        const occ = occupancyByRoom[room.id];
        if (occ) resolvedStatus = occ.bookingStatus === 'checked_in' ? 'occupied' : 'reserved';
      }
      return {
        ...room,
        beds: room.beds ?? Math.max(1, room.maxGuests - 1),
        sizeSqm: room.sizeSqm ?? (room.maxGuests * 15),
        status: resolvedStatus,
        isCleaned: roomCleanStates[room.id] ?? false,
      };
    });
  }, [apiRooms, roomStatuses, roomCleanStates, occupancyByRoom]);

  const selectedRoom = useMemo(() => rooms.find((r) => r.id === selectedRoomId) ?? null, [rooms, selectedRoomId]);
  const selectedRoomOccupancy = selectedRoom ? occupancyByRoom[selectedRoom.id] : undefined;
  const availableRooms = useMemo(() => rooms.filter((r) => r.status === 'available'), [rooms]);

  const handleRegisterGuest = async () => {
    setGuestError('');
    if (!guestLastName.trim() || !guestFirstName.trim()) { setGuestError(mn ? 'Овог, нэр оруулна уу.' : 'Last name and first name are required.'); return; }
    if (!guestEmail.trim()) { setGuestError(mn ? 'Имэйл оруулна уу.' : 'Email is required.'); return; }
    if (guestPassword.length < 6) { setGuestError(mn ? 'Нууц үг хамгийн багадаа 6 тэмдэгт.' : 'Password must be at least 6 characters.'); return; }
    if (guestPassword !== guestConfirmPassword) { setGuestError(mn ? 'Нууц үг таарахгүй байна.' : 'Passwords do not match.'); return; }

    const fullName = `${guestLastName.trim()} ${guestFirstName.trim()}`;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guestEmail.trim(), name: fullName, password: guestPassword, phone: guestPhone.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) { setGuestError(json.error || 'Алдаа гарлаа'); return; }
      setRegisteredGuests((prev) => [{ id: json.data.id, name: fullName, phone: guestPhone.trim(), email: guestEmail.trim(), createdAt: new Date().toISOString() }, ...prev]);
      setGuestLastName(''); setGuestFirstName(''); setGuestPhone(''); setGuestEmail(''); setGuestPassword(''); setGuestConfirmPassword('');
    } catch { setGuestError(mn ? 'Сервертэй холбогдож чадсангүй' : 'Server error'); }
  };

  const handleCreateBooking = () => {
    if (!bkLastName.trim() || !bkFirstName.trim() || !bkPhone.trim() || !bkEmail.trim() || !bkRoomId || !bkCheckIn || !bkCheckOut) return;
    const fullName = `${bkLastName.trim()} ${bkFirstName.trim()}`;
    setStaffBookings((prev) => [
      { id: `sb-${Date.now()}`, guestName: fullName, guestPhone: bkPhone.trim(), guestEmail: bkEmail.trim(), roomId: bkRoomId, checkIn: bkCheckIn, checkOut: bkCheckOut, guests: bkGuests, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setRoomStatuses((prev) => ({ ...prev, [bkRoomId]: 'reserved' }));
    setBkLastName(''); setBkFirstName(''); setBkPhone(''); setBkEmail(''); setBkRoomId(''); setBkCheckIn(''); setBkCheckOut(''); setBkGuests(1);
  };

  const tabTitle = () => {
    switch (activeTab) {
      case 'rooms': return mn ? 'Өрөөний удирдлага' : 'Room Management';
      case 'guests': return mn ? 'Зочин бүртгэх' : 'Register Guest';
      case 'booking': return mn ? 'Захиалга үүсгэх' : 'New Booking';
      case 'reports': return mn ? 'Тайлан' : 'Reports';
    }
  };

  if (loading) {
    return (
      <StaffLayout activeTab={activeTab} onTabChange={setActiveTab} locale={locale} headerTitle="Ачааллаж байна...">
        <div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout activeTab={activeTab} onTabChange={setActiveTab} locale={locale} headerTitle={tabTitle()}>
      {activeTab === 'rooms' && (
        <div className="p-6 md:p-8 flex-1 grid gap-8 lg:grid-cols-3 items-start">
          <section className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => {
                const config = statusColors[room.status];
                const Icon = config.icon;
                return (
                  <div key={room.id} className={cn('group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md', selectedRoomId === room.id ? 'border-brand ring-2 ring-brand' : 'border-gray-200 hover:border-brand-soft', !room.isCleaned && 'bg-red-50 border-red-200')} onClick={() => setSelectedRoomId(room.id)}>
                    <div className={cn('flex items-center justify-between border-b border-gray-100 px-4 py-3', config.bg)}>
                      <div className="font-bold text-gray-900 border border-gray-200 bg-white/60 px-2 py-0.5 rounded shadow-sm">{room.number}</div>
                      <Icon className={cn('h-5 w-5', config.text)} />
                    </div>
                    <div className="px-4 py-3 pb-0 flex-1 flex flex-col">
                      <div className="text-sm font-semibold text-gray-700 truncate">{room.typeName}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                        <span className="bg-gray-100 rounded px-1.5 py-0.5 flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-gray-400" /> {room.beds} {mn ? 'ор' : 'beds'}</span>
                        <span className="bg-gray-100 rounded px-1.5 py-0.5 flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5 text-gray-400" /> {room.sizeSqm} m²</span>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600 h-8">
                        {occupancyByRoom[room.id] ? (<><User className="h-4 w-4 text-amber-500" /><span className="truncate font-medium">{occupancyByRoom[room.id]?.guestName}</span></>) : (<span className="text-gray-400 italic text-sm">{mn ? 'Хоосон' : 'Empty'}</span>)}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50/50 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setRoomCleanStates((p) => ({ ...p, [room.id]: !room.isCleaned })); }} className={cn('flex-1 h-8 text-xs border gap-1.5', room.isCleaned ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-red-200 bg-white text-red-600 hover:bg-red-50')}>
                        <ThermometerSun className="h-3 w-3" />{room.isCleaned ? (mn ? 'Цэвэр' : 'Clean') : (mn ? 'Цэвэрлэх' : 'Dirty')}
                      </Button>
                      <select value={room.status} onClick={(e) => e.stopPropagation()} onChange={(e) => setRoomStatuses((prev) => ({ ...prev, [room.id]: e.target.value as RoomStatus }))} className={cn('h-8 flex-1 cursor-pointer appearance-none rounded-md border border-gray-200 px-2 py-0 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand', config.text)}>
                        {Object.keys(statusLabels).map((s) => (<option key={s} value={s} className="text-gray-900">{statusLabels[s as RoomStatus]}</option>))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="lg:col-span-1 lg:sticky lg:top-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5 self-start">
            <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-brand" />{mn ? 'Өрөөний дэлгэрэнгүй' : 'Room Details'}</h2>
            {!selectedRoom ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 text-gray-400"><p className="text-center text-sm">{mn ? 'Өрөө сонгоно уу' : 'Select a room'}</p></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div><h3 className="text-3xl font-bold tracking-tight text-gray-900">{selectedRoom.number}</h3><p className="font-medium text-brand text-sm">{selectedRoom.typeName}</p></div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase', statusColors[selectedRoom.status].bg, statusColors[selectedRoom.status].text)}>{statusLabels[selectedRoom.status]}</span>
                    <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded border', selectedRoom.isCleaned ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200')}>{selectedRoom.isCleaned ? (mn ? 'Цэвэр' : 'Clean') : (mn ? 'Бохир' : 'Dirty')}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                  <div className="text-gray-500 font-medium">{mn ? 'Орны тоо' : 'Beds'}</div><div className="text-gray-900 font-semibold">{selectedRoom.beds}</div>
                  <div className="text-gray-500 font-medium">{mn ? 'Хэмжээ' : 'Size'}</div><div className="text-gray-900 font-semibold">{selectedRoom.sizeSqm} m²</div>
                  <div className="text-gray-500 font-medium">{mn ? 'Давхар' : 'Floor'}</div><div className="text-gray-900 font-semibold">{selectedRoom.floor}</div>
                  <div className="text-gray-500 font-medium">{mn ? 'Үнэ' : 'Rate'}</div><div className="text-gray-900 font-semibold break-words text-right">{formatPriceFromUsd(selectedRoom.basePricePerNight, locale)}/{mn ? 'шөнө' : 'nt'}</div>
                </div>
                <div className={cn('rounded-lg border p-4', selectedRoomOccupancy ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white')}>
                  <h4 className="mb-2 text-sm font-bold text-gray-900 flex items-center gap-1.5"><User className="h-4 w-4" /> {mn ? 'Зочны мэдээлэл' : 'Guest Info'}</h4>
                  {selectedRoomOccupancy ? (
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><dt className="text-gray-500">{mn ? 'Нэр' : 'Name'}</dt><dd className="font-medium text-gray-900">{selectedRoomOccupancy.guestName}</dd></div>
                      <div className="flex justify-between"><dt className="text-gray-500">{mn ? 'Захиалга' : 'Ref'}</dt><dd className="font-medium text-gray-900">#{selectedRoomOccupancy.bookingNumber}</dd></div>
                      <div className="flex justify-between"><dt className="text-gray-500">{mn ? 'Хугацаа' : 'Stay'}</dt><dd className="font-medium text-gray-900 text-right">{selectedRoomOccupancy.checkIn} — {selectedRoomOccupancy.checkOut}</dd></div>
                    </dl>
                  ) : (<p className="text-xs text-gray-500">{mn ? 'Зочин байхгүй' : 'No active guest'}</p>)}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'guests' && (
        <div className="p-6 md:p-8 flex-1 max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-brand" />{mn ? 'Шинэ зочин бүртгэх' : 'Register New Guest'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Овог' : 'Last Name'}</label><Input value={guestLastName} onChange={(e) => setGuestLastName(e.target.value)} className="mt-1" placeholder={mn ? 'Овог' : 'Last name'} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Нэр' : 'First Name'}</label><Input value={guestFirstName} onChange={(e) => setGuestFirstName(e.target.value)} className="mt-1" placeholder={mn ? 'Нэр' : 'First name'} /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Утас' : 'Phone'}</label><Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="mt-1" type="tel" placeholder="+976 9911 2233" /></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Имэйл' : 'Email'}</label><Input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="mt-1" type="email" placeholder="guest@email.com" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Нууц үг' : 'Password'}</label><Input value={guestPassword} onChange={(e) => setGuestPassword(e.target.value)} className="mt-1" type="password" minLength={6} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Нууц үг давтах' : 'Confirm Password'}</label><Input value={guestConfirmPassword} onChange={(e) => setGuestConfirmPassword(e.target.value)} className="mt-1" type="password" minLength={6} /></div>
              </div>
              {guestError && <p className="text-sm text-red-600">{guestError}</p>}
              <Button onClick={handleRegisterGuest} className="bg-brand hover:bg-brand-hover w-full"><UserPlus className="h-4 w-4 mr-2" />{mn ? 'Бүртгэх' : 'Register'}</Button>
            </div>
          </div>
          {registeredGuests.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{mn ? 'Бүртгэсэн зочид' : 'Registered Guests'}</h3>
              <div className="space-y-2">
                {registeredGuests.map((g) => (
                  <div key={g.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                    <div><p className="font-bold text-gray-900">{g.name}</p><p className="text-xs text-gray-500">{g.phone} · {g.email}</p></div>
                    <span className="text-xs text-gray-400">{new Date(g.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="p-6 md:p-8 flex-1 max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CalendarPlus className="h-5 w-5 text-brand" />{mn ? 'Зочинд өрөө захиалж өгөх' : 'Book Room for Guest'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Овог' : 'Last Name'}</label><Input value={bkLastName} onChange={(e) => setBkLastName(e.target.value)} className="mt-1" placeholder={mn ? 'Овог' : 'Last name'} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Нэр' : 'First Name'}</label><Input value={bkFirstName} onChange={(e) => setBkFirstName(e.target.value)} className="mt-1" placeholder={mn ? 'Нэр' : 'First name'} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Утас' : 'Phone'}</label><Input value={bkPhone} onChange={(e) => setBkPhone(e.target.value)} className="mt-1" type="tel" placeholder="+976 9911 2233" /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Имэйл' : 'Email'}</label><Input value={bkEmail} onChange={(e) => setBkEmail(e.target.value)} className="mt-1" type="email" placeholder="guest@email.com" /></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Өрөө сонгох' : 'Select Room'}</label>
                <select value={bkRoomId} onChange={(e) => setBkRoomId(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm">
                  <option value="">{mn ? 'Өрөө сонгоно уу...' : 'Choose a room...'}</option>
                  {availableRooms.map((r) => (<option key={r.id} value={r.id}>{r.number} — {r.typeName} ({r.maxGuests} {mn ? 'хүн' : 'guests'}) — {formatPriceFromUsd(r.basePricePerNight, locale)}/{mn ? 'шөнө' : 'nt'}</option>))}
                </select>
                {availableRooms.length === 0 && <p className="mt-1 text-xs text-red-500">{mn ? 'Боломжит өрөө байхгүй' : 'No available rooms'}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Ирэх өдөр' : 'Check-in'}</label><Input type="date" value={bkCheckIn} onChange={(e) => setBkCheckIn(e.target.value)} className="mt-1" /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Гарах өдөр' : 'Check-out'}</label><Input type="date" value={bkCheckOut} onChange={(e) => setBkCheckOut(e.target.value)} className="mt-1" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">{mn ? 'Зочдын тоо' : 'Guests'}</label><Input type="number" min={1} value={bkGuests} onChange={(e) => setBkGuests(Math.max(1, Number(e.target.value) || 1))} className="mt-1" /></div>
              <Button onClick={handleCreateBooking} disabled={!bkLastName.trim() || !bkFirstName.trim() || !bkPhone.trim() || !bkEmail.trim() || !bkRoomId || !bkCheckIn || !bkCheckOut} className="bg-brand hover:bg-brand-hover w-full"><CalendarPlus className="h-4 w-4 mr-2" />{mn ? 'Захиалга үүсгэх' : 'Create Booking'}</Button>
            </div>
          </div>
          {staffBookings.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{mn ? 'Үүсгэсэн захиалгууд' : 'Created Bookings'}</h3>
              <div className="space-y-2">
                {staffBookings.map((b) => {
                  const room = rooms.find((r) => r.id === b.roomId);
                  return (
                    <div key={b.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                      <div><p className="font-bold text-gray-900">{b.guestName}</p><p className="text-xs text-gray-500">{b.guestPhone} · {b.guestEmail}</p><p className="text-xs text-gray-500">{mn ? 'Өрөө' : 'Room'} {room?.number ?? b.roomId} · {b.checkIn} — {b.checkOut} · {b.guests} {mn ? 'хүн' : 'guests'}</p></div>
                      <span className="text-xs font-semibold text-brand">{mn ? 'Захиалагдсан' : 'Reserved'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && <ReportPanel />}
    </StaffLayout>
  );
}
