import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DB role (жижиг) -> Frontend role (том)
const ROLE_MAP: Record<string, string> = {
  guest: 'GUEST',
  staff: 'STAFF',
  admin: 'ADMIN',
  hotel_owner: 'ADMIN',
};

/**
 * POST /api/auth/login
 * Body: { identifier, password }  — identifier нь имэйл эсвэл утасны дугаар
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = (body.identifier || body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!identifier) {
      return NextResponse.json({ error: 'Имэйл эсвэл утас шаардлагатай' }, { status: 400 });
    }

    // Имэйл эсвэл утасны дугаараар хайх
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        locale: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Имэйл/утас эсвэл нууц үг буруу' }, { status: 401 });
    }

    // Нууц үг шалгах (password байвал шалгана, байхгүй бол алгасна)
    if (user.password && password !== user.password) {
      return NextResponse.json({ error: 'Имэйл/утас эсвэл нууц үг буруу' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      data: {
        ...safeUser,
        frontendRole: ROLE_MAP[user.role] || 'GUEST',
      },
    });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
