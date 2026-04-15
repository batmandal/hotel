import { NextRequest, NextResponse } from 'next/server';
import { getRoomById, getHotelById, getLocationById } from '@/data/mockData';

/**
 * GET /api/rooms/:id
 * Тухайн өрөөний бүрэн мэдээлэл + буудлын мэдээлэл
 */
export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return params.then(({ id }) => {
    const room = getRoomById(id);

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 },
      );
    }

    const hotel = getHotelById(room.hotelId);
    const location = hotel ? getLocationById(hotel.locationId) : undefined;

    return NextResponse.json({
      data: {
        id: room.id,
        hotelId: room.hotelId,
        typeCode: room.typeCode,
        typeName: room.typeName,
        floor: room.floor,
        number: room.number,
        status: room.status,
        basePricePerNight: room.basePricePerNight,
        maxGuests: room.maxGuests,
        maxExtraBeds: room.maxExtraBeds,
        beds: room.beds ?? null,
        amenities: room.amenities,
        sizeSqm: room.sizeSqm ?? null,
        recommended: room.recommended ?? false,
        description: room.description ?? null,
        descriptionMn: room.descriptionMn ?? null,
        imageUrls: room.imageUrls ?? [],
        hotel: hotel
          ? {
              id: hotel.id,
              name: hotel.name,
              nameMn: hotel.nameMn ?? null,
              slug: hotel.slug,
              address: hotel.address,
              starRating: hotel.starRating,
              amenities: hotel.amenities,
              imageUrls: hotel.imageUrls,
              location: location
                ? { id: location.id, name: location.name, nameMn: location.nameMn ?? null }
                : null,
            }
          : null,
      },
    });
  });
}
