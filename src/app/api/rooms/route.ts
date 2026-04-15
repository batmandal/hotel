import { NextRequest, NextResponse } from 'next/server';
import { rooms, getHotelById } from '@/data/mockData';
import type { RoomStatus } from '@/types';

/**
 * GET /api/rooms
 * Query params:
 *   - hotelId: string                     (тухайн буудлын өрөөнүүд)
 *   - type: 'standard'|'deluxe'|'suite'|'twin'|'family'  (нэрээр шүүх)
 *   - status: RoomStatus                  (available, occupied гэх мэт)
 *   - minGuests: number                   (зочдын тоо >= )
 *   - minStars: number                    (буудлын одны зэрэглэл >= )
 *   - recommended: 'true'                 (зөвхөн санал болгосон)
 *   - q: string                           (нэр, дугаараар хайх)
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hotelId = searchParams.get('hotelId');
  const type = searchParams.get('type')?.toLowerCase();
  const status = searchParams.get('status') as RoomStatus | null;
  const minGuests = searchParams.get('minGuests');
  const minStars = searchParams.get('minStars');
  const recommended = searchParams.get('recommended');
  const q = searchParams.get('q')?.trim().toLowerCase();

  let result = [...rooms];

  if (hotelId) {
    result = result.filter((r) => r.hotelId === hotelId);
  }

  if (type && type !== 'all') {
    result = result.filter((r) => r.typeName.toLowerCase().includes(type));
  }

  if (status) {
    result = result.filter((r) => r.status === status);
  }

  if (minGuests) {
    const n = parseInt(minGuests, 10);
    if (!Number.isNaN(n) && n > 0) {
      result = result.filter((r) => r.maxGuests >= n);
    }
  }

  if (minStars) {
    const n = parseInt(minStars, 10);
    if (!Number.isNaN(n) && n > 0) {
      result = result.filter((r) => {
        const hotel = getHotelById(r.hotelId);
        return hotel ? hotel.starRating >= n : false;
      });
    }
  }

  if (recommended === 'true') {
    result = result.filter((r) => r.recommended === true);
  }

  if (q) {
    result = result.filter(
      (r) =>
        r.typeName.toLowerCase().includes(q) ||
        r.number.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    );
  }

  const data = result.map((r) => {
    const hotel = getHotelById(r.hotelId);
    return {
      id: r.id,
      hotelId: r.hotelId,
      hotelName: hotel?.name ?? null,
      hotelSlug: hotel?.slug ?? null,
      hotelStarRating: hotel?.starRating ?? null,
      typeCode: r.typeCode,
      typeName: r.typeName,
      floor: r.floor,
      number: r.number,
      status: r.status,
      basePricePerNight: r.basePricePerNight,
      maxGuests: r.maxGuests,
      maxExtraBeds: r.maxExtraBeds,
      beds: r.beds ?? null,
      amenities: r.amenities,
      sizeSqm: r.sizeSqm ?? null,
      recommended: r.recommended ?? false,
      description: r.description ?? null,
      descriptionMn: r.descriptionMn ?? null,
      imageUrls: r.imageUrls ?? [],
    };
  });

  return NextResponse.json({ data, total: data.length });
}
