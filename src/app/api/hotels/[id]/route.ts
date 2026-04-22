import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/hotels/:id
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      location: true,
      rooms: {
        select: { id: true, number: true, typeName: true, status: true, basePricePerNight: true, maxGuests: true, imageUrls: true, recommended: true },
        orderBy: [{ floor: 'asc' }, { number: 'asc' }],
      },
      _count: { select: { bookings: true, rooms: true, staffMembers: true } },
    },
  });

  if (!hotel) {
    return NextResponse.json({ error: 'Буудал олдсонгүй' }, { status: 404 });
  }

  return NextResponse.json({ data: hotel });
}

/**
 * PUT /api/hotels/:id
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const hotel = await prisma.hotel.update({ where: { id }, data: body });
    return NextResponse.json({ data: hotel });
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Буудал олдсонгүй' }, { status: 404 });
    console.error('PUT /api/hotels/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}

/**
 * DELETE /api/hotels/:id
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.hotel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Буудал олдсонгүй' }, { status: 404 });
    console.error('DELETE /api/hotels/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
