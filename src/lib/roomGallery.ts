import type { Hotel, Room } from '@/types';

const FALLBACK_A = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200';
const FALLBACK_B = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200';

/** Өрөөний зураг + зочид буудлын зураг нэгтгэж, хамгийн багадаа 2 URL буцаана */
export function getRoomImageGallery(room: Room, hotel: Hotel): string[] {
  const out: string[] = [];
  for (const u of [...(room.imageUrls ?? []), ...(hotel.imageUrls ?? [])]) {
    if (u && !out.includes(u)) out.push(u);
  }
  if (out.length === 0) return [FALLBACK_A, FALLBACK_B];
  if (out.length === 1) {
    const second = out[0] === FALLBACK_A ? FALLBACK_B : FALLBACK_A;
    if (!out.includes(second)) out.push(second);
  }
  return out;
}
