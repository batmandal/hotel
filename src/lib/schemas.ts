import { z } from 'zod';

export const bookingFormSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1).max(20),
  roomId: z.string().min(1, 'Please select a room'),
  discountCode: z.string().optional(),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'Code must be 6 digits'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
