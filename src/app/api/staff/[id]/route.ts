import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/staff/:id
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const staff = await prisma.staffMember.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
      hotel: { select: { id: true, name: true } },
    },
  });

  if (!staff) {
    return NextResponse.json({ error: 'Ажилтан олдсонгүй' }, { status: 404 });
  }

  return NextResponse.json({ data: staff });
}

/**
 * PUT /api/staff/:id
 * Body: { department?, position?, permissions? }
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { department, position, permissions } = body;

    const staff = await prisma.staffMember.update({
      where: { id },
      data: {
        ...(department !== undefined && { department }),
        ...(position !== undefined && { position }),
        ...(permissions !== undefined && { permissions }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        hotel: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: staff });
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Ажилтан олдсонгүй' }, { status: 404 });
    console.error('PUT /api/staff/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}

/**
 * DELETE /api/staff/:id
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.staffMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Ажилтан олдсонгүй' }, { status: 404 });
    console.error('DELETE /api/staff/:id error:', err);
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 });
  }
}
