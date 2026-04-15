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

/** Байршлын мэдээлэл */
export const locations: Location[] = [
  { id: 'loc-1', name: 'Ulaanbaatar', nameMn: 'Улаанбаатар', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-2', name: 'Darkhan', nameMn: 'Дархан', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-3', name: 'Erdenet', nameMn: 'Эрдэнэт', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-4', name: 'Khovd', nameMn: 'Ховд', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-5', name: 'Uvs', nameMn: 'Увс', country: 'Mongolia', countryCode: 'MN' },
  { id: 'loc-6', name: 'Orkhon', nameMn: 'Орхон', country: 'Mongolia', countryCode: 'MN' },
];

export const hospitalityServices: HospitalityService[] = [
  { id: 'hs-1', name: 'Gym', nameMn: 'Жим', tagline: 'Where Wellness Meets Excellence', taglineMn: 'Эрүүл мэнд, шилдэг үйлчилгээ', imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600' },
  { id: 'hs-2', name: 'Swimming Pool', nameMn: 'Усан сан', tagline: 'Jump In & Refresh Your Senses', taglineMn: 'Сэтгэл тайван амралт', imageUrl: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600' },
  { id: 'hs-3', name: 'Restaurant', nameMn: 'Ресторан', tagline: 'The Restaurant Hub', taglineMn: 'Ресторан төв', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600' },
  { id: 'hs-5', name: 'Parking Space', nameMn: 'Зогсоол', tagline: 'Safe, Spacious, & Always Available', taglineMn: 'Аюулгүй, том зай', imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600' },
];

export const testimonials: Testimonial[] = [
  { id: 't-1', author: 'Анужин Баяр', rating: 5, text: 'UbHotel зочид буудалд байрлах нь үнэхээр гайхалтай байлаа! Өрөөнүүд нь цэвэр цэмцгэр, ажилчид найрсаг, бас тагтнаас харагдах байдал үнэхээр тансаг. Өглөөний цай ч маш амттай байсан тул дахин ирэхдээ маш их баяртай байх болно!', roomImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
  { id: 't-2', author: 'Бат-Эрдэнэ', rating: 5, text: 'Тав тухтай ор, цэвэрхэн байр, маш сайн үйлчилгээ. Дахин ирнэ.', roomImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600' },
];

export const siteStats: SiteStat[] = [
  { value: '2,400+', label: 'Satisfied Customers', labelMn: 'Сэтгэл ханамжтай зочид' },
  { value: '5+', label: 'Years Of Experience', labelMn: 'Туршлагатай жил' },
  { value: '45+', label: 'Total Rooms', labelMn: 'Нийт өрөө' },
  { value: '60+', label: 'Total Staff', labelMn: 'Нийт ажилтан' },
];

export const users: User[] = [
  {
    id: 'user-1',
    email: 'guest@example.com',
    name: 'Итгэл Батболд',
    phone: '+976 89112233',
    role: 'guest',
    locale: 'mn',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'staff@ubhotel.mn',
    name: 'Сарнай Ганболд',
    phone: '+976 99112233',
    role: 'staff',
    locale: 'mn',
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'user-3',
    email: 'admin@ubhotel.mn',
    name: 'Админ Бат',
    role: 'admin',
    locale: 'mn',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    email: 'nomin@example.com',
    name: 'Номин Эрдэнэ',
    phone: '+976 88123456',
    role: 'guest',
    locale: 'mn',
    createdAt: '2024-03-01T12:00:00Z',
  },
  {
    id: 'user-5',
    email: 'reception@resort.com',
    name: 'Тэмүүлэн Энх',
    role: 'staff',
    locale: 'mn',
    createdAt: '2024-02-15T08:00:00Z',
  },
];

/** UbHotel — Улаанбаатарын ганц буудал */
export const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'UbHotel',
    nameMn: 'UbHotel',
    slug: 'ubhotel-ulaanbaatar',
    locationId: 'loc-1',
    address: 'Sukhbaatar Square, Ulaanbaatar',
    category: 'hotel',
    starRating: 5,
    description:
      'UbHotel is a 5-star hotel in the heart of Ulaanbaatar. Modern rooms, business facilities, restaurant, pool, spa, and premium service.',
    descriptionMn: 'Улаанбаатар хотын төвд байрлах 5 одтой зочид буудал. Орчин үеийн өрөө, бизнес үйлчилгээ, ресторан, усан сан, спа.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Free WiFi', 'Parking'],
    imageUrls: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    ],
    contactEmail: 'info@ubhotel.mn',
    contactPhone: '+976 7011 2233',
    basePricePerNight: 120,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

/** Өрөө бүрт давтагдахгүй зураг — main + gallery (3 зураг тутамд) */
const ROOM_IMAGES: string[][] = [
  // room-SS000001: Standard Single (hotel-1)
  [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
    'https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=1200',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200',
  ],
  // room-SD000002: Standard Double (hotel-1)
  [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200',
  ],
  // room-TD000003: Twin Deluxe (hotel-1)
  [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
    'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1200',
  ],
  // room-DD000004: Deluxe Double (hotel-1)
  [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200',
    'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=1200',
  ],
  // room-SU000005: Suite (hotel-1)
  [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200',
  ],
  // room-FM000006: Family Room (hotel-1)
  [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200',
  ],
  // room-SU000007: Executive Suite (hotel-1)
  [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  ],
  // room-SS000008: Standard Single
  [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200',
    'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=1200',
  ],
  // room-SD000009: Standard Double
  [
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200',
    'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1200',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
  ],
  // room-DD000010: Deluxe King
  [
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200',
    'https://images.unsplash.com/photo-1605346576608-92f1346b67d6?w=1200',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200',
  ],
  // room-SU000011: Suite
  [
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200',
    'https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200',
  ],
];

const roomSeeds: Array<Omit<Room, 'imageUrls'>> = [
  { id: 'room-SS000001', hotelId: 'hotel-1', typeCode: 'SS', typeName: 'Standard Single', floor: 1, number: '101', status: 'available', basePricePerNight: 120, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Cozy single room with queen bed, ideal for solo travelers. Includes work desk and city view.', descriptionMn: 'Ганц зочдод тохиромжтой тав тухтай нэг ортой өрөө. Ажлын ширээ, хотын харагдацтай.' },
  { id: 'room-SD000002', hotelId: 'hotel-1', typeCode: 'SD', typeName: 'Standard Double', floor: 1, number: '102', status: 'available', basePricePerNight: 180, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV', 'Balcony'], recommended: true, description: 'Spacious double room with king bed and private balcony. Perfect for couples.', descriptionMn: 'Том давхар ор, хувийн тагтаатай. Хосуудад тохиромжтой.' },
  { id: 'room-TD000003', hotelId: 'hotel-1', typeCode: 'TD', typeName: 'Twin Deluxe', floor: 2, number: '201', status: 'occupied', basePricePerNight: 220, maxGuests: 2, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], description: 'Deluxe twin room with two double beds. Extra bed available on request.', descriptionMn: 'Хоёр давхар ортой делюкс өрөө. Нэмэлт ор хүсэлтээр боломжтой.' },
  { id: 'room-DD000004', hotelId: 'hotel-1', typeCode: 'DD', typeName: 'Deluxe Double', floor: 2, number: '202', status: 'reserved', basePricePerNight: 280, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV', 'Bathtub'], recommended: true, description: 'Premium double with bathtub and city views. Up to 3 guests with optional extra bed.', descriptionMn: 'Угаалгын өрөөтэй, хотын харагдацтай. 3 хүртэл зочдод тохиромжтой.' },
  { id: 'room-SU000005', hotelId: 'hotel-1', typeCode: 'SU', typeName: 'Suite', floor: 3, number: '301', status: 'available', basePricePerNight: 450, maxGuests: 4, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Living Room', 'Jacuzzi'], sizeSqm: 65, recommended: true, description: 'Luxury suite with separate living area and jacuzzi. 65 m² of comfort.', descriptionMn: 'Тусгаар зочлын өрөө, жаккузитай люкс сүүт. 65 м² тав тухтай зай.' },
  { id: 'room-FM000006', hotelId: 'hotel-1', typeCode: 'FM', typeName: 'Family Room', floor: 2, number: '203', status: 'cleaning', basePricePerNight: 320, maxGuests: 5, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Connecting Rooms'], sizeSqm: 45, description: 'Family-friendly room with connecting option. Sleeps up to 5 with extra beds.', descriptionMn: 'Гэр бүлд тохиромжтой, холбох өрөөний сонголттой. 5 хүртэл зочдод.' },
  { id: 'room-SU000007', hotelId: 'hotel-1', typeCode: 'SU', typeName: 'Executive Suite', floor: 10, number: '1001', status: 'available', basePricePerNight: 650, maxGuests: 4, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV', 'Living Room', 'Workspace'], sizeSqm: 75, recommended: true, description: 'Executive suite with separate living area and workspace. Ideal for business travelers.', descriptionMn: 'Тусгаар зочлын хэсэг, ажлын булантай executive suite. Бизнес аялалд тохиромжтой.' },
  { id: 'room-SS000008', hotelId: 'hotel-1', typeCode: 'SS', typeName: 'Standard Single', floor: 5, number: '501', status: 'available', basePricePerNight: 95, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Compact single room with all essentials. Great value for solo stays.', descriptionMn: 'Бүх шаардлагатай зүйлтэй нэг ортой өрөө.' },
  { id: 'room-SD000009', hotelId: 'hotel-1', typeCode: 'SD', typeName: 'Standard Double', floor: 5, number: '502', status: 'available', basePricePerNight: 140, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], description: 'Comfortable double room for two. Central location in the building.', descriptionMn: 'Хоёр зочдод тохиромжтой тав тухтай давхар өрөө.' },
  { id: 'room-DD000010', hotelId: 'hotel-1', typeCode: 'DD', typeName: 'Deluxe King', floor: 8, number: '801', status: 'maintenance', basePricePerNight: 220, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], description: 'King-size bed deluxe room with premium amenities. Top floor views.', descriptionMn: 'Кинг ортой делюкс өрөө. Дээд давхартын харагдац.' },
  { id: 'room-SU000011', hotelId: 'hotel-1', typeCode: 'SU', typeName: 'Suite', floor: 0, number: 'A1', status: 'available', basePricePerNight: 120, maxGuests: 4, maxExtraBeds: 1, amenities: ['Pool', 'WiFi', 'Kitchen'], sizeSqm: 85, recommended: true, description: 'Spacious suite with pool access and kitchenette. 85 m².', descriptionMn: 'Усан сан руу гарцтай, жижиг гал тогоотой сүүт. 85 м².' },
];

export const rooms: Room[] = roomSeeds.map((r, i) => ({
  ...r,
  imageUrls: ROOM_IMAGES[i] ?? ROOM_IMAGES[0],
}));

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
    hotelId: 'hotel-1',
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
