import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/bookings/:id
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      hotel: { select: { id: true, name: true, slug: true } },
      rooms: {
        select: { room: { select: { id: true, number: true, typeName: true, floor: true } } },
      },
      services: {
        select: {
          id: true,
          quantity: true,
          totalPrice: true,
          service: { select: { id: true, name: true, nameMn: true, price: true } },
        },
      },
      discount: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...booking,
      roomIds: booking.rooms.map((br) => br.room.id),
      roomDetails: booking.rooms.map((br) => br.room),
      rooms: undefined,
    },
  });
}

/**
 * PUT /api/bookings/:id
 * Body: { status?, guests?, checkIn?, checkOut?, specialRequests?, refundStatus?, refundAmount?, ... }
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      status, guests, extraBeds, checkIn, checkOut,
      specialRequests, refundStatus, refundAmount,
      totalAmount, discountAmount, taxAmount, serviceChargeAmount,
    } = body;

    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (guests !== undefined) updateData.guests = guests;
    if (extraBeds !== undefined) updateData.extraBeds = extraBeds;
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
    if (refundStatus !== undefined) updateData.refundStatus = refundStatus;
    if (refundAmount !== undefined) updateData.refundAmount = refundAmount;
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
    if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
    if (taxAmount !== undefined) updateData.taxAmount = taxAmount;
    if (serviceChargeAmount !== undefined) updateData.serviceChargeAmount = serviceChargeAmount;

    if (checkIn !== undefined) {
      updateData.checkIn = new Date(checkIn);
    }
    if (checkOut !== undefined) {
      updateData.checkOut = new Date(checkOut);
    }
    if (checkIn !== undefined || checkOut !== undefined) {
      const existing = await prisma.booking.findUnique({ where: { id }, select: { checkIn: true, checkOut: true } });
      if (existing) {
        const ci = checkIn ? new Date(checkIn) : existing.checkIn;
        const co = checkOut ? new Date(checkOut) : existing.checkOut;
        updateData.nights = Math.max(1, Math.ceil((co.getTime() - ci.getTime()) / 86400000));
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
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
    });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 });
    }
    console.error('PUT /api/bookings/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}

/**
 * DELETE /api/bookings/:id
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 });
    }
    console.error('DELETE /api/bookings/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
