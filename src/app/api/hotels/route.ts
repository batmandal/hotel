import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/hotels
 * Query params: q, category, locationId
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q')?.trim().toLowerCase();
  const category = searchParams.get('category');
  const locationId = searchParams.get('locationId');

  const where: any = {};
  if (category) where.category = category;
  if (locationId) where.locationId = locationId;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { address: { contains: q, mode: 'insensitive' } },
    ];
  }

  const hotels = await prisma.hotel.findMany({
    where,
    include: {
      location: { select: { id: true, name: true, nameMn: true, country: true } },
      _count: { select: { rooms: true } },
    },
    orderBy: { starRating: 'desc' },
  });

  const data = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    nameMn: h.nameMn,
    slug: h.slug,
    address: h.address,
    category: h.category,
    starRating: h.starRating,
    description: h.description,
    descriptionMn: h.descriptionMn,
    amenities: h.amenities,
    imageUrls: h.imageUrls,
    contactEmail: h.contactEmail,
    contactPhone: h.contactPhone,
    basePricePerNight: h.basePricePerNight,
    currency: h.currency,
    location: h.location,
    roomCount: h._count.rooms,
  }));

  return NextResponse.json({ data, total: data.length });
}

/**
 * POST /api/hotels
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotel = await prisma.hotel.create({ data: body });
    return NextResponse.json({ data: hotel }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug давхардсан байна' }, { status: 409 });
    }
    console.error('POST /api/hotels error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
