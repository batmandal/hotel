'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import type { BookingStatus } from '@/types';
import { USD_MNT_RATE, formatMntAmount, formatMntFromUsd } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Calendar, Download, Filter, BarChart3, CreditCard, FileText, TrendingUp, RefreshCw, Printer, FileSpreadsheet, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ReportType = 'booking' | 'payment';
type TimePeriod = 'custom' | 'day' | 'week' | 'month' | 'year';

const STATUS_OPTIONS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Бүгд' },
  { value: 'pending', label: 'Хүлээгдэж буй' },
  { value: 'confirmed', label: 'Баталгаажсан' },
  { value: 'checked_in', label: 'Бүртгэгдсэн' },
  { value: 'checked_out', label: 'Гарсан' },
  { value: 'cancelled', label: 'Цуцалсан' },
  { value: 'no_show', label: 'Ирээгүй' },
];

const STATUS_BADGE_MAP: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  confirmed: 'success',
  checked_in: 'success',
  checked_out: 'info',
  pending: 'warning',
  cancelled: 'danger',
  no_show: 'danger',
};

function getDateRange(period: TimePeriod, customStart: string, customEnd: string): { start: Date; end: Date } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'day':
      return { start: todayStart, end: new Date(todayStart.getTime() + 86400000 - 1) };
    case 'week': {
      const dayOfWeek = todayStart.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(todayStart);
      weekStart.setDate(todayStart.getDate() + mondayOffset);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      return { start: weekStart, end: weekEnd };
    }
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      };
    default: {
      const s = new Date(customStart);
      s.setHours(0, 0, 0, 0);
      const e = new Date(customEnd);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
  }
}

const formatMNT = (amountMnt: number) => formatMntAmount(amountMnt);

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

type ReportBooking = {
  id: string; bookingNumber: string; userId: string; checkIn: string; checkOut: string;
  nights: number; guests: number; status: string;
  basePricePerNight: number; totalBase: number; extraPersonFee: number; servicesTotal: number;
  discountAmount: number; taxAmount: number; serviceChargeAmount: number; totalAmount: number;
  currency: string; refundStatus: string; refundAmount: number | null;
  user: { id: string; name: string; email: string };
  roomNumbers: string[];
};

