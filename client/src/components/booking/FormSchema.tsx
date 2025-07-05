import { z } from 'zod';

export const bookingFormSchema = z.object({
  hostId: z.string(),
  guestId: z.string(),
  listingId: z.string(),
  status: z.enum(['pending']),
  additionalDetails: z.string().optional(),
  hostInfo: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
