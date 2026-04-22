import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/reports
 * Query params: hotelId, from, to, status, type (booking | payment)
 *
 * Тайлангийн ерөнхий үзүүлэлт + захиалгын жагсаалт
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hotelId = searchParams.get('hotelId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const status = searchParams.get('status');

  const where: any = {};
  if (hotelId) where.hotelId = hotelId;
  if (status && status !== 'all') where.status = status;

  if (from || to) {
    where.checkIn = {};
    if (from) where.checkIn.gte = new Date(from);
    if (to) where.checkIn.lte = new Date(to);
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      rooms: {
        select: { room: { select: { id: true, number: true, typeName: true } } },
      },
    },
    orderBy: { checkIn: 'asc' },
  });

  // Ерөнхий үзүүлэлт тооцоолох
  let totalRevenue = 0;
  let paidAmount = 0;
  let refundedAmount = 0;
  const userSet = new Set<string>();

  bookings.forEach((b) => {
    totalRevenue += b.totalAmount;
    userSet.add(b.userId);

    if (b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'checked_out') {
      paidAmount += b.totalAmount;
    }
    if (b.refundAmount) {
      refundedAmount += b.refundAmount;
    }
  });

  const summary = {
    totalBookings: bookings.length,
    totalRevenue,
    paidAmount,
    refundedAmount,
    uniqueGuests: userSet.size,
  };

  const data = bookings.map((b) => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    userId: b.userId,
    hotelId: b.hotelId,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: b.nights,
    guests: b.guests,
    status: b.status,
    basePricePerNight: b.basePricePerNight,
    totalBase: b.totalBase,
    extraPersonFee: b.extraPersonFee,
    servicesTotal: b.servicesTotal,
    discountAmount: b.discountAmount,
    taxAmount: b.taxAmount,
    serviceChargeAmount: b.serviceChargeAmount,
    totalAmount: b.totalAmount,
    currency: b.currency,
    refundStatus: b.refundStatus,
    refundAmount: b.refundAmount,
    createdAt: b.createdAt,
    user: b.user,
    roomNumbers: b.rooms.map((br) => br.room.number),
  }));

  return NextResponse.json({ summary, data, total: data.length });
}
