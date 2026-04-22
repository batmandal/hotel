import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/auth/signup
 * Body: { email, name, password, phone? }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, password, phone } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'email, name, password шаардлагатай' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Нууц үг хамгийн багадаа 6 тэмдэгт' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Энэ имэйл бүртгэлтэй байна' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // Production-д bcrypt.hash() ашиглах
        phone: phone || null,
        role: 'guest',
        locale: 'mn',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        locale: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (err) {
    console.error('POST /api/auth/signup error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
