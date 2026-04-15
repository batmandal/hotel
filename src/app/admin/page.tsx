'use client';

import React, { useMemo, useState, useRef } from 'react';
import { hotels, rooms as initialRooms, staffMembers as initialStaffMembers, users as initialUsers, bookings } from '@/data/mockData';
import type { RoomStatus, User, UserRole } from '@/types';
import { AdminLayout, type AdminTab } from '@/components/admin/AdminLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { cn } from '@/lib/utils';
import { Users, UserCheck, Activity, BedDouble, Download, Check, Edit3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EntityListPanel } from '@/components/admin/EntityListPanel';
import { Badge } from '@/components/ui/badge';
import { USD_MNT_RATE, formatMntAmount, formatMntFromUsd } from '@/lib/pricing';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type StaffStatus = 'active' | 'on_leave' | 'inactive';
type UserAccountStatus = 'active' | 'suspended';

type DashboardStaff = { id: string; name: string; email: string; hotelName: string; department: string; position: string; status: StaffStatus; };
type DashboardUser = { id: string; name: string; email: string; phone: string; role: UserRole; status: UserAccountStatus; };

const STAFF_STATUS_OPTIONS: StaffStatus[] = ['active', 'on_leave', 'inactive'];
const USER_STATUS_OPTIONS: UserAccountStatus[] = ['active', 'suspended'];
const ROOM_STATUS_OPTIONS: RoomStatus[] = ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'];


