import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/rooms/:id
 * Өрөөний бүрэн мэдээлэл + буудал + байршил
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      hotel: {
        include: {
          location: { select: { id: true, name: true, nameMn: true } },
        },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: 'Өрөө олдсонгүй' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: room.id,
      hotelId: room.hotelId,
      typeCode: room.typeCode,
      typeName: room.typeName,
      typeNameMn: room.typeNameMn,
      floor: room.floor,
      number: room.number,
      status: room.status,
      basePricePerNight: room.basePricePerNight,
      maxGuests: room.maxGuests,
      maxExtraBeds: room.maxExtraBeds,
      beds: room.beds,
      amenities: room.amenities,
      sizeSqm: room.sizeSqm,
      recommended: room.recommended,
      description: room.description,
      descriptionMn: room.descriptionMn,
      imageUrls: room.imageUrls,
      hotel: {
        id: room.hotel.id,
        name: room.hotel.name,
        nameMn: room.hotel.nameMn,
        slug: room.hotel.slug,
        address: room.hotel.address,
        starRating: room.hotel.starRating,
        amenities: room.hotel.amenities,
        imageUrls: room.hotel.imageUrls,
        location: room.hotel.location,
      },
    },
  });
}

/**
 * PUT /api/rooms/:id
 * Body: { status?, typeName?, basePricePerNight?, beds?, sizeSqm?, ... }
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      status, typeName, typeNameMn, basePricePerNight, floor, number,
      maxGuests, maxExtraBeds, beds, sizeSqm, amenities,
      recommended, description, descriptionMn, imageUrls,
    } = body;

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(typeName !== undefined && { typeName }),
        ...(typeNameMn !== undefined && { typeNameMn }),
        ...(basePricePerNight !== undefined && { basePricePerNight }),
        ...(floor !== undefined && { floor }),
        ...(number !== undefined && { number }),
        ...(maxGuests !== undefined && { maxGuests }),
        ...(maxExtraBeds !== undefined && { maxExtraBeds }),
        ...(beds !== undefined && { beds }),
        ...(sizeSqm !== undefined && { sizeSqm }),
        ...(amenities !== undefined && { amenities }),
        ...(recommended !== undefined && { recommended }),
        ...(description !== undefined && { description }),
        ...(descriptionMn !== undefined && { descriptionMn }),
        ...(imageUrls !== undefined && { imageUrls }),
      },
    });

    return NextResponse.json({ data: room });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Өрөө олдсонгүй' }, { status: 404 });
    }
    console.error('PUT /api/rooms/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}

/**
 * DELETE /api/rooms/:id
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Өрөө олдсонгүй' }, { status: 404 });
    }
    console.error('DELETE /api/rooms/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
