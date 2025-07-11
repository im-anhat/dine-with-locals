import { z } from 'zod';

const requestFormSchema = z.object({
  title: z.string().min(2).max(100),
  locationType: z.enum(['home', 'res', 'either']),
  locationId: z.string().min(1, 'Location is required'),
  interestTopic: z.array(z.string()).optional(),
  time: z.date(),
  cuisine: z.array(z.string()).optional(),
  dietaryRestriction: z.array(z.string()).optional(),
  numGuests: z.number().positive(),
  additionalInfo: z.string().optional(),
  status: z.enum(['waiting', 'pending', 'approved']),
});

export default requestFormSchema;