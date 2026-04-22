-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('guest', 'staff', 'admin', 'hotel_owner');

-- CreateEnum
CREATE TYPE "RoomTypeCode" AS ENUM ('SS', 'SD', 'TD', 'DD', 'SU', 'FM', 'VP');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('available', 'occupied', 'maintenance', 'reserved', 'cleaning');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('none', 'partial', 'full', 'processing');

-- CreateEnum
CREATE TYPE "HotelCategory" AS ENUM ('resort', 'hotel', 'villa', 'apartment', 'hostel', 'lodge', 'boutique');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'mn');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'guest',
    "locale" "Locale" NOT NULL DEFAULT 'mn',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_mn" TEXT,
    "country" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_mn" TEXT,
    "slug" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "category" "HotelCategory" NOT NULL DEFAULT 'hotel',
    "star_rating" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "description_mn" TEXT,
    "amenities" TEXT[],
    "image_urls" TEXT[],
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "base_price_per_night" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "type_code" "RoomTypeCode" NOT NULL,
    "type_name" TEXT NOT NULL,
    "type_name_mn" TEXT,
    "floor" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'available',
    "base_price_per_night" DOUBLE PRECISION NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "max_extra_beds" INTEGER NOT NULL DEFAULT 0,
    "beds" INTEGER,
    "size_sqm" INTEGER,
    "amenities" TEXT[],
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "description_mn" TEXT,
    "image_urls" TEXT[],
    "video_url" TEXT,
    "video_thumbnail_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_mn" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "per_person" BOOLEAN NOT NULL DEFAULT false,
    "per_night" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "extra_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "min_nights" INTEGER,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "booking_number" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "nights" INTEGER NOT NULL,
    "guests" INTEGER NOT NULL,
    "extra_beds" INTEGER NOT NULL DEFAULT 0,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "base_price_per_night" DOUBLE PRECISION NOT NULL,
    "total_base" DOUBLE PRECISION NOT NULL,
    "extra_person_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "services_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service_charge_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "refund_status" "RefundStatus" NOT NULL DEFAULT 'none',
    "refund_amount" DOUBLE PRECISION,
    "discount_id" TEXT,
    "special_requests" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_rooms" (
    "booking_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "booking_rooms_pkey" PRIMARY KEY ("booking_id","room_id")
);

-- CreateTable
CREATE TABLE "booking_services" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "booking_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_slug_key" ON "hotels"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_hotel_id_number_key" ON "rooms"("hotel_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_code_key" ON "discounts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_number_key" ON "bookings"("booking_number");

-- CreateIndex
CREATE INDEX "bookings_hotel_id_check_in_idx" ON "bookings"("hotel_id", "check_in");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_members_user_id_key" ON "staff_members"("user_id");

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_services" ADD CONSTRAINT "booking_services_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_services" ADD CONSTRAINT "booking_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "extra_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
