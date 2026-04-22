import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/staff
 * Query params: hotelId, department, q
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hotelId = searchParams.get('hotelId');
  const department = searchParams.get('department');
  const q = searchParams.get('q')?.trim().toLowerCase();

  const where: any = {};
  if (hotelId) where.hotelId = hotelId;
  if (department) where.department = { contains: department, mode: 'insensitive' };
  if (q) {
    where.user = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    };
  }

  const staffMembers = await prisma.staffMember.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
      hotel: { select: { id: true, name: true } },
    },
    orderBy: { department: 'asc' },
  });

  const data = staffMembers.map((s) => ({
    id: s.id,
    userId: s.userId,
    hotelId: s.hotelId,
    department: s.department,
    position: s.position,
    permissions: s.permissions,
    user: s.user,
    hotelName: s.hotel.name,
  }));

  return NextResponse.json({ data, total: data.length });
}

/**
 * POST /api/staff
 * Body: { userId, hotelId, department, position, permissions[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, hotelId, department, position, permissions } = body;

    if (!userId || !hotelId || !department || !position) {
      return NextResponse.json({ error: 'userId, hotelId, department, position шаардлагатай' }, { status: 400 });
    }

    const staff = await prisma.staffMember.create({
      data: {
        userId,
        hotelId,
        department,
        position,
        permissions: permissions ?? [],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        hotel: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: staff }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Энэ хэрэглэгч аль хэдийн ажилтнаар бүртгэгдсэн' }, { status: 409 });
    }
    console.error('POST /api/staff error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