export function ReportPanel() {
  const { userEmail, userDisplayName, userRole } = useAuth();
  const [reportType, setReportType] = useState<ReportType>('booking');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState<ReportBooking[]>([]);
  const [metrics, setMetrics] = useState({ totalBookings: 0, totalRevenue: 0, paidAmount: 0, refundedAmount: 0 });
  const reportRef = useRef<HTMLDivElement>(null);

  const defaultStart = new Date();
  defaultStart.setDate(1);
  defaultStart.setMonth(defaultStart.getMonth() - 1);
  const [customStartDate, setCustomStartDate] = useState(defaultStart.toISOString().slice(0, 10));
  const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().slice(0, 10));

  const generatedAt = useMemo(() => new Date().toLocaleString('mn-MN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }), []);

  const generatedByName = userDisplayName || userEmail || 'Тодорхойгүй';
  const generatedByRole = userRole === 'ADMIN' ? 'Админ' : userRole === 'STAFF' ? 'Ажилтан' : 'Хэрэглэгч';

  const dateRange = useMemo(
    () => getDateRange(timePeriod, customStartDate, customEndDate),
    [timePeriod, customStartDate, customEndDate]
  );

  // Fetch from /api/reports
  useEffect(() => {
    const from = dateRange.start.toISOString().slice(0, 10);
    const to = dateRange.end.toISOString().slice(0, 10);
    const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
    fetch(`/api/reports?from=${from}&to=${to}${statusParam}`)
      .then((r) => r.json())
      .then((json) => {
        const data: ReportBooking[] = (json.data ?? []).map((b: any) => ({
          ...b,
          checkIn: typeof b.checkIn === 'string' ? b.checkIn.slice(0, 10) : b.checkIn,
          checkOut: typeof b.checkOut === 'string' ? b.checkOut.slice(0, 10) : b.checkOut,
          roomNumbers: b.roomNumbers ?? [],
        }));
        setFilteredBookings(data);
        const summary = json.summary ?? {};
        setMetrics({
          totalBookings: summary.totalBookings ?? data.length,
          totalRevenue: (summary.totalRevenue ?? 0) * USD_MNT_RATE,
          paidAmount: (summary.paidAmount ?? 0) * USD_MNT_RATE,
          refundedAmount: (summary.refundedAmount ?? 0) * USD_MNT_RATE,
        });
      })
      .catch(() => {});
  }, [dateRange, statusFilter]);

  const periodLabel = useMemo(() => {
    switch (timePeriod) {
      case 'day': return `Өнөөдөр (${dateRange.start.toLocaleDateString('mn-MN')})`;
      case 'week': return `Энэ долоо хоног (${dateRange.start.toLocaleDateString('mn-MN')} - ${dateRange.end.toLocaleDateString('mn-MN')})`;
      case 'month': return `Энэ сар (${dateRange.start.toLocaleDateString('mn-MN')} - ${dateRange.end.toLocaleDateString('mn-MN')})`;
      case 'year': return `Энэ жил (${dateRange.start.getFullYear()})`;
      default: return `${customStartDate} - ${customEndDate}`;
    }
  }, [timePeriod, dateRange, customStartDate, customEndDate]);

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
      const typeLabel = reportType === 'booking' ? 'booking' : 'payment';
      pdf.save(`report-${typeLabel}-${timePeriod}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = useCallback(() => {
    if (!reportRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = reportRef.current.innerHTML;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${reportType === 'booking' ? 'Захиалгын тайлан' : 'Төлбөрийн тайлан'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; padding: 20mm; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { padding: 6px 8px; text-align: left; }
    th { font-weight: 700; border-bottom: 2px solid #e5e7eb; }
    td { border-bottom: 1px solid #e5e7eb; }
    .text-right { text-align: right; }
    .font-bold, .font-black { font-weight: 700; }
    .text-brand { color: #335c58; }
    .text-green-700 { color: #15803d; }
    .text-red-600 { color: #dc2626; }
    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-900 { color: #111827; }
    h1 { font-size: 24px; text-transform: uppercase; letter-spacing: -0.5px; }
    h2 { font-size: 18px; }
    h3 { font-size: 11px; text-transform: uppercase; font-weight: 700; background: #f3f4f6; padding: 4px 12px; margin-bottom: 12px; }
    @media print {
      body { padding: 10mm; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body>${content}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }, [reportType]);

  const handleExportExcel = useCallback(() => {
    const BOM = '\uFEFF';
    let csv = '';

    if (reportType === 'booking') {
      csv += ['Захиалгын дугаар', 'Орох огноо', 'Гарах огноо', 'Шөнө', 'Зочны нэр', 'Имэйл', 'Өрөө', 'Нийт дүн (₮)', 'Төлөв'].map(escapeCSV).join(',') + '\n';
      filteredBookings.forEach((b) => {
        const u = b.user;
        const roomNums = (b.roomNumbers ?? []).join('; ');
        const statusLabel = STATUS_OPTIONS.find((s) => s.value === b.status)?.label || b.status;
        csv += [
          b.bookingNumber,
          b.checkIn,
          b.checkOut,
          String(b.nights),
          u?.name || 'Тодорхойгүй',
          u?.email || '-',
          roomNums,
          String(Math.round(b.totalAmount * USD_MNT_RATE)),
          statusLabel,
        ].map(escapeCSV).join(',') + '\n';
      });
    } else {
      csv += ['Захиалгын дугаар', 'Огноо', 'Зочны нэр', 'Үндсэн үнэ (₮)', 'Нэмэлт (₮)', 'Хөнгөлөлт (₮)', 'Татвар+Үйлч. (₮)', 'Нийт дүн (₮)', 'Буцаалт (₮)'].map(escapeCSV).join(',') + '\n';
      filteredBookings.forEach((b) => {
        const u = b.user;
        csv += [
          b.bookingNumber,
          b.checkIn,
          u?.name || 'Тодорхойгүй',
          String(Math.round(b.totalBase * USD_MNT_RATE)),
          String(Math.round((b.extraPersonFee + b.servicesTotal) * USD_MNT_RATE)),
          String(Math.round(b.discountAmount * USD_MNT_RATE)),
          String(Math.round((b.taxAmount + b.serviceChargeAmount) * USD_MNT_RATE)),
          String(Math.round(b.totalAmount * USD_MNT_RATE)),
          String(Math.round((b.refundAmount || 0) * USD_MNT_RATE)),
        ].map(escapeCSV).join(',') + '\n';
      });
    }

    // Add metadata rows at the end
    csv += '\n';
    csv += `${escapeCSV('Тайлан үүсгэсэн')},${escapeCSV(generatedAt)}\n`;
    csv += `${escapeCSV('Үүсгэсэн')},${escapeCSV(`${generatedByName} (${generatedByRole})`)}\n`;
    csv += `${escapeCSV('Хугацаа')},${escapeCSV(periodLabel)}\n`;
    if (statusFilter !== 'all') {
      csv += `${escapeCSV('Төлөв шүүлт')},${escapeCSV(STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label || '')}\n`;
    }

    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const typeLabel = reportType === 'booking' ? 'захиалга' : 'төлбөр';
    link.download = `тайлан-${typeLabel}-${timePeriod}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [reportType, filteredBookings, timePeriod, generatedAt, generatedByName, generatedByRole, periodLabel, statusFilter]);

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-gray-100/30 p-6 md:p-8">
      {/* CONTROLS BAR */}
      <div className="w-full max-w-[210mm] overflow-hidden border border-gray-200 bg-white p-4 rounded-xl shadow-sm mb-6 space-y-4">
        {/* Row 1: Report type + Export buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setReportType('booking')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all whitespace-nowrap',
                reportType === 'booking' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <FileText className="h-4 w-4 shrink-0" /> Захиалгын тайлан
            </button>
            <button
              onClick={() => setReportType('payment')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all whitespace-nowrap',
                reportType === 'payment' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <CreditCard className="h-4 w-4 shrink-0" /> Төлбөрийн тайлан
            </button>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Button onClick={handlePrint} variant="outline" className="gap-1.5 font-bold text-xs px-3">
              <Printer className="h-3.5 w-3.5" /> Хэвлэх
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="gap-1.5 font-bold text-xs px-3">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </Button>
            <Button onClick={handleExportPdf} disabled={isGeneratingPdf} className="bg-brand hover:bg-brand-hover gap-1.5 font-bold text-xs px-3">
              <Download className="h-3.5 w-3.5" /> {isGeneratingPdf ? 'Боловсруулж...' : 'PDF'}
            </Button>
          </div>
        </div>

        {/* Row 2: Time period + Status filter */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          {/* Time period quick buttons */}
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Хугацааны нэгж</label>
            <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
              {([
                { key: 'day', label: 'Өдөр' },
                { key: 'week', label: '7 хоног' },
                { key: 'month', label: 'Сар' },
                { key: 'year', label: 'Жил' },
                { key: 'custom', label: 'Сонгох' },
              ] as { key: TimePeriod; label: string }[]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setTimePeriod(p.key)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap',
                    timePeriod === p.key ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range (only visible when custom) */}
          {timePeriod === 'custom' && (
            <div className="flex flex-wrap gap-3 min-w-0">
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Эхлэх</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full min-w-0 rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs shadow-sm focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Дуусах</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full min-w-0 rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs shadow-sm focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status filter */}
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
              <Filter className="mr-1 inline h-3 w-3" />Төлвөөр шүүх
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
              className="w-full min-w-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* REPORT PREVIEW (A4) */}
      <div className="w-full max-w-[210mm] pb-10">
        <div ref={reportRef} className="mx-auto bg-white text-black shadow-lg" style={{ minHeight: '297mm', padding: '20mm' }}>
          {/* Header */}
          <div className="mb-6 flex justify-between border-b-2 border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">
                {reportType === 'booking' ? 'Захиалгын тайлан' : 'Төлбөрийн тайлан'}
              </h1>
              <p className="mt-1 font-semibold text-gray-500">Хугацаа: {periodLabel}</p>
              {statusFilter !== 'all' && (
                <p className="mt-0.5 text-sm text-gray-400">
                  Төлөв: {STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label}
                </p>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">UbHotel ХХК</h2>
            </div>
          </div>

          {/* Report metadata */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-500">Үүсгэсэн огноо:</span>
                <span className="font-semibold text-gray-800">{generatedAt}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-500">Хугацааны муж:</span>
                <span className="font-semibold text-gray-800">{dateRange.start.toLocaleDateString('mn-MN')} — {dateRange.end.toLocaleDateString('mn-MN')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-500">Үүсгэсэн:</span>
                <span className="font-semibold text-gray-800">{generatedByName}</span>
                <span className="rounded bg-brand/10 px-1.5 py-0.5 text-xs font-bold text-brand">{generatedByRole}</span>
              </div>
            </div>
          </div>

          {/* Summary metrics */}
          <h3 className="mb-4 bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-800">Ерөнхий үзүүлэлт</h3>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-gray-500">
                <BarChart3 className="h-3.5 w-3.5" /> Нийт захиалга
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalBookings}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-gray-500">
                <TrendingUp className="h-3.5 w-3.5" /> Нийт орлого
              </div>
              <div className="mt-2 break-words text-xl font-bold text-brand sm:text-2xl">{formatMNT(metrics.totalRevenue)}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-gray-500">
                <CreditCard className="h-3.5 w-3.5" /> Төлөгдсөн дүн
              </div>
              <div className="mt-2 break-words text-xl font-bold text-green-700 sm:text-2xl">{formatMNT(metrics.paidAmount)}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-gray-500">
                <RefreshCw className="h-3.5 w-3.5" /> Буцаасан дүн
              </div>
              <div className="mt-2 break-words text-xl font-bold text-red-600 sm:text-2xl">{formatMNT(metrics.refundedAmount)}</div>
            </div>
          </div>

          {/* Detail Table */}
          <h3 className="mb-4 bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-800">
            {reportType === 'booking' ? 'Захиалгын жагсаалт' : 'Төлбөрийн жагсаалт'}
          </h3>

          {filteredBookings.length === 0 ? (
            <div className="py-10 text-center italic text-gray-400">
              Энэ хугацаанд ямар нэгэн захиалга бүртгэгдээгүй байна.
            </div>
          ) : reportType === 'booking' ? (
            /* BOOKING REPORT TABLE */
            <table className="mb-8 w-full min-w-0 table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 font-bold text-gray-600">
                  <th className="py-2 pl-2">Захиалга</th>
                  <th className="py-2">Огноо</th>
                  <th className="py-2">Зочин</th>
                  <th className="py-2">Өрөө</th>
                  <th className="py-2 text-right">Дүн (₮)</th>
                  <th className="py-2 pr-2 text-right">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const u = b.user;
                  return (
                    <tr key={b.id} className="border-b border-gray-200">
                      <td className="py-2.5 pl-2">
                        <div className="font-mono text-xs font-bold text-gray-900">{b.bookingNumber}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-gray-900">{b.checkIn}</div>
                        <div className="text-xs text-gray-400">- {b.checkOut} ({b.nights} шөнө)</div>
                      </td>
                      <td className="py-2.5">
                        <div className="font-medium text-gray-800">{u?.name || 'Тодорхойгүй'}</div>
                        <div className="text-xs text-gray-500">{u?.email || '-'}</div>
                      </td>
                      <td className="py-2.5 text-xs font-bold text-gray-600">
                        {(b.roomNumbers ?? []).join(', ')}
                      </td>
                      <td className="max-w-[20%] break-words py-2.5 text-right font-black text-brand">
                        {formatMntFromUsd(b.totalAmount)}
                      </td>
                      <td className="py-2.5 pr-2 text-right">
                        <Badge variant={STATUS_BADGE_MAP[b.status] || 'neutral'}>
                          {STATUS_OPTIONS.find((s) => s.value === b.status)?.label || b.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* PAYMENT REPORT TABLE */
            <table className="mb-8 w-full min-w-0 table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 font-bold text-gray-600">
                  <th className="py-2 pl-2">Захиалга</th>
                  <th className="py-2">Зочин</th>
                  <th className="py-2 text-right">Үндсэн үнэ</th>
                  <th className="py-2 text-right">Нэмэлт</th>
                  <th className="py-2 text-right">Хөнгөлөлт</th>
                  <th className="py-2 text-right">Татвар + Үйлч.</th>
                  <th className="py-2 text-right">Нийт дүн</th>
                  <th className="py-2 pr-2 text-right">Буцаалт</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const u = b.user;
                  return (
                    <tr key={b.id} className="border-b border-gray-200">
                      <td className="py-2.5 pl-2">
                        <div className="font-mono text-xs font-bold text-gray-900">{b.bookingNumber}</div>
                        <div className="text-[10px] text-gray-400">{b.checkIn}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="text-sm font-medium text-gray-800">{u?.name || 'Тодорхойгүй'}</div>
                      </td>
                      <td className="py-2.5 text-right text-sm text-gray-700">
                        {formatMntFromUsd(b.totalBase)}
                      </td>
                      <td className="py-2.5 text-right text-sm text-gray-700">
                        {formatMntFromUsd(b.extraPersonFee + b.servicesTotal)}
                      </td>
                      <td className="py-2.5 text-right text-sm text-green-700">
                        {b.discountAmount > 0 ? `-${formatMntFromUsd(b.discountAmount)}` : '-'}
                      </td>
                      <td className="py-2.5 text-right text-sm text-gray-700">
                        {formatMntFromUsd(b.taxAmount + b.serviceChargeAmount)}
                      </td>
                      <td className="py-2.5 text-right font-black text-brand">
                        {formatMntFromUsd(b.totalAmount)}
                      </td>
                      <td className="py-2.5 pr-2 text-right">
                        {b.refundAmount && b.refundAmount > 0 ? (
                          <span className="font-bold text-red-600">{formatMntFromUsd(b.refundAmount)}</span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                  <td className="py-3 pl-2" colSpan={2}>Нийт</td>
                  <td className="py-3 text-right text-gray-700">
                    {formatMNT(filteredBookings.reduce((s, b) => s + b.totalBase * USD_MNT_RATE, 0))}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {formatMNT(filteredBookings.reduce((s, b) => s + (b.extraPersonFee + b.servicesTotal) * USD_MNT_RATE, 0))}
                  </td>
                  <td className="py-3 text-right text-green-700">
                    -{formatMNT(filteredBookings.reduce((s, b) => s + b.discountAmount * USD_MNT_RATE, 0))}
                  </td>
                  <td className="py-3 text-right text-gray-700">
                    {formatMNT(filteredBookings.reduce((s, b) => s + (b.taxAmount + b.serviceChargeAmount) * USD_MNT_RATE, 0))}
                  </td>
                  <td className="py-3 text-right text-brand">
                    {formatMNT(metrics.totalRevenue)}
                  </td>
                  <td className="py-3 pr-2 text-right text-red-600">
                    {formatMNT(metrics.refundedAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* Footer */}
          <div className="mt-20 border-t border-gray-200 pt-8 text-xs text-gray-400">
            <p>UbHotel ХХК Удирдлагын өмч</p>
            <p className="mt-2">Тайлан үүсгэсэн: {generatedByName} ({generatedByRole}) | {generatedAt}</p>
            <p className="mt-4">Баталгаажуулсан гарын үсэг: _______________________ Огноо: ________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}
