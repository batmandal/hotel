import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

// ---- Монгол нэрсийн сан ----
const LAST_NAMES = [
  'Батболд', 'Ганболд', 'Эрдэнэ', 'Баатар', 'Дорж', 'Цэрэн', 'Мөнх', 'Төмөр',
  'Энх', 'Болд', 'Сүх', 'Бат', 'Оюун', 'Нар', 'Хүрэл', 'Алтан', 'Ган', 'Тулга',
  'Бямба', 'Чулуун', 'Тамир', 'Дэлгэр', 'Жаргал', 'Хишиг', 'Цог',
];
const FIRST_NAMES = [
  'Итгэл', 'Сарнай', 'Номин', 'Тэмүүлэн', 'Анужин', 'Болормаа', 'Оюунчимэг',
  'Мөнхзул', 'Золзаяа', 'Энхжин', 'Ариунаа', 'Батчимэг', 'Дэлгэрмаа', 'Нарангэрэл',
  'Отгонбаяр', 'Пүрэвсүрэн', 'Ганзориг', 'Түвшинбаяр', 'Мөнхбат', 'Эрдэнэбат',
  'Баярмаа', 'Цэцэгмаа', 'Ундрах', 'Хулан', 'Сайнбилэг', 'Амарсанаа', 'Батжаргал',
  'Алтанцэцэг', 'Мягмарсүрэн', 'Энхтүвшин', 'Баасансүрэн', 'Содном', 'Лхагва',
  'Должин', 'Нямдаваа', 'Ганцэцэг', 'Цэнгэл', 'Дуламсүрэн', 'Батцэцэг', 'Одгэрэл',
];

