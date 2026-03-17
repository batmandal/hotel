/**
 * Shared types for Hotel Management System (HMS)
 * ID format: XX000000 (SS=Standard Single, SD=Standard Double, TD=Twin, DD=Deluxe, SU=Suite, FM=Family, VP=Villa/Pool)
 */

export type RoomTypeCode = 'SS' | 'SD' | 'TD' | 'DD' | 'SU' | 'FM' | 'VP';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved' | 'cleaning';

export type UserRole = 'guest' | 'staff' | 'admin' | 'hotel_owner';

export type RefundStatus = 'none' | 'partial' | 'full' | 'processing';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  locale: 'en' | 'mn';
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  nameMn?: string;
  country: string;
  countryCode: string;
}

export interface Hotel {
  id: string;
  name: string;
  nameMn?: string;
  slug: string;
  locationId: string;
  location?: Location;
  address: string;
  category: HotelCategory;
  starRating: number;
  description: string;
  descriptionMn?: string;
  amenities: string[];
  imageUrls: string[];
  contactEmail: string;
  contactPhone: string;
  basePricePerNight: number;
  currency: string;
  createdAt: string;
}

export type HotelCategory =
  | 'resort'
  | 'hotel'
  | 'villa'
  | 'apartment'
  | 'hostel'
  | 'lodge'
  | 'boutique';

export interface Room {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  typeCode: RoomTypeCode;
  typeName: string;
  typeNameMn?: string;
  floor: number;
  number: string;
  status: RoomStatus;
  basePricePerNight: number;
  maxGuests: number;
  maxExtraBeds: number;
  amenities: string[];
  sizeSqm?: number;
  recommended?: boolean;
  description?: string;
  descriptionMn?: string;
  videoUrl?: string;
  videoThumbnailUrl?: string;
}

export interface HospitalityService {
  id: string;
  name: string;
  nameMn?: string;
  tagline: string;
  taglineMn?: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  textMn?: string;
  roomImageUrl?: string;
}

export interface SiteStat {
  value: string;
  label: string;
  labelMn?: string;
}

export interface ExtraService {
  id: string;
  name: string;
  nameMn?: string;
  price: number;
  perPerson?: boolean;
  perNight?: boolean;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minNights?: number;
  validFrom: string;
  validTo: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  user?: User;
  hotelId: string;
  hotel?: Hotel;
  roomIds: string[];
  rooms?: Room[];
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  extraBeds?: number;
  status: BookingStatus;
  basePricePerNight: number;
  totalBase: number;
  extraPersonFee: number;
  servicesTotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceChargeAmount: number;
  totalAmount: number;
  currency: string;
  refundStatus: RefundStatus;
  refundAmount?: number;
  appliedDiscountCode?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingService {
  bookingId: string;
  serviceId: string;
  quantity: number;
  totalPrice: number;
}

export interface StaffMember {
  id: string;
  userId: string;
  user?: User;
  hotelId: string;
  department: string;
  position: string;
  permissions: string[];
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  hotelId?: string;
  status?: BookingStatus;
}

export interface SearchParams {
  query?: string;
  locationId?: string;
  category?: HotelCategory;
  starRating?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}
