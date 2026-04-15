import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/data/mockData';

/**
 * GET /api/users
 * Query params:
 *   - role: 'guest' | 'staff' | 'admin'  (шүүлт)
 *   - q: string                           (нэр, имэйлээр хайх)
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get('role');
  const q = searchParams.get('q')?.trim().toLowerCase();

  let result = [...users];

  if (role) {
    result = result.filter((u) => u.role === role);
  }

  if (q) {
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone?.toLowerCase().includes(q) ?? false),
    );
  }

  // Нууц үг, мэдрэг мэдээлэл хасах
  const safe = result.map(({ id, email, name, phone, role, locale, createdAt }) => ({
    id,
    email,
    name,
    phone: phone ?? null,
    role,
    locale,
    createdAt,
  }));

  return NextResponse.json({ data: safe, total: safe.length });
}