const DEPARTMENTS = ['Front Desk', 'Housekeeping', 'Restaurant', 'Security', 'Spa & Wellness', 'Management', 'Maintenance', 'Concierge'];
const POSITIONS: Record<string, string[]> = {
  'Front Desk': ['Receptionist', 'Night Auditor', 'Front Desk Manager'],
  'Housekeeping': ['Room Attendant', 'Supervisor', 'Laundry Staff'],
  'Restaurant': ['Waiter', 'Chef', 'Bartender', 'Restaurant Manager'],
  'Security': ['Security Guard', 'Security Manager'],
  'Spa & Wellness': ['Massage Therapist', 'Spa Receptionist', 'Fitness Trainer'],
  'Management': ['General Manager', 'HR Manager', 'Admin'],
  'Maintenance': ['Technician', 'Electrician', 'Plumber'],
  'Concierge': ['Concierge', 'Bellboy', 'Driver'],
};
const DEPT_PERMISSIONS: Record<string, string[]> = {
  'Front Desk': ['view_bookings', 'check_in', 'check_out', 'view_rooms'],
  'Housekeeping': ['view_rooms', 'update_room_status'],
  'Restaurant': ['view_bookings'],
  'Security': ['view_rooms'],
  'Spa & Wellness': ['view_bookings'],
  'Management': ['view_bookings', 'view_rooms', 'reports', 'manage_staff', 'manage_users'],
  'Maintenance': ['view_rooms', 'update_room_status'],
  'Concierge': ['view_bookings', 'view_rooms'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefixes = ['88', '89', '90', '91', '94', '95', '96', '97', '98', '99'];
  return `+976 ${pick(prefixes)}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
}

async function main() {
  console.log('Seeding database (20 staff + 50 guests)...');

  // Clean existing data
  await prisma.bookingService.deleteMany();
  await prisma.bookingRoom.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.room.deleteMany();
  await prisma.extraService.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
  console.log('  Cleared existing data.');

  // ---- Locations ----
  await Promise.all([
    prisma.location.create({ data: { id: 'loc-1', name: 'Ulaanbaatar', nameMn: 'Улаанбаатар', country: 'Mongolia', countryCode: 'MN' } }),
    prisma.location.create({ data: { id: 'loc-2', name: 'Darkhan', nameMn: 'Дархан', country: 'Mongolia', countryCode: 'MN' } }),
    prisma.location.create({ data: { id: 'loc-3', name: 'Erdenet', nameMn: 'Эрдэнэт', country: 'Mongolia', countryCode: 'MN' } }),
    prisma.location.create({ data: { id: 'loc-4', name: 'Khovd', nameMn: 'Ховд', country: 'Mongolia', countryCode: 'MN' } }),
    prisma.location.create({ data: { id: 'loc-5', name: 'Uvs', nameMn: 'Увс', country: 'Mongolia', countryCode: 'MN' } }),
    prisma.location.create({ data: { id: 'loc-6', name: 'Orkhon', nameMn: 'Орхон', country: 'Mongolia', countryCode: 'MN' } }),
  ]);
  console.log('  Created 6 locations.');

  // ---- Demo accounts (3) ----
  await Promise.all([
    prisma.user.create({ data: { id: 'user-demo-guest', email: 'user@demo.mn', name: 'Демо зочин', phone: '99112233', password: 'user123', role: 'guest', locale: 'mn' } }),
    prisma.user.create({ data: { id: 'user-demo-staff', email: 'ajiltan@demo.mn', name: 'Демо ажилтан', phone: '88112233', password: 'staff123', role: 'staff', locale: 'mn' } }),
    prisma.user.create({ data: { id: 'user-demo-admin', email: 'admin@demo.mn', name: 'Демо админ', phone: '77112233', password: 'admin123', role: 'admin', locale: 'mn' } }),
  ]);
  console.log('  Created 3 demo accounts.');

  // ---- 20 Staff users ----
  const usedEmails = new Set(['user@demo.mn', 'ajiltan@demo.mn', 'admin@demo.mn']);
  const staffUsers: { id: string; dept: string; pos: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const name = `${lastName} ${firstName}`;
    const emailBase = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}${i}`;
    const email = `${emailBase}@ubhotel.mn`;
    if (usedEmails.has(email)) continue;
    usedEmails.add(email);

    const dept = DEPARTMENTS[(i - 1) % DEPARTMENTS.length];
    const positions = POSITIONS[dept];
    const pos = positions[(i - 1) % positions.length];
    const id = `staff-user-${i}`;

    await prisma.user.create({
      data: {
        id,
        email,
        name,
        phone: generatePhone(),
        password: 'staff123',
        role: i <= 2 ? 'admin' : 'staff',
        locale: 'mn',
      },
    });

    staffUsers.push({ id, dept, pos });
  }
  console.log(`  Created 20 staff users.`);

  // ---- 50 Guest users ----
  const guestIds: string[] = [];
  for (let i = 1; i <= 50; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const name = `${lastName} ${firstName}`;
    const emailBase = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}${i}`;
    const email = `${emailBase}@mail.mn`;
    if (usedEmails.has(email)) {
      const altEmail = `${emailBase}${Math.floor(Math.random() * 99)}@mail.mn`;
      usedEmails.add(altEmail);
      const id = `guest-${i}`;
      guestIds.push(id);
      await prisma.user.create({
        data: { id, email: altEmail, name, phone: generatePhone(), password: 'guest123', role: 'guest', locale: i % 5 === 0 ? 'en' : 'mn' },
      });
    } else {
      usedEmails.add(email);
      const id = `guest-${i}`;
      guestIds.push(id);
      await prisma.user.create({
        data: { id, email, name, phone: generatePhone(), password: 'guest123', role: 'guest', locale: i % 5 === 0 ? 'en' : 'mn' },
      });
    }
  }
  console.log(`  Created 50 guest users.`);

  // ---- Hotel ----
  await prisma.hotel.create({
    data: {
      id: 'hotel-1',
      name: 'UbHotel',
      nameMn: 'UbHotel',
      slug: 'ubhotel-ulaanbaatar',
      locationId: 'loc-1',
      address: 'Sukhbaatar Square, Ulaanbaatar',
      category: 'hotel',
      starRating: 5,
      description: 'UbHotel is a 5-star hotel in the heart of Ulaanbaatar.',
      descriptionMn: 'Улаанбаатар хотын төвд байрлах 5 одтой зочид буудал.',
      amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Free WiFi', 'Parking'],
      imageUrls: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      ],
      contactEmail: 'info@ubhotel.mn',
      contactPhone: '+976 7011 2233',
      basePricePerNight: 120,
      currency: 'USD',
    },
  });
  console.log('  Created hotel: UbHotel');

  // ---- Rooms (11) ----
  const roomData = [
    { id: 'room-SS000001', typeCode: 'SS' as const, typeName: 'Standard Single', floor: 1, number: '101', status: 'available' as const, basePricePerNight: 120, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], imageUrls: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200'] },
    { id: 'room-SD000002', typeCode: 'SD' as const, typeName: 'Standard Double', floor: 1, number: '102', status: 'available' as const, basePricePerNight: 180, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV', 'Balcony'], recommended: true, imageUrls: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200'] },
    { id: 'room-TD000003', typeCode: 'TD' as const, typeName: 'Twin Deluxe', floor: 2, number: '201', status: 'occupied' as const, basePricePerNight: 220, maxGuests: 2, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], imageUrls: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'] },
    { id: 'room-DD000004', typeCode: 'DD' as const, typeName: 'Deluxe Double', floor: 2, number: '202', status: 'reserved' as const, basePricePerNight: 280, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV', 'Bathtub'], recommended: true, imageUrls: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'] },
    { id: 'room-SU000005', typeCode: 'SU' as const, typeName: 'Suite', floor: 3, number: '301', status: 'available' as const, basePricePerNight: 450, maxGuests: 4, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Living Room', 'Jacuzzi'], sizeSqm: 65, recommended: true, imageUrls: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200'] },
    { id: 'room-FM000006', typeCode: 'FM' as const, typeName: 'Family Room', floor: 2, number: '203', status: 'cleaning' as const, basePricePerNight: 320, maxGuests: 5, maxExtraBeds: 2, amenities: ['WiFi', 'AC', 'TV', 'Connecting Rooms'], sizeSqm: 45, imageUrls: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200'] },
    { id: 'room-SU000007', typeCode: 'SU' as const, typeName: 'Executive Suite', floor: 10, number: '1001', status: 'available' as const, basePricePerNight: 650, maxGuests: 4, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV', 'Living Room', 'Workspace'], sizeSqm: 75, recommended: true, imageUrls: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'] },
    { id: 'room-SS000008', typeCode: 'SS' as const, typeName: 'Standard Single', floor: 5, number: '501', status: 'available' as const, basePricePerNight: 95, maxGuests: 1, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], imageUrls: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'] },
    { id: 'room-SD000009', typeCode: 'SD' as const, typeName: 'Standard Double', floor: 5, number: '502', status: 'available' as const, basePricePerNight: 140, maxGuests: 2, maxExtraBeds: 0, amenities: ['WiFi', 'AC', 'TV'], imageUrls: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200'] },
    { id: 'room-DD000010', typeCode: 'DD' as const, typeName: 'Deluxe King', floor: 8, number: '801', status: 'maintenance' as const, basePricePerNight: 220, maxGuests: 3, maxExtraBeds: 1, amenities: ['WiFi', 'AC', 'TV'], imageUrls: ['https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200'] },
    { id: 'room-SU000011', typeCode: 'SU' as const, typeName: 'Suite', floor: 0, number: 'A1', status: 'available' as const, basePricePerNight: 120, maxGuests: 4, maxExtraBeds: 1, amenities: ['Pool', 'WiFi', 'Kitchen'], sizeSqm: 85, recommended: true, imageUrls: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200'] },
  ];
  await Promise.all(roomData.map((r) => prisma.room.create({ data: { ...r, hotelId: 'hotel-1' } })));
  console.log('  Created 11 rooms.');

  // ---- Extra Services ----
  await Promise.all([
    prisma.extraService.create({ data: { id: 'srv-1', name: 'Airport Transfer', nameMn: 'Нисэх онгоцны шилжилт', price: 35 } }),
    prisma.extraService.create({ data: { id: 'srv-2', name: 'Breakfast Buffet', nameMn: 'Өглөөний цай', price: 25, perPerson: true, perNight: true } }),
    prisma.extraService.create({ data: { id: 'srv-3', name: 'Spa Massage (60 min)', nameMn: 'Спа массаж', price: 80, perPerson: true } }),
    prisma.extraService.create({ data: { id: 'srv-4', name: 'Extra Bed', nameMn: 'Нэмэлт ор', price: 40, perNight: true } }),
    prisma.extraService.create({ data: { id: 'srv-5', name: 'Late Check-out', nameMn: 'Хожимдсон гарах', price: 50 } }),
    prisma.extraService.create({ data: { id: 'srv-6', name: 'Diving Trip', nameMn: 'Сэлэлт', price: 120, perPerson: true } }),
    prisma.extraService.create({ data: { id: 'srv-7', name: 'Yoga Session', nameMn: 'Йога', price: 30, perPerson: true } }),
  ]);
  console.log('  Created 7 extra services.');

  // ---- Discounts ----
  await Promise.all([
    prisma.discount.create({ data: { id: 'd-1', code: 'WELCOME10', type: 'percentage', value: 10, minNights: 2, validFrom: new Date('2024-01-01'), validTo: new Date('2025-12-31') } }),
    prisma.discount.create({ data: { id: 'd-2', code: 'LONGSTAY', type: 'percentage', value: 15, minNights: 5, validFrom: new Date('2024-01-01'), validTo: new Date('2025-12-31') } }),
    prisma.discount.create({ data: { id: 'd-3', code: 'FLAT50', type: 'fixed', value: 50, validFrom: new Date('2024-01-01'), validTo: new Date('2025-06-30') } }),
  ]);
  console.log('  Created 3 discounts.');

  // ---- 20 Staff Members ----
  // Demo staff member
  await prisma.staffMember.create({
    data: { id: 'staff-demo', userId: 'user-demo-staff', hotelId: 'hotel-1', department: 'Front Desk', position: 'Receptionist', permissions: ['view_bookings', 'check_in', 'check_out'] },
  });
  // Demo admin staff member
  await prisma.staffMember.create({
    data: { id: 'staff-demo-admin', userId: 'user-demo-admin', hotelId: 'hotel-1', department: 'Management', position: 'Admin', permissions: ['view_bookings', 'view_rooms', 'reports', 'manage_staff', 'manage_users'] },
  });

  for (let i = 0; i < staffUsers.length; i++) {
    const s = staffUsers[i];
    await prisma.staffMember.create({
      data: {
        id: `staff-${i + 1}`,
        userId: s.id,
        hotelId: 'hotel-1',
        department: s.dept,
        position: s.pos,
        permissions: DEPT_PERMISSIONS[s.dept] || ['view_rooms'],
      },
    });
  }
  console.log(`  Created ${staffUsers.length + 2} staff members (20 + 2 demo).`);

  // ---- Bookings (олон захиалга, янз бүрийн зочдоос) ----
  const roomIds = roomData.map((r) => r.id);
  const statuses: Array<'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'> = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];
  const discountIds = ['d-1', 'd-2', 'd-3', null, null, null]; // 50% chance no discount
  const prices = [95, 120, 140, 180, 220, 280, 320, 450, 650];

  let bookingNum = 0;
  for (let i = 0; i < 30; i++) {
    bookingNum++;
    const guestId = guestIds[i % guestIds.length];
    const roomId = roomIds[i % roomIds.length];
    const status = statuses[i % statuses.length];
    const basePrice = prices[i % prices.length];
    const nights = 1 + (i % 7);
    const guests = 1 + (i % 3);
    const totalBase = basePrice * nights;
    const discountId = discountIds[i % discountIds.length];
    const discountAmount = discountId === 'd-1' ? totalBase * 0.1 : discountId === 'd-2' ? totalBase * 0.15 : discountId === 'd-3' ? 50 : 0;
    const subtotal = totalBase - discountAmount;
    const taxAmount = Math.round(subtotal * 0.1);
    const serviceCharge = Math.round(subtotal * 0.1);
    const totalAmount = Math.round(subtotal + taxAmount + serviceCharge);
    const refundStatus = status === 'cancelled' ? 'full' as const : 'none' as const;
    const refundAmount = status === 'cancelled' ? totalAmount : undefined;

    // Огноог 2025 оны 1-р сараас 6-р сар хүртэл тараах
    const monthOffset = i % 6;
    const dayOffset = (i * 3) % 28;
    const checkIn = new Date(2025, monthOffset, 1 + dayOffset);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);

    await prisma.booking.create({
      data: {
        id: `book-${bookingNum}`,
        bookingNumber: `BK${String(bookingNum).padStart(6, '0')}`,
        userId: guestId,
        hotelId: 'hotel-1',
        checkIn,
        checkOut,
        nights,
        guests,
        status,
        basePricePerNight: basePrice,
        totalBase,
        extraPersonFee: 0,
        servicesTotal: 0,
        discountAmount,
        taxAmount,
        serviceChargeAmount: serviceCharge,
        totalAmount,
        currency: 'USD',
        refundStatus,
        refundAmount,
        discountId: discountId ?? undefined,
        rooms: { create: [{ roomId }] },
      },
    });
  }
  console.log(`  Created ${bookingNum} bookings.`);

  // ---- Тоог шалгах ----
  const counts = {
    users: await prisma.user.count(),
    guests: await prisma.user.count({ where: { role: 'guest' } }),
    staffUsers: await prisma.user.count({ where: { role: { in: ['staff', 'admin'] } } }),
    staffMembers: await prisma.staffMember.count(),
    rooms: await prisma.room.count(),
    bookings: await prisma.booking.count(),
  };

  console.log('\n=== Seed Summary ===');
  console.log(`  Нийт хэрэглэгч: ${counts.users}`);
  console.log(`  Зочид (guest):   ${counts.guests}`);
  console.log(`  Ажилтан (staff/admin users): ${counts.staffUsers}`);
  console.log(`  Staff members:    ${counts.staffMembers}`);
  console.log(`  Өрөө:            ${counts.rooms}`);
  console.log(`  Захиалга:         ${counts.bookings}`);
  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
