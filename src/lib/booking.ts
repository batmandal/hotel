/**
 * Booking logic: Total = (Base × Nights × Rooms) + Extra Person Fee + Services - Discounts + Tax + Service Charge
 * ID format: XX000000 (room type codes)
 */

import type { Discount, ExtraService } from '@/types';

const TAX_RATE = 0.1;
const SERVICE_CHARGE_RATE = 0.1;

export interface PriceBreakdown {
  totalBase: number;
  extraPersonFee: number;
  servicesTotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
  serviceChargeAmount: number;
  totalAmount: number;
}

export interface BookingPriceInput {
  basePricePerNight: number;
  nights: number;
  roomCount: number;
  guests: number;
  maxGuestsPerRoom: number;
  extraBedCount?: number;
  extraBedPricePerNight?: number;
  services?: { service: ExtraService; quantity: number; perNight?: boolean }[];
  discount?: Discount | null;
  currency?: string;
}

export function calculateBookingTotal(input: BookingPriceInput): PriceBreakdown {
  const {
    basePricePerNight,
    nights,
    roomCount,
    guests,
    maxGuestsPerRoom,
    extraBedCount = 0,
    extraBedPricePerNight = 40,
    services = [],
    discount,
  } = input;

  const totalBase = basePricePerNight * nights * roomCount;
  const includedGuests = roomCount * maxGuestsPerRoom;
  const extraGuests = Math.max(0, guests - includedGuests);
  const extraPersonFee = extraGuests * 25 * nights; // 25 per extra person per night (mock)
  const extraBedTotal = (extraBedPricePerNight ?? 0) * nights * (extraBedCount ?? 0);
  const servicesTotal =
    services.reduce((sum, { service, quantity, perNight }) => {
      const mult = perNight ? nights * quantity : quantity;
      return sum + (service.price ?? 0) * mult * (service.perPerson ? guests : 1);
    }, 0) + extraBedTotal;

  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percentage' && (!discount.minNights || nights >= discount.minNights)) {
      discountAmount = (totalBase + extraPersonFee + servicesTotal) * (discount.value / 100);
    } else if (discount.type === 'fixed') {
      discountAmount = Math.min(discount.value, totalBase + extraPersonFee + servicesTotal);
    }
  }

  const subtotalAfterDiscount = totalBase + extraPersonFee + servicesTotal - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * TAX_RATE * 100) / 100;
  const serviceChargeAmount = Math.round(subtotalAfterDiscount * SERVICE_CHARGE_RATE * 100) / 100;
  const totalAmount = Math.round((subtotalAfterDiscount + taxAmount + serviceChargeAmount) * 100) / 100;

  return {
    totalBase,
    extraPersonFee,
    servicesTotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    serviceChargeAmount,
    totalAmount,
  };
}

/**
 * Refund percentage based on days before check-in (BD05)
 */
export function getRefundPercentage(daysUntilCheckIn: number): number {
  if (daysUntilCheckIn >= 30) return 100;
  if (daysUntilCheckIn >= 14) return 75;
  if (daysUntilCheckIn >= 7) return 50;
  if (daysUntilCheckIn >= 3) return 25;
  return 0;
}

export function calculateRefundAmount(
  totalPaid: number,
  checkInDate: string
): { percentage: number; amount: number } {
  const checkIn = new Date(checkInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkIn.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const percentage = getRefundPercentage(daysUntil);
  const amount = Math.round((totalPaid * percentage) / 100 * 100) / 100;
  return { percentage, amount };
}
