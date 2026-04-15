import { NextRequest, NextResponse } from 'next/server';
import { users, bookings } from '@/data/mockData';

/**
 * GET /api/users/:id
 * Тухайн хэрэглэгчийн мэдээлэл + захиалгын түүх
 */
export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return params.then(({ id }) => {
    const user = users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const userBookings = bookings
      .filter((b) => b.userId === id)
      .map(({ id, bookingNumber, hotelId, roomIds, checkIn, checkOut, nights, guests, status, totalAmount, currency, createdAt }) => ({
        id,
        bookingNumber,
        hotelId,
        roomIds,
        checkIn,
        checkOut,
        nights,
        guests,
        status,
        totalAmount,
        currency,
        createdAt,
      }));

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone ?? null,
        role: user.role,
        locale: user.locale,
        createdAt: user.createdAt,
        bookings: userBookings,
      },
    });
  });
}
