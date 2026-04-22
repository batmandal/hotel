'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type { RoomStatus, UserRole } from '@/types';
import { AdminLayout, type AdminTab } from '@/components/admin/AdminLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { cn } from '@/lib/utils';
import { Users, UserCheck, Activity, BedDouble, Check, Edit3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EntityListPanel } from '@/components/admin/EntityListPanel';
import { Badge } from '@/components/ui/badge';
import { USD_MNT_RATE, formatMntAmount, formatMntFromUsd } from '@/lib/pricing';
import { ReportPanel } from '@/components/reports/ReportPanel';

type StaffStatus = 'active' | 'on_leave' | 'inactive';
type UserAccountStatus = 'active' | 'suspended';

type DashboardStaff = { id: string; staffId: string; name: string; email: string; hotelName: string; department: string; position: string; status: StaffStatus; };
type DashboardUser = { id: string; name: string; email: string; phone: string; role: UserRole; status: UserAccountStatus; };
type DashboardRoom = { id: string; hotelId: string; typeCode: string; typeName: string; floor: number; number: string; status: RoomStatus; basePricePerNight: number; maxGuests: number; maxExtraBeds: number; beds: number; sizeSqm: number; amenities: string[]; };
type UserBooking = { id: string; bookingNumber: string; checkIn: string; checkOut: string; nights: number; status: string; totalAmount: number; roomNumbers: string[]; };

const STAFF_STATUS_OPTIONS: StaffStatus[] = ['active', 'on_leave', 'inactive'];
const USER_STATUS_OPTIONS: UserAccountStatus[] = ['active', 'suspended'];
const ROOM_STATUS_OPTIONS: RoomStatus[] = ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'];

