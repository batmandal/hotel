import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/users/:id
 * Хэрэглэгчийн мэдээлэл + захиалгын түүх
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      locale: true,
      createdAt: true,
      bookings: {
        select: {
          id: true,
          bookingNumber: true,
          hotelId: true,
          checkIn: true,
          checkOut: true,
          nights: true,
          guests: true,
          status: true,
          totalAmount: true,
          currency: true,
          createdAt: true,
          rooms: {
            select: { room: { select: { id: true, number: true, typeName: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
  }

  const data = {
    ...user,
    bookings: user.bookings.map((b) => ({
      ...b,
      roomIds: b.rooms.map((br) => br.room.id),
      roomNumbers: b.rooms.map((br) => br.room.number),
      rooms: undefined,
    })),
  };

  return NextResponse.json({ data });
}

/**
 * PUT /api/users/:id
 * Body: { name?, phone?, email?, role?, locale? }
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, phone, email, role, locale } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(locale !== undefined && { locale }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
    }
    console.error('PUT /api/users/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}

/**
 * DELETE /api/users/:id
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
    }
    console.error('DELETE /api/users/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
