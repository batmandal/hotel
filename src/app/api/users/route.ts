import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/users
 * Query params: role, q (search)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get('role');
  const q = searchParams.get('q')?.trim().toLowerCase();

  const where: any = {};

  if (role) {
    where.role = role;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      locale: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ data: users, total: users.length });
}

/**
 * POST /api/users
 * Body: { email, name, phone?, password?, role?, locale? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, password, role, locale } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'email, name шаардлагатай' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Энэ имэйл бүртгэлтэй байна' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        password: password || null,
        role: role || 'guest',
        locale: locale || 'mn',
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
    console.error('POST /api/users error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