function MetricCard({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-medium text-gray-500">{title}</h3>
        <div className="shrink-0 rounded-md bg-brand-muted p-2 text-brand"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="min-w-0 max-w-full break-words text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</span>
        {trend && <span className="shrink-0 text-xs font-semibold text-green-600">{trend}</span>}
      </div>
    </div>
  );
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);

  // Data from API
  const [usersState, setUsersState] = useState<DashboardUser[]>([]);
  const [staffState, setStaffState] = useState<DashboardStaff[]>([]);
  const [roomsState, setRoomsState] = useState<DashboardRoom[]>([]);

  // Chart State
  const [chartViewMode, setChartViewMode] = useState<'monthly' | 'yearly'>('monthly');

  // Search States
  const [staffSearch, setStaffSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Selection States
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // User bookings (selected user)
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);

  // ---- Fetch data from API ----
  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/users');
    const json = await res.json();
    setUsersState(json.data.map((u: any) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone ?? '-', role: u.role, status: 'active' as UserAccountStatus })));
  }, []);

  const fetchStaff = useCallback(async () => {
    const res = await fetch('/api/staff');
    const json = await res.json();
    setStaffState(json.data.map((s: any, i: number) => ({
      id: s.userId,
      staffId: s.id,
      name: s.user.name,
      email: s.user.email,
      hotelName: s.hotelName,
      department: s.department,
      position: s.position,
      status: (i === 1 ? 'on_leave' : 'active') as StaffStatus,
    })));
  }, []);

  const fetchRooms = useCallback(async () => {
    const res = await fetch('/api/rooms');
    const json = await res.json();
    setRoomsState(json.data.map((r: any) => ({
      id: r.id,
      hotelId: r.hotelId,
      typeCode: r.typeCode,
      typeName: r.typeName,
      floor: r.floor,
      number: r.number,
      status: r.status,
      basePricePerNight: r.basePricePerNight,
      maxGuests: r.maxGuests,
      maxExtraBeds: r.maxExtraBeds,
      beds: r.beds ?? Math.max(1, r.maxGuests - 1),
      sizeSqm: r.sizeSqm ?? (r.maxGuests * 15),
      amenities: r.amenities ?? [],
    })));
  }, []);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchStaff(), fetchRooms()]).finally(() => setLoading(false));
  }, [fetchUsers, fetchStaff, fetchRooms]);

  // Fetch selected user's bookings
  useEffect(() => {
    if (!selectedUserId) { setUserBookings([]); return; }
    fetch(`/api/users/${selectedUserId}`)
      .then(r => r.json())
      .then(json => {
        if (json.data?.bookings) {
          setUserBookings(json.data.bookings.map((b: any) => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            checkIn: typeof b.checkIn === 'string' ? b.checkIn.slice(0, 10) : b.checkIn,
            checkOut: typeof b.checkOut === 'string' ? b.checkOut.slice(0, 10) : b.checkOut,
            nights: b.nights,
            status: b.status,
            totalAmount: b.totalAmount,
            roomNumbers: b.roomNumbers || [],
          })));
        }
      })
      .catch(() => setUserBookings([]));
  }, [selectedUserId]);

  // ---- Save handlers (API PUT) ----
  const handleSaveStaff = async () => {
    const s = selectedStaff;
    if (!s) return;
    await fetch(`/api/staff/${s.staffId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department: s.department, position: s.position }),
    });
    // Update user name/email
    await fetch(`/api/users/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: s.name, email: s.email }),
    });
    await fetchStaff();
  };

  const handleSaveUser = async () => {
    const u = selectedUser;
    if (!u) return;
    await fetch(`/api/users/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: u.name, email: u.email, phone: u.phone }),
    });
    await fetchUsers();
  };

  const handleSaveRoom = async () => {
    const r = selectedRoom;
    if (!r) return;
    await fetch(`/api/rooms/${r.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typeName: r.typeName, basePricePerNight: r.basePricePerNight, floor: r.floor, number: r.number, beds: r.beds, sizeSqm: r.sizeSqm, status: r.status }),
    });
    await fetchRooms();
  };

  // Summaries
  const guestUsers = useMemo(() => usersState.filter(u => u.role === 'guest'), [usersState]);
  const staffSummary = { active: staffState.filter(s => s.status === 'active').length, onLeave: staffState.filter(s => s.status === 'on_leave').length, inactive: staffState.filter(s => s.status === 'inactive').length, total: staffState.length };
  const userSummary = { active: guestUsers.filter(u => u.status === 'active').length, suspended: guestUsers.filter(u => u.status === 'suspended').length, total: guestUsers.length };
  const roomSummary = { occupied: roomsState.filter(r => r.status === 'occupied').length, available: roomsState.filter(r => r.status === 'available').length, cleaning: roomsState.filter(r => r.status === 'cleaning').length, maintenance: roomsState.filter(r => r.status === 'maintenance').length, total: roomsState.length };

  const MOCK_MONTHLY_DATA = [
    { name: '1-р сар', revenue: 15200 * USD_MNT_RATE, users: 150 },
    { name: '2-р сар', revenue: 13800 * USD_MNT_RATE, users: 130 },
    { name: '3-р сар', revenue: 18100 * USD_MNT_RATE, users: 190 },
    { name: '4-р сар', revenue: 22200 * USD_MNT_RATE, users: 240 },
    { name: '5-р сар', revenue: 27500 * USD_MNT_RATE, users: 310 },
    { name: '6-р сар', revenue: 38400 * USD_MNT_RATE, users: 480 },
    { name: '7-р сар', revenue: 42200 * USD_MNT_RATE, users: 520 },
    { name: '8-р сар', revenue: 49800 * USD_MNT_RATE, users: 550 },
    { name: '9-р сар', revenue: 27100 * USD_MNT_RATE, users: 280 },
    { name: '10-р сар', revenue: 21500 * USD_MNT_RATE, users: 260 },
    { name: '11-р сар', revenue: 19800 * USD_MNT_RATE, users: 210 },
    { name: '12-р сар', revenue: 38900 * USD_MNT_RATE, users: 490 },
  ];
  const MOCK_YEARLY_DATA = [
    { name: '2020 он', revenue: 145000 * USD_MNT_RATE, users: 1200 },
    { name: '2021 он', revenue: 152000 * USD_MNT_RATE, users: 1500 },
    { name: '2022 он', revenue: 218000 * USD_MNT_RATE, users: 2100 },
    { name: '2023 он', revenue: 274000 * USD_MNT_RATE, users: 2400 },
    { name: '2024 он', revenue: 334500 * USD_MNT_RATE, users: 3800 },
  ];

  const chartData = useMemo(() => chartViewMode === 'monthly' ? MOCK_MONTHLY_DATA : MOCK_YEARLY_DATA, [chartViewMode]);
  const totalAggregatedRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  // Entity Creation
  const handleCreateStaff = () => {
    const newId = `staff-new-${Date.now()}`;
    setStaffState(prev => [{ id: newId, staffId: newId, name: 'Шинэ ажилтан', email: '', hotelName: 'UbHotel', department: 'General', position: 'Ажилтан', status: 'active' }, ...prev]);
    setSelectedStaffId(newId);
  };
  const handleCreateUser = () => {
    const newId = `user-new-${Date.now()}`;
    setUsersState(prev => [{ id: newId, name: 'Шинэ хэрэглэгч', email: '', phone: '', role: 'guest' as UserRole, status: 'active' as UserAccountStatus }, ...prev]);
    setSelectedUserId(newId);
  };
  const handleCreateRoom = () => {
    const newId = `room-new-${Date.now()}`;
    setRoomsState(prev => [{ id: newId, hotelId: 'hotel-1', typeCode: 'SD', typeName: 'Standard Double', floor: 1, number: 'NEW', status: 'available' as RoomStatus, basePricePerNight: 120, maxGuests: 2, maxExtraBeds: 0, amenities: [], beds: 1, sizeSqm: 25 }, ...prev]);
    setSelectedRoomId(newId);
  };

  // Editing
  const selectedStaff = selectedStaffId ? staffState.find(s => s.id === selectedStaffId) : null;
  const filteredStaff = staffState.filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()));
  const updateSelectedStaff = (field: keyof DashboardStaff, value: string) => {
    if (!selectedStaffId) return;
    setStaffState(prev => prev.map(s => s.id === selectedStaffId ? { ...s, [field]: value } : s));
  };

  const selectedUser = selectedUserId ? usersState.find(u => u.id === selectedUserId) : null;
  const filteredUsers = usersState.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const updateSelectedUser = (field: keyof DashboardUser, value: string) => {
    if (!selectedUserId) return;
    setUsersState(prev => prev.map(u => u.id === selectedUserId ? { ...u, [field]: value } : u));
  };

  const selectedRoom = selectedRoomId ? roomsState.find(r => r.id === selectedRoomId) : null;
  const filteredRooms = roomsState.filter(r => r.number.toLowerCase().includes(roomSearch.toLowerCase()) || r.typeName.toLowerCase().includes(roomSearch.toLowerCase()));
  const updateSelectedRoom = (field: keyof DashboardRoom, value: any) => {
    if (!selectedRoomId) return;
    setRoomsState(prev => prev.map(r => r.id === selectedRoomId ? { ...r, [field]: value } : r));
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Админы самбар';
      case 'reports': return 'Санхүүгийн тайлан';
      case 'staff': return 'Ажилчид';
      case 'users': return 'Хэрэглэгчид';
      case 'rooms': return 'Өрөөнүүд';
    }
  };

  const formatMNT = (amountMnt: number) => formatMntAmount(amountMnt);

  if (loading) {
    return (
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} tabTitle="Ачааллаж байна...">
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} tabTitle={getTabTitle() ?? ''}>

        {activeTab === 'overview' && (
          <div className="mx-auto w-full min-w-0 max-w-7xl space-y-8 p-6 pb-20 md:p-8">
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Нийт урт хугацааны орлого" value={formatMNT(totalAggregatedRevenue)} icon={Activity} trend="Тооцоолсон" />
              <MetricCard title="Эзлэгдсэн өрөө" value={roomSummary.occupied} icon={BedDouble} trend={`${roomSummary.total > 0 ? Math.round((roomSummary.occupied / roomSummary.total) * 100) : 0}% дүүрэлт`} />
              <MetricCard title="Идэвхтэй ажилчид" value={staffSummary.active} icon={UserCheck} trend={`${staffSummary.onLeave} амарч байна`} />
              <MetricCard title="Бүртгэлтэй хэрэглэгчид" value={userSummary.total} icon={Users} trend="Идэвхтэй" />
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="min-w-0 text-base font-bold text-gray-900">Системийн үзүүлэлт (Орлого ба зочид)</h2>
                <div className="flex shrink-0 gap-0.5 rounded-lg bg-gray-100 p-0.5">
                  <button onClick={() => setChartViewMode('monthly')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-all", chartViewMode === 'monthly' ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700")}>Сараар</button>
                  <button onClick={() => setChartViewMode('yearly')} className={cn("px-3 py-1.5 text-xs font-semibold rounded-md transition-all", chartViewMode === 'yearly' ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700")}>Жилээр</button>
                </div>
              </div>
              <div className="mt-4 h-[350px] w-full min-w-0 p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 8 }}>
                    <defs>
                      <linearGradient id="colorRevs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#335c58" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#335c58" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis yAxisId="left" width={56} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#335c58' }} tickFormatter={(v) => `₮${(v / 1_000_000).toFixed(1)}M`} />
                    <YAxis yAxisId="right" width={48} orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#3b82f6' }} tickFormatter={(v) => `${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: 280, wordBreak: 'break-word' }} wrapperStyle={{ outline: 'none', maxWidth: '100%' }} formatter={(value, name) => [name === 'Орлого (₮)' ? formatMNT(value as number) : `${value} хүн`, name]} />
                    <Legend wrapperStyle={{ paddingTop: 12, width: '100%', fontSize: 12 }} />
                    <Area yAxisId="left" type="monotone" name="Орлого (₮)" dataKey="revenue" stroke="#335c58" strokeWidth={3} fillOpacity={1} fill="url(#colorRevs)" />
                    <Line yAxisId="right" type="monotone" name="Зочид" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <EntityListPanel
            items={filteredStaff}
            selectedId={selectedStaffId}
            onSelect={setSelectedStaffId}
            searchValue={staffSearch}
            onSearchChange={setStaffSearch}
            searchPlaceholder="Ажилтан хайх..."
            onCreateNew={handleCreateStaff}
            getItemId={(s) => s.id}
            emptyIcon={<UserCheck className="h-12 w-12 opacity-20" />}
            emptyMessage="Мэдээллийг нь засах ажилтнаа жагсаалтаас сонгоно уу"
            renderItem={(s) => (
              <div className={cn("px-4 py-3 border-b border-gray-100 cursor-pointer transition-all", selectedStaffId === s.id ? "bg-brand-muted border-l-[3px] border-l-brand" : "hover:bg-gray-50 border-l-[3px] border-l-transparent")}>
                <div className="font-semibold text-gray-900 text-sm flex justify-between">{s.name} <Badge variant={s.status === 'active' ? 'success' : s.status === 'on_leave' ? 'warning' : 'neutral'}>{s.status.replace('_', ' ')}</Badge></div>
                <div className="text-xs text-gray-500 mt-1">{s.department} - {s.position}</div>
              </div>
            )}
            renderDetail={() => selectedStaff ? (
              <div className="space-y-6 max-w-lg">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Edit3 className="h-5 w-5 text-gray-400" /> Ажилтны мэдээлэл засах</h2>
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedStaff.id}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Овог нэр</label><Input value={selectedStaff.name} onChange={e => updateSelectedStaff('name', e.target.value)} className="mt-1" /></div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase">И-мэйл хаяг</label><Input type="email" value={selectedStaff.email} onChange={e => updateSelectedStaff('email', e.target.value)} className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Хэлтэс</label><Input value={selectedStaff.department} onChange={e => updateSelectedStaff('department', e.target.value)} className="mt-1" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Албан тушаал</label><Input value={selectedStaff.position} onChange={e => updateSelectedStaff('position', e.target.value)} className="mt-1" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Бүртгэлийн төлөв</label>
                    <Select value={selectedStaff.status} onChange={e => updateSelectedStaff('status', e.target.value as StaffStatus)} options={STAFF_STATUS_OPTIONS.map(opt => ({ value: opt, label: opt.toUpperCase() }))} className="mt-1" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button onClick={handleSaveStaff} className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Өөрчлөлтийг хадгалах</Button>
                </div>
              </div>
            ) : <></>}
          />
        )}

        {activeTab === 'users' && (
          <EntityListPanel
            items={filteredUsers.filter(u => u.role !== 'admin' && u.role !== 'staff')}
            selectedId={selectedUserId}
            onSelect={setSelectedUserId}
            searchValue={userSearch}
            onSearchChange={setUserSearch}
            searchPlaceholder="Зочин хайх..."
            onCreateNew={handleCreateUser}
            getItemId={(u) => u.id}
            emptyIcon={<Users className="h-12 w-12 opacity-20" />}
            emptyMessage="Удирдах хэрэглэгчээ жагсаалтаас сонгоно уу"
            renderItem={(u) => (
              <div className={cn("px-4 py-3 border-b border-gray-100 cursor-pointer transition-all", selectedUserId === u.id ? "bg-brand-muted border-l-[3px] border-l-brand" : "hover:bg-gray-50 border-l-[3px] border-l-transparent")}>
                <div className="font-semibold text-gray-900 text-sm flex justify-between">{u.name} <Badge variant={u.status === 'suspended' ? 'danger' : 'neutral'}>{u.status}</Badge></div>
                <div className="text-xs text-gray-500 mt-1">{u.email}</div>
              </div>
            )}
            renderDetail={() => selectedUser ? (
              <div className="space-y-6 max-w-lg">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Edit3 className="h-5 w-5 text-gray-400" /> Хэрэглэгчийн мэдээлэл удирдах</h2>
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedUser.id}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Овог нэр</label><Input value={selectedUser.name} onChange={e => updateSelectedUser('name', e.target.value)} className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">И-мэйл хаяг</label><Input type="email" value={selectedUser.email} onChange={e => updateSelectedUser('email', e.target.value)} className="mt-1" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Утасны дугаар</label><Input type="text" value={selectedUser.phone} onChange={e => updateSelectedUser('phone', e.target.value)} className="mt-1" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Бүртгэлийн төлөв</label>
                    <Select value={selectedUser.status} onChange={e => updateSelectedUser('status', e.target.value as UserAccountStatus)} options={USER_STATUS_OPTIONS.map(opt => ({ value: opt, label: opt.toUpperCase() }))} className="mt-1" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button onClick={handleSaveUser} className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Тохиргоог хадгалах</Button>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Захиалгын түүх</h3>
                  {userBookings.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Уг хэрэглэгчид захиалга байхгүй байна.</p>
                  ) : (
                    <div className="space-y-3">
                      {userBookings.map(b => (
                        <div key={b.id} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm shadow-sm">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900">Өрөө {b.roomNumbers.join(', ')}</p>
                            <p className="text-gray-500 text-xs">{b.checkIn} - {b.checkOut} ({b.nights} шөнө)</p>
                          </div>
                          <div className="min-w-0 shrink-0 text-right">
                            <p className="mb-1 max-w-[11rem] break-words font-semibold text-brand sm:max-w-none">{formatMntFromUsd(b.totalAmount)}</p>
                            <Badge variant={
                              b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out' ? 'success' :
                              b.status === 'cancelled' || b.status === 'no_show' ? 'danger' : 'warning'
                            }>{b.status.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : <></>}
          />
        )}

        {activeTab === 'rooms' && (
          <EntityListPanel
            items={filteredRooms}
            selectedId={selectedRoomId}
            onSelect={setSelectedRoomId}
            searchValue={roomSearch}
            onSearchChange={setRoomSearch}
            searchPlaceholder="Өрөө хайх..."
            onCreateNew={handleCreateRoom}
            getItemId={(r) => r.id}
            emptyIcon={<BedDouble className="h-12 w-12 opacity-20" />}
            emptyMessage="Тохиргоо хийх өрөөгөө жагсаалтаас сонгоно уу"
            renderItem={(r) => (
              <div className={cn("px-4 py-3 border-b border-gray-100 cursor-pointer transition-all flex items-center gap-3", selectedRoomId === r.id ? "bg-brand-muted border-l-[3px] border-l-brand" : "hover:bg-gray-50 border-l-[3px] border-l-transparent")}>
                <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center font-bold text-brand text-sm border-gray-200 border shadow-sm">{r.number}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm flex justify-between">{r.typeName} <Badge variant={r.status === 'available' ? 'success' : r.status === 'occupied' ? 'warning' : r.status === 'maintenance' ? 'danger' : r.status === 'reserved' ? 'info' : 'purple'}>{r.status}</Badge></div>
                  <div className="text-xs text-gray-500 mt-0.5 break-words">{formatMntFromUsd(r.basePricePerNight)} / шөнө</div>
                </div>
              </div>
            )}
            renderDetail={() => selectedRoom ? (
              <div className="space-y-6 max-w-lg">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Edit3 className="h-5 w-5 text-gray-400" /> Өрөөний мэдээлэл засах</h2>
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedRoom.id}</p>
                  </div>
                  <div className="bg-brand-muted text-brand text-sm font-black px-3 py-1 rounded-md shadow-sm border border-brand-soft">{selectedRoom.number}</div>
                </div>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-500 uppercase">Өрөөний төрөл</label><Input value={selectedRoom.typeName} onChange={e => updateSelectedRoom('typeName', e.target.value)} className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Үндсэн үнэ / шөнө (USD)</label>
                      <Input type="number" value={selectedRoom.basePricePerNight} onChange={e => updateSelectedRoom('basePricePerNight', Number(e.target.value))} className="mt-1" />
                      <p className="mt-1 text-[11px] text-gray-500">{formatMntFromUsd(Number(selectedRoom.basePricePerNight) || 0)}</p>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Давхар</label><Input type="number" value={selectedRoom.floor} onChange={e => updateSelectedRoom('floor', Number(e.target.value))} className="mt-1" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Өрөөний дугаар</label><Input type="text" value={selectedRoom.number} onChange={e => updateSelectedRoom('number', e.target.value)} className="mt-1" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Хэмжээ (м.кв)</label><Input type="number" value={selectedRoom.sizeSqm ?? 0} onChange={e => updateSelectedRoom('sizeSqm', Number(e.target.value))} className="mt-1" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Орны тоо</label><Input type="number" value={selectedRoom.beds ?? 1} onChange={e => updateSelectedRoom('beds', Number(e.target.value))} className="mt-1" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Өрөөний төлөв</label>
                    <Select value={selectedRoom.status} onChange={e => updateSelectedRoom('status', e.target.value as RoomStatus)} options={ROOM_STATUS_OPTIONS.map(opt => ({ value: opt, label: opt.toUpperCase() }))} className="mt-1" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button onClick={handleSaveRoom} className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Тохиргоог хадгалах</Button>
                </div>
              </div>
            ) : <></>}
          />
        )}

        {activeTab === 'reports' && <ReportPanel />}
    </AdminLayout>
  );
}