function buildDashboardStaff(users: User[]): DashboardStaff[] {
  return initialStaffMembers.map((staff, index) => ({
    id: staff.id, name: users.find(u => u.id === staff.userId)?.name ?? 'Тодорхойгүй', email: users.find(u => u.id === staff.userId)?.email ?? '-', hotelName: hotels.find(h => h.id === staff.hotelId)?.name ?? '-', department: staff.department, position: staff.position, status: index === 1 ? 'on_leave' : 'active',
  }));
}

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
  const [usersState, setUsersState] = useState<DashboardUser[]>(initialUsers.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone ?? '-', role: u.role, status: 'active' })));
  const [staffState, setStaffState] = useState<DashboardStaff[]>(() => buildDashboardStaff(initialUsers));
  const [roomsState, setRoomsState] = useState(initialRooms.map(r => ({ ...r, beds: r.beds ?? Math.max(1, r.maxGuests - 1), sizeSqm: r.sizeSqm ?? (r.maxGuests * 15) })));
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Chart State
  const [chartViewMode, setChartViewMode] = useState<'monthly' | 'yearly'>('monthly');

  // Report Range State
  const defaultStart = new Date(); defaultStart.setDate(1); defaultStart.setMonth(defaultStart.getMonth() - 1); // Last month string
  const [reportStartDate, setReportStartDate] = useState(defaultStart.toISOString().slice(0, 10));
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().slice(0, 10));

  // Search States
  const [staffSearch, setStaffSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Selection States
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Summaries
  const guestUsers = useMemo(() => usersState.filter(u => u.role === 'guest'), [usersState]);
  const staffSummary = { active: staffState.filter(s => s.status === 'active').length, onLeave: staffState.filter(s => s.status === 'on_leave').length, inactive: staffState.filter(s => s.status === 'inactive').length, total: staffState.length };
  const userSummary = { active: guestUsers.filter(u => u.status === 'active').length, suspended: guestUsers.filter(u => u.status === 'suspended').length, total: guestUsers.length };
  const roomSummary = { occupied: roomsState.filter(r => r.status === 'occupied').length, available: roomsState.filter(r => r.status === 'available').length, cleaning: roomsState.filter(r => r.status === 'cleaning').length, maintenance: roomsState.filter(r => r.status === 'maintenance').length, total: roomsState.length };

  // RICH MOCK DATA FOR CHARTS (орлого USD дээрээс ₮ хөрвүүлэлт)
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

  // DYNAMIC CHARTS LOGIC
  const chartData = useMemo(() => {
    return chartViewMode === 'monthly' ? MOCK_MONTHLY_DATA : MOCK_YEARLY_DATA;
  }, [chartViewMode]);

  // DYNAMIC REPORTS LOGIC
  const reportBookings = useMemo(() => {
    const start = new Date(reportStartDate).setHours(0,0,0,0);
    const end = new Date(reportEndDate).setHours(23,59,59,999);
    return bookings.filter(b => {
       if(!b.checkIn) return false;
       const t = new Date(b.checkIn).getTime();
       return t >= start && t <= end;
    }).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  }, [reportStartDate, reportEndDate]);
  
  const reportMetrics = useMemo(() => {
     let revenue = 0;
     const userSet = new Set();
     reportBookings.forEach(b => {
        if(b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out') {
           revenue += b.totalAmount * USD_MNT_RATE;
        }
        userSet.add(b.userId);
     });
     return { totalRevenue: revenue, totalGuests: userSet.size, totalBookings: reportBookings.length };
  }, [reportBookings]);

  const totalAggregatedRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`admin-report-${reportStartDate}-to-${reportEndDate}.pdf`);
    } catch (err) { console.error(err); } finally { setIsGeneratingPdf(false); }
  };

  // Entity Creation Handlers
  const handleCreateStaff = () => {
    const newId = `staff-new-${Date.now()}`;
    setStaffState(prev => [{ id: newId, name: 'Шинэ ажилтан', email: '', hotelName: hotels[0]?.name || '', department: 'General', position: 'Ажилтан', status: 'active' }, ...prev]);
    setSelectedStaffId(newId);
  };
  const handleCreateUser = () => {
    const newId = `user-new-${Date.now()}`;
    setUsersState(prev => [{ id: newId, name: 'Шинэ хэрэглэгч', email: '', phone: '', role: 'guest', status: 'active' }, ...prev]);
    setSelectedUserId(newId);
  };
  const handleCreateRoom = () => {
    const newId = `room-new-${Date.now()}`;
    setRoomsState(prev => [{ id: newId, hotelId: hotels[0]?.id || '', typeCode: 'SD', typeName: 'Standard Double', floor: 1, number: 'NEW', status: 'available', basePricePerNight: 120, maxGuests: 2, maxExtraBeds: 0, amenities: [], beds: 1, sizeSqm: 25 }, ...prev]);
    setSelectedRoomId(newId);
  };

  // Staff Editing
  const selectedStaff = selectedStaffId ? staffState.find(s => s.id === selectedStaffId) : null;
  const filteredStaff = staffState.filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()));
  const updateSelectedStaff = (field: keyof DashboardStaff, value: string) => {
    if(!selectedStaffId) return;
    setStaffState(prev => prev.map(s => s.id === selectedStaffId ? { ...s, [field]: value } : s));
  };

  // User Editing
  const selectedUser = selectedUserId ? usersState.find(u => u.id === selectedUserId) : null;
  const filteredUsers = usersState.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const updateSelectedUser = (field: keyof DashboardUser, value: string) => {
    if(!selectedUserId) return;
    setUsersState(prev => prev.map(u => u.id === selectedUserId ? { ...u, [field]: value } : u));
  };

  // Room Editing
  const selectedRoom = selectedRoomId ? roomsState.find(r => r.id === selectedRoomId) : null;
  const filteredRooms = roomsState.filter(r => r.number.toLowerCase().includes(roomSearch.toLowerCase()) || r.typeName.toLowerCase().includes(roomSearch.toLowerCase()));
  const updateSelectedRoom = (field: keyof typeof roomsState[0], value: any) => {
    if(!selectedRoomId) return;
    setRoomsState(prev => prev.map(r => r.id === selectedRoomId ? { ...r, [field]: value } : r));
  };

  const getTabTitle = () => {
    switch(activeTab){
      case 'overview': return 'Админы самбар';
      case 'reports': return 'Санхүүгийн тайлан';
      case 'staff': return 'Ажилчид';
      case 'users': return 'Хэрэглэгчид';
      case 'rooms': return 'Өрөөнүүд';
    }
  }

  const userBookings = useMemo(() => {
    if (!selectedUserId) return [];
    return bookings.filter(b => b.userId === selectedUserId);
  }, [selectedUserId]);

  const formatMNT = (amountMnt: number) => formatMntAmount(amountMnt);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} tabTitle={getTabTitle() ?? ''}>

        {activeTab === 'overview' && (
          <div className="mx-auto w-full min-w-0 max-w-7xl space-y-8 p-6 pb-20 md:p-8">
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Нийт урт хугацааны орлого" value={formatMNT(totalAggregatedRevenue)} icon={Activity} trend="Тооцоолсон" />
              <MetricCard title="Эзлэгдсэн өрөө" value={roomSummary.occupied} icon={BedDouble} trend={`${Math.round((roomSummary.occupied / roomSummary.total) * 100)}% дүүрэлт`} />
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
                    
                    <YAxis
                      yAxisId="left"
                      width={56}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#335c58' }}
                      tickFormatter={(v) => `₮${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <YAxis
                      yAxisId="right"
                      width={48}
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#3b82f6' }}
                      tickFormatter={(v) => `${v}`}
                    />
                    
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: 280, wordBreak: 'break-word' }} 
                      wrapperStyle={{ outline: 'none', maxWidth: '100%' }}
                      formatter={(value, name) => [name === 'Орлого (₮)' ? formatMNT(value as number) : `${value} хүн`, name]}
                    />
                    <Legend wrapperStyle={{ paddingTop: 12, width: '100%', fontSize: 12 }} />
                    <Area yAxisId="left" type="monotone" name="Орлого (₮)" dataKey="revenue" stroke="#335c58" strokeWidth={3} fillOpacity={1} fill="url(#colorRevs)" />
                    <Line yAxisId="right" type="monotone" name="Зочид" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* STAFF MANAGEMENT */}
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
                  <Button className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Өөрчлөлтийг хадгалах</Button>
                </div>
              </div>
            ) : <></>}
          />
        )}

        {/* USERS MANAGEMENT */}
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
                    <label className="text-xs font-bold text-gray-500 uppercase">Бүртгэлийн төлөв (идэвхтэй эсвэл цуцлагдсан)</label>
                    <Select value={selectedUser.status} onChange={e => updateSelectedUser('status', e.target.value as UserAccountStatus)} options={USER_STATUS_OPTIONS.map(opt => ({ value: opt, label: opt.toUpperCase() }))} className="mt-1" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Тохиргоог хадгалах</Button>
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
                            <p className="font-bold text-gray-900">Өрөө {b.roomIds.map(rid => initialRooms.find(r => r.id === rid)?.number || rid).join(', ')}</p>
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

        {/* ROOMS MANAGEMENT */}
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
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedRoom.id} • Hotel ID: {selectedRoom.hotelId}</p>
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
                  <Button className="bg-brand hover:bg-brand-hover w-full"><Check className="h-4 w-4 mr-2" />Тохиргоог хадгалах</Button>
                </div>
              </div>
            ) : <></>}
          />
        )}

        {/* REPORTS PREVIEW */}
        {activeTab === 'reports' && (
          <div className="flex w-full min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-gray-100/30 p-6 md:p-8">
             <div className="w-full max-w-[210mm] border border-gray-200 bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Эхлэх огноо</label>
                     <div className="relative">
                       <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="rounded-md border border-gray-200 py-1.5 pl-9 pr-3 text-sm focus-visible:ring-2 focus-visible:ring-brand shadow-sm bg-white" />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Дуусах огноо</label>
                     <div className="relative">
                       <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} className="rounded-md border border-gray-200 py-1.5 pl-9 pr-3 text-sm focus-visible:ring-2 focus-visible:ring-brand shadow-sm bg-white" />
                     </div>
                   </div>
                </div>
                
                <Button onClick={handleExportPdf} disabled={isGeneratingPdf} className="bg-brand hover:bg-brand-hover gap-2 font-bold w-full md:w-auto">
                  <Download className="h-4 w-4" /> {isGeneratingPdf ? 'Боловсруулж байна...' : 'PDF татах'}
                </Button>
             </div>
             
             <div className="w-full max-w-[210mm] pb-10">
                <div ref={reportRef} className="bg-white mx-auto text-black shadow-lg" style={{ minHeight: '297mm', padding: '20mm' }}>
                   {/* Headers Output */}
                   <div className="border-b-2 border-gray-200 pb-4 mb-8 flex justify-between">
                      <div>
                         <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Санхүүгийн тайлан</h1>
                         <p className="text-gray-500 font-semibold mt-1">Хугацаа: {reportStartDate} -с {reportEndDate}</p>
                      </div>
                      <div className="text-right">
                         <h2 className="text-xl font-bold">UbHotel ХХК</h2>
                         <p className="text-gray-500 text-sm">Системээс автоматаар үүсгэв</p>
                      </div>
                   </div>

                   {/* Overview Summary */}
                   <h3 className="bg-gray-100 px-3 py-1 font-bold text-gray-800 uppercase text-xs mb-4">Тайлангийн хураангуй</h3>
                   <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                     <div className="min-w-0 rounded-lg border border-gray-200 p-4 text-center"><div className="break-words text-xl font-bold text-brand sm:text-2xl md:text-3xl">{formatMNT(reportMetrics.totalRevenue)}</div><div className="text-xs font-bold uppercase text-gray-500">Нийт өрөөний орлого</div></div>
                     <div className="min-w-0 rounded-lg border border-gray-200 p-4 text-center"><div className="text-3xl font-bold">{reportMetrics.totalBookings}</div><div className="text-xs font-bold uppercase text-gray-500">Нийт захиалга</div></div>
                     <div className="min-w-0 rounded-lg border border-gray-200 p-4 text-center"><div className="text-3xl font-bold">{reportMetrics.totalGuests}</div><div className="text-xs font-bold uppercase text-gray-500">Үйлчлүүлсэн зочид</div></div>
                   </div>

                   {/* Transactions Detail */}
                   <h3 className="bg-gray-100 px-3 py-1 font-bold text-gray-800 uppercase text-xs mb-4">Захиалгын жагсаалт</h3>
                   {reportBookings.length === 0 ? (
                     <div className="py-10 text-center text-gray-400 italic">Энэ хугацаанд ямар нэгэн захиалга бүртгэгдээгүй байна.</div>
                   ) : (
                     <table className="mb-8 w-full min-w-0 table-fixed border-collapse text-left text-sm">
                       <thead>
                         <tr className="border-b-2 border-gray-200 text-gray-600 font-bold">
                           <th className="py-2 pl-2">Огноо (Орох - Гарах)</th>
                           <th className="py-2">Зочны профайл</th>
                           <th className="py-2">Өрөө</th>
                           <th className="py-2 text-right">Төлбөр (₮)</th>
                           <th className="py-2 text-right pr-2">Төлөв</th>
                         </tr>
                       </thead>
                       <tbody>
                         {reportBookings.map(b => {
                           const u = usersState.find(u => u.id === b.userId) || initialUsers.find(user => user.id === b.userId);
                           return (
                             <tr key={b.id} className="border-b border-gray-200">
                               <td className="py-2.5 pl-2">
                                 <div className="font-semibold text-gray-900">{b.checkIn}</div>
                                 <div className="text-xs text-gray-400">гарах: {b.checkOut}</div>
                               </td>
                               <td className="py-2.5">
                                 <div className="font-medium text-gray-800">{u?.name || 'Тодорхойгүй зочин'}</div>
                                 <div className="text-xs text-gray-500">{u?.email || 'N/A'}</div>
                               </td>
                               <td className="py-2.5 text-xs font-bold text-gray-600">{b.roomIds.map(rid => initialRooms.find(r => r.id === rid)?.number || rid).join(', ')}</td>
                               <td className="max-w-[28%] break-words py-2.5 text-right align-top font-black text-brand">{formatMntFromUsd(b.totalAmount)}</td>
                               <td className="py-2.5 text-right pr-2">
                                 <span className="text-[10px] uppercase font-bold text-gray-500">{b.status.replace('_', ' ')}</span>
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   )}

                   <div className="mt-20 pt-8 border-t border-gray-200 text-xs text-gray-400">
                      <p>UbHotel ХХК Удирдлагын өмч</p>
                      <p className="mt-4">Баталгаажуулсан гарын үсэг: _______________________ Огноо: ________________</p>
                   </div>
                </div>
             </div>
          </div>
        )}
    </AdminLayout>
  );
}
