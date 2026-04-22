import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/bookings
 * Query params: hotelId, userId, status, from, to, q
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hotelId = searchParams.get('hotelId');
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const q = searchParams.get('q')?.trim().toLowerCase();

  const where: any = {};

  if (hotelId) where.hotelId = hotelId;
  if (userId) where.userId = userId;
  if (status) where.status = status;

  if (from || to) {
    where.checkIn = {};
    if (from) where.checkIn.gte = new Date(from);
    if (to) where.checkIn.lte = new Date(to);
  }

  if (q) {
    where.OR = [
      { bookingNumber: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      rooms: {
        select: { room: { select: { id: true, number: true, typeName: true } } },
      },
      discount: { select: { id: true, code: true, type: true, value: true } },
    },
    orderBy: { checkIn: 'desc' },
  });

  const data = bookings.map((b) => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    userId: b.userId,
    hotelId: b.hotelId,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: b.nights,
    guests: b.guests,
    extraBeds: b.extraBeds,
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
    specialRequests: b.specialRequests,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    user: b.user,
    roomIds: b.rooms.map((br) => br.room.id),
    roomNumbers: b.rooms.map((br) => br.room.number),
    discount: b.discount,
  }));

  return NextResponse.json({ data, total: data.length });
}

/**
 * POST /api/bookings
 * Body: { userId, hotelId, roomIds[], checkIn, checkOut, guests, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId, hotelId, roomIds, checkIn, checkOut,
      guests, extraBeds, basePricePerNight,
      totalBase, extraPersonFee, servicesTotal,
      discountAmount, taxAmount, serviceChargeAmount,
      totalAmount, currency, discountId, specialRequests,
    } = body;

    if (!userId || !hotelId || !roomIds?.length || !checkIn || !checkOut || !totalAmount) {
      return NextResponse.json(
        { error: 'userId, hotelId, roomIds, checkIn, checkOut, totalAmount шаардлагатай' },
        { status: 400 },
      );
    }

    const ciDate = new Date(checkIn);
    const coDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((coDate.getTime() - ciDate.getTime()) / 86400000));

    // Захиалгын дугаар үүсгэх
    const lastBooking = await prisma.booking.findFirst({
      orderBy: { bookingNumber: 'desc' },
      select: { bookingNumber: true },
    });
    const lastNum = lastBooking ? parseInt(lastBooking.bookingNumber.replace('BK', ''), 10) : 0;
    const bookingNumber = `BK${String(lastNum + 1).padStart(6, '0')}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        hotelId,
        checkIn: ciDate,
        checkOut: coDate,
        nights,
        guests: guests ?? 1,
        extraBeds: extraBeds ?? 0,
        status: 'pending',
        basePricePerNight: basePricePerNight ?? 0,
        totalBase: totalBase ?? 0,
        extraPersonFee: extraPersonFee ?? 0,
        servicesTotal: servicesTotal ?? 0,
        discountAmount: discountAmount ?? 0,
        taxAmount: taxAmount ?? 0,
        serviceChargeAmount: serviceChargeAmount ?? 0,
        totalAmount,
        currency: currency ?? 'USD',
        discountId: discountId ?? null,
        specialRequests: specialRequests ?? null,
        rooms: {
          create: (roomIds as string[]).map((roomId: string) => ({ roomId })),
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        rooms: { select: { room: { select: { id: true, number: true } } } },
      },
    });

    return NextResponse.json({
      data: {
        ...booking,
        roomIds: booking.rooms.map((br) => br.room.id),
        roomNumbers: booking.rooms.map((br) => br.room.number),
      },
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
