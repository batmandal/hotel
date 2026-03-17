/**
 * Mock data for Hotel Management System (HMS)
 * All data conforms to types in @/types
 */

import type {
  User,
  Location,
  Hotel,
  Room,
  Booking,
  ExtraService,
  Discount,
  StaffMember,
  HospitalityService,
  Testimonial,
  SiteStat,
} from '@/types';

/** Mongolia-only branches (cities) */
export const locations: Location[] = [
  { id: 'loc-1', name: 'Ulaanbaatar', nameMn: 'Улаанбаатар', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-2', name: 'Darkhan', nameMn: 'Дархан', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-3', name: 'Erdenet', nameMn: 'Эрдэнэт', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-4', name: 'Khovd', nameMn: 'Ховд', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-5', name: 'Uvs', nameMn: 'Увс', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-6', name: 'Orkhon', nameMn: 'Орхон', country: 'Mongolia', countryCode: 'MN' },
];

export const hospitalityServices: HospitalityService[] = [
  { id: 'hs-1', name: 'Gym', nameMn: 'Жим', tagline: 'Where Wellness Meets Excellence', taglineMn: 'Эрүүл мэнд, шилдэг үйлчилгээ', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600' },
  { id: 'hs-2', name: 'Swimming Pool', nameMn: 'Усан сан', tagline: 'Jump In & Refresh Your Senses', taglineMn: 'Сэтгэл тайван амралт', imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600' },
  { id: 'hs-3', name: 'Restaurant', nameMn: 'Ресторан', tagline: 'The Restaurant Hub', taglineMn: 'Ресторан төв', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
  { id: 'hs-4', name: 'Pick Up & Drop', nameMn: 'Тээвэр', tagline: 'Luxury Transfers, Effortless Travel', taglineMn: 'Тайван аялал', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600' },
  { id: 'hs-5', name: 'Parking Space', nameMn: 'Зогсоол', tagline: 'Safe, Spacious, & Always Available', taglineMn: 'Аюулгүй, том зай', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600' },
];

export const testimonials: Testimonial[] = [
  { id: 't-1', author: 'Emily Watson', rating: 5, text: 'Staying at RegalNest Hotel was an absolute delight! The rooms were spotless, the staff was incredibly friendly, and the view from my balcony was breathtaking. The seamless check-in process and the delicious breakfast made my trip even more memorable. I can\'t wait to come back!', roomImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
  { id: 't-2', author: 'Bat-Erdene', rating: 5, text: 'Тав тухтай ор, цэвэрхэн байр, маш сайн үйлчилгээ. Дахин ирнэ.', roomImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600' },
];

export const siteStats: SiteStat[] = [
  { value: '100k+', label: 'Satisfied Customers', labelMn: 'Сэтгэл ханамжтай зочдод' },
  { value: '15+', label: 'Years Of Experience', labelMn: 'Туршлагатай жил' },
  { value: '800+', label: 'Total Rooms', labelMn: 'Нийт өрөө' },
  { value: '12k+', label: 'Total Staffs', labelMn: 'Нийт ажилтан' },
];

export const users: User[] = [
  {
    id: 'user-1',
    email: 'guest@example.com',
    name: 'John Doe',
    phone: '+01 234 567 890',
    role: 'guest',
    locale: 'en',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'staff@bookinn.com',
    name: 'Jane Smith',
    phone: '+01 236 547 587',
    role: 'staff',
    locale: 'en',
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'user-3',
    email: 'admin@bookinn.com',
    name: 'Admin User',
    role: 'admin',
    locale: 'en',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'maria@example.com',
    name: 'Maria Garcia',
    phone: '+34 612 345 678',
    role: 'guest',
    locale: 'en',
    createdAt: '2024-03-01T12:00:00Z',
  },
  {
    id: 'user-5',
    email: 'reception@resort.com',
    name: 'Bob Wilson',
    role: 'staff',
    locale: 'en',
    createdAt: '2024-02-15T08:00:00Z',
  },
];

/** BookINN branches in Mongolia (single hotel brand) */
export const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'BookINN Ulaanbaatar',
    nameMn: 'BookINN Улаанбаатар',
    slug: 'bookinn-ulaanbaatar',
    locationId: 'loc-1',
    address: 'Sukhbaatar Square, Ulaanbaatar',
    category: 'resort',
    starRating: 5,
    description:
      'BookINN flagship branch in Ulaanbaatar. Pool, spa, restaurant, and premium rooms.',
    descriptionMn: 'Улаанбаатар дахь төв салбар. Усан сан, спа, ресторан.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Free WiFi', 'Pick Up & Drop'],
    imageUrls: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    contactEmail: 'bookinn.hotel@gmail.com',
    contactPhone: '+01 236 547 587',
    basePricePerNight: 350,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'hotel-2',
    name: 'BookINN Darkhan',
    nameMn: 'BookINN Дархан',
    slug: 'bookinn-darkhan',
    locationId: 'loc-2',
    address: 'Central Street, Darkhan',
    category: 'hotel',
    starRating: 4,
    description: 'Comfortable stay in Darkhan with restaurant and free WiFi.',
    amenities: ['Restaurant', 'Gym', 'Free WiFi', 'Parking'],
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    ],
    contactEmail: 'bookinn.hotel@gmail.com',
    contactPhone: '+01 236 547 587',
    basePricePerNight: 180,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'hotel-3',
    name: 'BookINN Erdenet',
    nameMn: 'BookINN Эрдэнэт',
    slug: 'bookinn-erdenet',
    locationId: 'loc-3',
    address: 'Mining District, Erdenet',
    category: 'hotel',
    starRating: 4,
    description: 'Business and leisure in Erdenet with pool and spa.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Parking'],
    imageUrls: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    contactEmail: 'bookinn.hotel@gmail.com',
    contactPhone: '+01 236 547 587',
    basePricePerNight: 120,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const rooms: Room[] = [
  { id: 'room-SS000001', hotelId: 'hotel-1', typeCode: 'SS', typeName: 'Standard Single', floor: 1, number: '101', status: 'available', basePricePerNight: 120, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Cozy single room with queen bed, ideal for solo travelers. Includes work desk and city view.', descriptionMn: 'Ганц зочдод тохиромжтой тав тухтай нэг ортой өрөө. Ажлын ширээ, хотын харагдацтай.' },
  { id: 'room-SD000002', hotelId: 'hotel-1', typeCode: 'SD', typeName: 'Standard Double', floor: 1, number: '102', status: 'available', basePricePerNight: 180, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV', 'Balcony'], recommended: true, description: 'Spacious double room with king bed and private balcony. Perfect for couples.', descriptionMn: 'Том давхар ор, хувийн тагтаатай. Хосуудад тохиромжтой.' },
  { id: 'room-TD000003', hotelId: 'hotel-1', typeCode: 'TD', typeName: 'Twin Deluxe', floor: 2, number: '201', status: 'occupied', basePricePerNight: 220, maxGuests: 2, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], description: 'Deluxe twin room with two double beds. Extra bed available on request.', descriptionMn: 'Хоёр давхар ортой делюкс өрөө. Нэмэлт ор хүсэлтээр боломжтой.' },
  { id: 'room-DD000004', hotelId: 'hotel-1', typeCode: 'DD', typeName: 'Deluxe Double', floor: 2, number: '202', status: 'reserved', basePricePerNight: 280, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV', 'Bathtub'], recommended: true, description: 'Premium double with bathtub and city views. Up to 3 guests with optional extra bed.', descriptionMn: 'Угаалгын өрөөтэй, хотын харагдацтай. 3 хүртэл зочдод тохиромжтой.' },
  { id: 'room-SU000005', hotelId: 'hotel-1', typeCode: 'SU', typeName: 'Suite', floor: 3, number: '301', status: 'available', basePricePerNight: 450, maxGuests: 4, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Living Room', 'Jacuzzi'], sizeSqm: 65, recommended: true, description: 'Luxury suite with separate living area and jacuzzi. 65 m² of comfort.', descriptionMn: 'Тусгаар зочлын өрөө, жаккузитай люкс сүүт. 65 м² тав тухтай зай.' },
  { id: 'room-FM000006', hotelId: 'hotel-1', typeCode: 'FM', typeName: 'Family Room', floor: 2, number: '203', status: 'cleaning', basePricePerNight: 320, maxGuests: 5, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Connecting Rooms'], sizeSqm: 45, description: 'Family-friendly room with connecting option. Sleeps up to 5 with extra beds.', descriptionMn: 'Гэр бүлд тохиромжтой, холбох өрөөний сонголттой. 5 хүртэл зочдод.' },
  { id: 'room-VP000007', hotelId: 'hotel-1', typeCode: 'VP', typeName: 'Villa with Pool', floor: 0, number: 'V1', status: 'available', basePricePerNight: 650, maxGuests: 6, maxExtraBeds: 2, amenities: ['Private Pool', 'WiFi', 'AC', 'Kitchen', 'Garden'], sizeSqm: 120, recommended: true, description: 'Private villa with pool, kitchen, and garden. Ultimate luxury for up to 6 guests.', descriptionMn: 'Хувийн усан сан, гал тогоо, цэцэрлэгтэй вилла. 6 хүртэл зочдод.' },
  { id: 'room-SS000008', hotelId: 'hotel-2', typeCode: 'SS', typeName: 'Standard Single', floor: 5, number: '501', status: 'available', basePricePerNight: 95, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Compact single room with all essentials. Great value for solo stays.', descriptionMn: 'Бүх шаардлагатай зүйлтэй нэг ортой өрөө.' },
  { id: 'room-SD000009', hotelId: 'hotel-2', typeCode: 'SD', typeName: 'Standard Double', floor: 5, number: '502', status: 'available', basePricePerNight: 140, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Comfortable double room for two. Central location in the building.', descriptionMn: 'Хоёр зочдод тохиромжтой тав тухтай давхар өрөө.' },
  { id: 'room-DD000010', hotelId: 'hotel-2', typeCode: 'DD', typeName: 'Deluxe King', floor: 8, number: '801', status: 'maintenance', basePricePerNight: 220, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], description: 'King-size bed deluxe room with premium amenities. Top floor views.', descriptionMn: 'Кинг ортой делюкс өрөө. Дээд давхартын харагдац.' },
  { id: 'room-SU000011', hotelId: 'hotel-3', typeCode: 'SU', typeName: 'Suite', floor: 0, number: 'A1', status: 'available', basePricePerNight: 120, maxGuests: 4, maxExtraBeds: 1, amenities: ['Pool', 'WiFi', 'Kitchen'], sizeSqm: 85, recommended: true, description: 'Spacious suite with pool access and kitchenette. 85 m².', descriptionMn: 'Усан сан руу гарцтай, жижиг гал тогоотой сүүт. 85 м².' },
];

export const extraServices: ExtraService[] = [
  { id: 'srv-1', name: 'Airport Transfer', nameMn: 'Нисэх онгоцны шилжилт', price: 35, perPerson: false },
  { id: 'srv-2', name: 'Breakfast Buffet', nameMn: 'Өглөөний цай', price: 25, perPerson: true, perNight: true },
  { id: 'srv-3', name: 'Spa Massage (60 min)', nameMn: 'Спа массаж', price: 80, perPerson: true },
  { id: 'srv-4', name: 'Extra Bed', nameMn: 'Нэмэлт ор', price: 40, perNight: true },
  { id: 'srv-5', name: 'Late Check-out', nameMn: 'Хожимдсон гарах', price: 50 },
  { id: 'srv-6', name: 'Diving Trip', nameMn: 'Сэлэлт', price: 120, perPerson: true },
  { id: 'srv-7', name: 'Yoga Session', nameMn: 'Йога', price: 30, perPerson: true },
];

export const discounts: Discount[] = [
  { id: 'd-1', code: 'WELCOME10', type: 'percentage', value: 10, minNights: 2, validFrom: '2024-01-01', validTo: '2025-12-31' },
  { id: 'd-2', code: 'LONGSTAY', type: 'percentage', value: 15, minNights: 5, validFrom: '2024-01-01', validTo: '2025-12-31' },
  { id: 'd-3', code: 'FLAT50', type: 'fixed', value: 50, validFrom: '2024-01-01', validTo: '2025-06-30' },
];

export const bookings: Booking[] = [
  {
    id: 'book-1',
    bookingNumber: 'BK000001',
    userId: 'user-1',
    hotelId: 'hotel-1',
    roomIds: ['room-SD000002'],
    checkIn: '2025-03-20',
    checkOut: '2025-03-23',
    nights: 3,
    guests: 2,
    status: 'confirmed',
    basePricePerNight: 180,
    totalBase: 540,
    extraPersonFee: 0,
    servicesTotal: 75,
    discountAmount: 54,
    taxAmount: 56,
    serviceChargeAmount: 56,
    totalAmount: 673,
    currency: 'USD',
    refundStatus: 'none',
    appliedDiscountCode: 'WELCOME10',
    createdAt: '2025-03-10T14:00:00Z',
    updatedAt: '2025-03-10T14:00:00Z',
  },
  {
    id: 'book-2',
    bookingNumber: 'BK000002',
    userId: 'user-4',
    hotelId: 'hotel-1',
    roomIds: ['room-SU000005'],
    checkIn: '2025-03-25',
    checkOut: '2025-03-30',
    nights: 5,
    guests: 3,
    status: 'pending',
    basePricePerNight: 420,
    totalBase: 2100,
    extraPersonFee: 0,
    servicesTotal: 250,
    discountAmount: 315,
    taxAmount: 204,
    serviceChargeAmount: 204,
    totalAmount: 2443,
    currency: 'USD',
    refundStatus: 'none',
    appliedDiscountCode: 'LONGSTAY',
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-03-15T09:00:00Z',
  },
  {
    id: 'book-3',
    bookingNumber: 'BK000003',
    userId: 'user-1',
    hotelId: 'hotel-1',
    roomIds: ['room-TD000003'],
    checkIn: '2025-03-17',
    checkOut: '2025-03-19',
    nights: 2,
    guests: 2,
    status: 'checked_in',
    basePricePerNight: 220,
    totalBase: 440,
    extraPersonFee: 0,
    servicesTotal: 0,
    discountAmount: 0,
    taxAmount: 44,
    serviceChargeAmount: 44,
    totalAmount: 528,
    currency: 'USD',
    refundStatus: 'none',
    createdAt: '2025-03-01T11:00:00Z',
    updatedAt: '2025-03-17T08:00:00Z',
  },
  {
    id: 'book-4',
    bookingNumber: 'BK000004',
    userId: 'user-4',
    hotelId: 'hotel-2',
    roomIds: ['room-SD000009'],
    checkIn: '2025-04-01',
    checkOut: '2025-04-03',
    nights: 2,
    guests: 2,
    status: 'cancelled',
    basePricePerNight: 140,
    totalBase: 280,
    extraPersonFee: 0,
    servicesTotal: 0,
    discountAmount: 28,
    taxAmount: 25,
    serviceChargeAmount: 25,
    totalAmount: 302,
    currency: 'USD',
    refundStatus: 'full',
    refundAmount: 302,
    appliedDiscountCode: 'WELCOME10',
    createdAt: '2025-03-12T16:00:00Z',
    updatedAt: '2025-03-14T10:00:00Z',
  },
];

export const staffMembers: StaffMember[] = [
  { id: 'staff-1', userId: 'user-2', hotelId: 'hotel-1', department: 'Front Desk', position: 'Receptionist', permissions: ['view_bookings', 'check_in', 'check_out'] },
  { id: 'staff-2', userId: 'user-5', hotelId: 'hotel-1', department: 'Housekeeping', position: 'Supervisor', permissions: ['view_rooms', 'update_room_status'] },
  { id: 'staff-3', userId: 'user-3', hotelId: 'hotel-1', department: 'Management', position: 'Admin', permissions: ['view_bookings', 'view_rooms', 'reports', 'manage_staff'] },
];

/** Resolve hotel by id */
export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

/** Resolve hotel by slug */
export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}

/** Resolve location by id */
export function getLocationById(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

/** Resolve rooms by hotel id */
export function getRoomsByHotelId(hotelId: string): Room[] {
  return rooms.filter((r) => r.hotelId === hotelId);
}

/** Resolve room by id */
export function getRoomById(roomId: string): Room | undefined {
  return rooms.find((r) => r.id === roomId);
}

/** Resolve bookings by hotel id */
export function getBookingsByHotelId(hotelId: string): Booking[] {
  return bookings.filter((b) => b.hotelId === hotelId);
}

/** Attach location to hotels */
export function getHotelsWithLocation(): (Hotel & { location?: Location })[] {
  return hotels.map((h) => ({
    ...h,
    location: getLocationById(h.locationId),
  }));
}

/** Recommended rooms (for homepage carousel) */
export function getRecommendedRooms(): (Room & { hotel?: Hotel })[] {
  return rooms
    .filter((r) => r.recommended === true)
    .map((r) => ({ ...r, hotel: getHotelById(r.hotelId) }));
}
