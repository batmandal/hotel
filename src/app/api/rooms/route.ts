import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/rooms
 * Query params: hotelId, type, status, minGuests, recommended, q
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hotelId = searchParams.get('hotelId');
  const type = searchParams.get('type')?.toLowerCase();
  const status = searchParams.get('status');
  const minGuests = searchParams.get('minGuests');
  const recommended = searchParams.get('recommended');
  const q = searchParams.get('q')?.trim().toLowerCase();

  const where: any = {};

  if (hotelId) where.hotelId = hotelId;
  if (status) where.status = status;
  if (recommended === 'true') where.recommended = true;
  if (minGuests) {
    const n = parseInt(minGuests, 10);
    if (!Number.isNaN(n) && n > 0) where.maxGuests = { gte: n };
  }

  if (type && type !== 'all') {
    where.typeName = { contains: type, mode: 'insensitive' };
  }

  if (q) {
    where.OR = [
      { typeName: { contains: q, mode: 'insensitive' } },
      { number: { contains: q, mode: 'insensitive' } },
    ];
  }

  const rooms = await prisma.room.findMany({
    where,
    include: {
      hotel: {
        select: { id: true, name: true, slug: true, starRating: true },
      },
    },
    orderBy: [{ floor: 'asc' }, { number: 'asc' }],
  });

  const data = rooms.map((r) => ({
    id: r.id,
    hotelId: r.hotelId,
    hotelName: r.hotel.name,
    hotelSlug: r.hotel.slug,
    hotelStarRating: r.hotel.starRating,
    typeCode: r.typeCode,
    typeName: r.typeName,
    floor: r.floor,
    number: r.number,
    status: r.status,
    basePricePerNight: r.basePricePerNight,
    maxGuests: r.maxGuests,
    maxExtraBeds: r.maxExtraBeds,
    beds: r.beds,
    amenities: r.amenities,
    sizeSqm: r.sizeSqm,
    recommended: r.recommended,
    description: r.description,
    descriptionMn: r.descriptionMn,
    imageUrls: r.imageUrls,
  }));

  return NextResponse.json({ data, total: data.length });
}

/**
 * POST /api/rooms
 * Body: { hotelId, typeCode, typeName, floor, number, basePricePerNight, maxGuests, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelId, typeCode, typeName, floor, number,
      basePricePerNight, maxGuests, maxExtraBeds,
      beds, sizeSqm, amenities, recommended,
      description, descriptionMn, imageUrls,
      status,
    } = body;

    if (!hotelId || !typeCode || !typeName || !number || !basePricePerNight) {
      return NextResponse.json({ error: 'hotelId, typeCode, typeName, number, basePricePerNight шаардлагатай' }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        hotelId,
        typeCode,
        typeName,
        floor: floor ?? 1,
        number,
        status: status || 'available',
        basePricePerNight,
        maxGuests: maxGuests ?? 2,
        maxExtraBeds: maxExtraBeds ?? 0,
        beds: beds ?? null,
        sizeSqm: sizeSqm ?? null,
        amenities: amenities ?? [],
        recommended: recommended ?? false,
        description: description ?? null,
        descriptionMn: descriptionMn ?? null,
        imageUrls: imageUrls ?? [],
      },
    });

    return NextResponse.json({ data: room }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Энэ дугаартай өрөө аль хэдийн байна' }, { status: 409 });
    }
    console.error('POST /api/rooms error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
